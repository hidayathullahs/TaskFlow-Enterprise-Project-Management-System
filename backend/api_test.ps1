$TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmZGUwYmJhZC0yZGY5LTQ0NGMtYmU0My00MGY1NzI4MWJkOTciLCJpYXQiOjE3ODQ3MjQzMjgsImV4cCI6MTc4NDgxMDcyOH0.dkkXXiWb93Avy-VD5j8GUHu2_nYLHKz6Gr1nVkKqgF4"
$BASE = "http://localhost:8080/api/v1"
$H = @("Authorization: Bearer $TOKEN", "Content-Type: application/json")
$results = @()

function Invoke-API {
    param($method, $url, $bodyPath = $null)
    $code = ""
    if ($bodyPath) {
        $code = curl.exe -s -o "$env:TEMP\tf_out.json" -w "%{http_code}" -X $method $url `
            -H "Authorization: Bearer $TOKEN" `
            -H "Content-Type: application/json" `
            --data-binary "@$bodyPath"
    } else {
        $code = curl.exe -s -o "$env:TEMP\tf_out.json" -w "%{http_code}" -X $method $url `
            -H "Authorization: Bearer $TOKEN"
    }
    $body = Get-Content "$env:TEMP\tf_out.json" -Raw -ErrorAction SilentlyContinue
    return @{ code = $code.Trim(); body = $body }
}

function Test-EP {
    param($name, $method, $path, $bodyPath = $null)
    $r = Invoke-API -method $method -url "$BASE$path" -bodyPath $bodyPath
    $code = $r.code
    $pass = $code -match "^2"
    $status = if ($pass) { "PASS" } elseif ($code -eq "403") { "RBAC-OK" } elseif ($code -eq "404") { "NOT_FOUND" } else { "FAIL" }
    return [PSCustomObject]@{ Name=$name; Method=$method; Path=$path; Code=$code; Status=$status }
}

# ===== SEED DATA =====
# Create a project
$projJson = '{"name":"TaskFlow Enterprise","code":"TFE-001","description":"Test project","status":"PLANNING","priority":"HIGH","startDate":"2026-07-01","deadline":"2026-12-31","budget":100000}'
Set-Content -Path "$env:TEMP\proj.json" -Value $projJson -NoNewline
$r = Invoke-API "POST" "$BASE/projects" "$env:TEMP\proj.json"
$projId = ($r.body | ConvertFrom-Json).data.publicId
Write-Host "Project created: $projId (HTTP $($r.code))"

# Create a task
if ($projId) {
    $taskJson = "{`"title`":`"API Integration Test Task`",`"description`":`"Verify all endpoints`",`"status`":`"TODO`",`"priority`":`"HIGH`",`"projectPublicId`":`"$projId`",`"dueDate`":`"2026-12-31`"}"
    Set-Content -Path "$env:TEMP\task.json" -Value $taskJson -NoNewline
    $rt = Invoke-API "POST" "$BASE/tasks" "$env:TEMP\task.json"
    $taskId = ($rt.body | ConvertFrom-Json).data.publicId
    Write-Host "Task created: $taskId (HTTP $($rt.code))"
}

# Get current user ID
$ru = Invoke-API "GET" "$BASE/auth/profile"
$userId = ($ru.body | ConvertFrom-Json).data.publicId
Write-Host "User publicId: $userId"

# ===== API CERTIFICATION TESTS =====

# --- HEALTH ---
$results += Test-EP "Health Check" "GET" "/health"

# --- AUTH ---
$results += Test-EP "Auth: Get Profile" "GET" "/auth/profile"
$results += Test-EP "Auth: Get Sessions" "GET" "/auth/sessions"

# --- DASHBOARD ---
$results += Test-EP "Dashboard: Stats" "GET" "/dashboard/stats"
$results += Test-EP "Dashboard: Charts" "GET" "/dashboard/charts"
$results += Test-EP "Dashboard: Activities" "GET" "/dashboard/activities"

# --- PROJECTS ---
$results += Test-EP "Projects: List" "GET" "/projects"
$results += Test-EP "Projects: Get By Id" "GET" "/projects/$projId"
$results += Test-EP "Projects: Search" "GET" "/projects/search?query=taskflow"
$results += Test-EP "Projects: Analytics" "GET" "/projects/$projId/analytics"
$results += Test-EP "Projects: Milestones" "GET" "/projects/$projId/milestones"
$results += Test-EP "Projects: Members (NEW)" "GET" "/projects/$projId/members"

# --- TASKS ---
$results += Test-EP "Tasks: List" "GET" "/tasks"
$results += Test-EP "Tasks: Get By Id" "GET" "/tasks/$taskId"
$results += Test-EP "Tasks: Search" "GET" "/tasks/search?keyword=integration"
$results += Test-EP "Tasks: Kanban Board" "GET" "/tasks/kanban?projectPublicId=$projId"
$results += Test-EP "Tasks: Comments" "GET" "/tasks/$taskId/comments"

# --- POST comment ---
Set-Content "$env:TEMP\comment.json" '{"content":"This is a test comment"}' -NoNewline
$results += Test-EP "Tasks: Add Comment" "POST" "/tasks/$taskId/comments" "$env:TEMP\comment.json"

# --- TASK MOVE ---
Set-Content "$env:TEMP\move.json" '{"newStatus":"IN_PROGRESS"}' -NoNewline
$results += Test-EP "Tasks: Move Status" "PUT" "/tasks/$taskId/move" "$env:TEMP\move.json"

# --- EMPLOYEES ---
$results += Test-EP "Employees: List" "GET" "/employees"
$results += Test-EP "Employees: Get By Id" "GET" "/employees/$userId"
$results += Test-EP "Employee Directory" "GET" "/employee-directory"

# --- DEPARTMENTS ---
$results += Test-EP "Departments: List" "GET" "/departments"
Set-Content "$env:TEMP\dept.json" '{"name":"Engineering","description":"Software Engineering Team"}' -NoNewline
$results += Test-EP "Departments: Create" "POST" "/departments" "$env:TEMP\dept.json"

# --- TEAMS ---
$results += Test-EP "Teams: List" "GET" "/teams"

# --- ORGANIZATION ---
$results += Test-EP "Organization: Hierarchy" "GET" "/organization"

# --- NOTIFICATIONS ---
$results += Test-EP "Notifications: List" "GET" "/notifications"
$results += Test-EP "Notifications: Unread Count" "GET" "/notifications/unread-count"
$results += Test-EP "Notifications: Mark All Read" "PUT" "/notifications/read-all"

# --- REPORTS ---
$results += Test-EP "Reports: Summary" "GET" "/reports/summary"

# --- EXPORT ---
$code = (curl.exe -s -o NUL -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/excel").Trim()
$results += [PSCustomObject]@{ Name="Reports: Export Excel (FIXED)"; Method="GET"; Path="/reports/export/excel"; Code=$code; Status=$(if ($code -match "^2") { "PASS" } else { "FAIL" }) }

$code = (curl.exe -s -o NUL -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/pdf").Trim()
$results += [PSCustomObject]@{ Name="Reports: Export PDF"; Method="GET"; Path="/reports/export/pdf"; Code=$code; Status=$(if ($code -match "^2") { "PASS" } else { "FAIL" }) }

$code = (curl.exe -s -o NUL -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/csv").Trim()
$results += [PSCustomObject]@{ Name="Reports: Export CSV"; Method="GET"; Path="/reports/export/csv"; Code=$code; Status=$(if ($code -match "^2") { "PASS" } else { "FAIL" }) }

# --- AI ---
$results += Test-EP "AI: Executive Summary" "GET" "/ai/summary"
$results += Test-EP "AI: Recommendations" "GET" "/ai/recommendations"
$results += Test-EP "AI: Project Risk" "GET" "/ai/project-risk"
$results += Test-EP "AI: Workload" "GET" "/ai/workload"

# === NEGATIVE TESTS ===
# Missing required field (title)
Set-Content "$env:TEMP\badtask.json" '{"description":"No title task","status":"TODO"}' -NoNewline
$rBad = Invoke-API "POST" "$BASE/tasks" "$env:TEMP\badtask.json"
$results += [PSCustomObject]@{ Name="Validation: Task Missing Title (expect 400)"; Method="POST"; Path="/tasks"; Code=$rBad.code; Status=$(if ($rBad.code -eq "400") { "PASS" } else { "FAIL" }) }

# Duplicate project code
$dupJson = '{"name":"Duplicate Project","code":"TFE-001","description":"dup","status":"PLANNING","priority":"MEDIUM","startDate":"2026-07-01","deadline":"2026-12-31"}'
Set-Content "$env:TEMP\dup.json" -Value $dupJson -NoNewline
$rDup = Invoke-API "POST" "$BASE/projects" "$env:TEMP\dup.json"
$results += [PSCustomObject]@{ Name="Validation: Duplicate Project Code (expect 409)"; Method="POST"; Path="/projects"; Code=$rDup.code; Status=$(if ($rDup.code -eq "409") { "PASS" } else { "FAIL" }) }

# Unauthenticated (expect 401)
$unauthCode = (curl.exe -s -o NUL -w "%{http_code}" "$BASE/projects").Trim()
$results += [PSCustomObject]@{ Name="Security: No Token (expect 401)"; Method="GET"; Path="/projects (no token)"; Code=$unauthCode; Status=$(if ($unauthCode -eq "401") { "PASS" } else { "FAIL" }) }

# Not found
$nfCode = (curl.exe -s -o NUL -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/projects/00000000-0000-0000-0000-000000000000").Trim()
$results += [PSCustomObject]@{ Name="Not Found: Invalid Project ID (expect 404)"; Method="GET"; Path="/projects/invalid"; Code=$nfCode; Status=$(if ($nfCode -eq "404") { "PASS" } else { "FAIL" }) }

# === SUMMARY ===
$pass = ($results | Where-Object { $_.Status -in @("PASS","RBAC-OK") }).Count
$fail = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$nf = ($results | Where-Object { $_.Status -eq "NOT_FOUND" }).Count

Write-Host ""
Write-Host "=========================================="
Write-Host " TaskFlow API CERTIFICATION FINAL REPORT "
Write-Host "=========================================="
Write-Host "Total Endpoints Tested : $($results.Count)"
Write-Host "PASSED                 : $pass"
Write-Host "FAILED                 : $fail"
Write-Host "NOT_FOUND              : $nf"
Write-Host "Pass Rate              : $(if ($results.Count -gt 0) { [math]::Round($pass * 100 / $results.Count, 1) } else { 0 })%"
Write-Host "=========================================="
$results | Format-Table Name, Method, Code, Status -AutoSize
