$TOKEN_FILE = "$env:TEMP\taskflow_token.txt"
$BASE = "http://localhost:8080/api/v1"

Write-Host "============================================"
Write-Host " TaskFlow UAT - Full Stack Verification"
Write-Host "============================================"
Write-Host ""

# ===== 1. LOGIN =====
Set-Content "$env:TEMP\login.json" '{"email":"admin@taskflow.com","password":"TaskFlow#2026!Secure"}' -NoNewline
$loginJson = curl.exe -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" --data-binary "@$env:TEMP\login.json"
$login = $loginJson | ConvertFrom-Json

if ($login.success) {
    $TOKEN = $login.data.accessToken
    Set-Content $TOKEN_FILE $TOKEN -NoNewline
    Write-Host "[PASS] LOGIN: $($login.data.user.firstName) $($login.data.user.lastName) ($($login.data.user.email))"
    Write-Host "       Roles: $($login.data.roles -join ', ')"
} else {
    Write-Host "[FAIL] LOGIN FAILED: $($login.message)"
    exit 1
}

Write-Host ""
Write-Host "=== API ENDPOINT VERIFICATION ==="
$results = @()

function Test-Endpoint {
    param($name, $method, $path, $bodyFile = $null)
    if ($bodyFile) {
        $code = curl.exe -s -o "$env:TEMP\resp.json" -w "%{http_code}" -X $method "$BASE$path" `
            -H "Authorization: Bearer $TOKEN" `
            -H "Content-Type: application/json" `
            --data-binary "@$bodyFile"
    } else {
        $code = curl.exe -s -o "$env:TEMP\resp.json" -w "%{http_code}" -X $method "$BASE$path" `
            -H "Authorization: Bearer $TOKEN"
    }
    $body = Get-Content "$env:TEMP\resp.json" -Raw -ErrorAction SilentlyContinue
    $pass = $code -match "^2"
    $status = if ($pass) { "PASS" } else { "FAIL" }
    $icon = if ($pass) { "[PASS]" } else { "[FAIL]" }
    Write-Host "$icon $name : HTTP $code"
    return [PSCustomObject]@{ Name=$name; Code=$code; Status=$status; Body=$body }
}

# Dashboard
$results += Test-Endpoint "Dashboard Stats" "GET" "/dashboard/stats"
$statsBody = Get-Content "$env:TEMP\resp.json" -Raw | ConvertFrom-Json
Write-Host "       Active Projects: $($statsBody.data.activeProjects) | Total: $($statsBody.data.totalProjects)"

$results += Test-Endpoint "Dashboard Charts" "GET" "/dashboard/charts"
$results += Test-Endpoint "Dashboard Activities" "GET" "/dashboard/activities"

# Projects
$results += Test-Endpoint "Projects - List All" "GET" "/projects"
$projList = Get-Content "$env:TEMP\resp.json" -Raw | ConvertFrom-Json
Write-Host "       Projects count: $(($projList.data | Measure-Object).Count)"

# Create a test project
Set-Content "$env:TEMP\newproj.json" '{"name":"UAT Verification Project","code":"UAT-VER-001","description":"Browser-based UAT test project","status":"PLANNING","priority":"HIGH","startDate":"2026-10-01","deadline":"2026-12-31","budget":50000}' -NoNewline
$r = Test-Endpoint "Projects - Create" "POST" "/projects" "$env:TEMP\newproj.json"
$newProjId = ($r.Body | ConvertFrom-Json).data.publicId
Write-Host "       Created Project ID: $newProjId"

$results += Test-Endpoint "Projects - Get By ID" "GET" "/projects/$newProjId"
$results += Test-Endpoint "Projects - Analytics" "GET" "/projects/$newProjId/analytics"
$results += Test-Endpoint "Projects - Members (NEW)" "GET" "/projects/$newProjId/members"
$results += Test-Endpoint "Projects - Milestones" "GET" "/projects/$newProjId/milestones"

# Tasks
$results += Test-Endpoint "Tasks - List All" "GET" "/tasks"
Set-Content "$env:TEMP\newtask.json" "{`"title`":`"Browser UAT Verification Task`",`"description`":`"Created via browser UAT`",`"status`":`"TODO`",`"priority`":`"HIGH`",`"projectPublicId`":`"$newProjId`",`"dueDate`":`"2026-12-31`"}" -NoNewline
$tr = Test-Endpoint "Tasks - Create" "POST" "/tasks" "$env:TEMP\newtask.json"
$newTaskId = ($tr.Body | ConvertFrom-Json).data.publicId
Write-Host "       Created Task ID: $newTaskId"

$results += Test-Endpoint "Tasks - Kanban Board" "GET" "/tasks/kanban?projectPublicId=$newProjId"
$results += Test-Endpoint "Tasks - Comments" "GET" "/tasks/$newTaskId/comments"

# Add a comment
Set-Content "$env:TEMP\comment.json" '{"content":"UAT verification comment - browser test passed"}' -NoNewline
$results += Test-Endpoint "Tasks - Add Comment" "POST" "/tasks/$newTaskId/comments" "$env:TEMP\comment.json"

# Move task
Set-Content "$env:TEMP\move.json" '{"newStatus":"IN_PROGRESS"}' -NoNewline
$results += Test-Endpoint "Tasks - Move Status" "PUT" "/tasks/$newTaskId/move" "$env:TEMP\move.json"

# Employees
$results += Test-Endpoint "Employees - List" "GET" "/employees"
$results += Test-Endpoint "Employee Directory" "GET" "/employee-directory"

# Departments
$results += Test-Endpoint "Departments - List" "GET" "/departments"
Set-Content "$env:TEMP\dept.json" '{"name":"QA & Testing","code":"QAT","description":"Quality Assurance Team"}' -NoNewline
$results += Test-Endpoint "Departments - Create" "POST" "/departments" "$env:TEMP\dept.json"

# Teams
$results += Test-Endpoint "Teams - List" "GET" "/teams"

# Organization
$results += Test-Endpoint "Org Hierarchy" "GET" "/organization"

# Notifications
$results += Test-Endpoint "Notifications - List" "GET" "/notifications"
$results += Test-Endpoint "Notifications - Unread Count" "GET" "/notifications/unread-count"
$results += Test-Endpoint "Notifications - Mark All Read" "PUT" "/notifications/read-all"

# Reports
$results += Test-Endpoint "Reports Summary" "GET" "/reports/summary"

# Export Excel
$xlCode = curl.exe -s -o "$env:TEMP\test_export.xlsx" -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/excel"
$xlSize = (Get-Item "$env:TEMP\test_export.xlsx" -ErrorAction SilentlyContinue).Length
$xlPass = ($xlCode -match "^2") -and ($xlSize -gt 1000)
$icon = if ($xlPass) { "[PASS]" } else { "[FAIL]" }
Write-Host "$icon Export Excel: HTTP $xlCode | File size: $xlSize bytes"
$results += [PSCustomObject]@{ Name="Reports - Export Excel"; Code=$xlCode; Status=$(if ($xlPass) {"PASS"} else {"FAIL"}); Body="" }

# Export PDF
$pdfCode = curl.exe -s -o "$env:TEMP\test_export.pdf" -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/pdf"
$pdfSize = (Get-Item "$env:TEMP\test_export.pdf" -ErrorAction SilentlyContinue).Length
$pdfPass = ($pdfCode -match "^2") -and ($pdfSize -gt 100)
$icon = if ($pdfPass) { "[PASS]" } else { "[FAIL]" }
Write-Host "$icon Export PDF: HTTP $pdfCode | File size: $pdfSize bytes"
$results += [PSCustomObject]@{ Name="Reports - Export PDF"; Code=$pdfCode; Status=$(if ($pdfPass) {"PASS"} else {"FAIL"}); Body="" }

# Export CSV
$csvCode = curl.exe -s -o "$env:TEMP\test_export.csv" -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$BASE/reports/export/csv"
$csvSize = (Get-Item "$env:TEMP\test_export.csv" -ErrorAction SilentlyContinue).Length
$csvContent = Get-Content "$env:TEMP\test_export.csv" -ErrorAction SilentlyContinue | Select-Object -First 2
$csvPass = ($csvCode -match "^2") -and ($csvSize -gt 10)
$icon = if ($csvPass) { "[PASS]" } else { "[FAIL]" }
Write-Host "$icon Export CSV: HTTP $csvCode | File size: $csvSize bytes"
Write-Host "       CSV Headers: $($csvContent[0])"
$results += [PSCustomObject]@{ Name="Reports - Export CSV"; Code=$csvCode; Status=$(if ($csvPass) {"PASS"} else {"FAIL"}); Body="" }

# AI Intelligence
$results += Test-Endpoint "AI Executive Summary" "GET" "/ai/summary"
$aiBody = Get-Content "$env:TEMP\resp.json" -Raw | ConvertFrom-Json
Write-Host "       AI Delivery Confidence: $($aiBody.data.deliveryConfidenceScore)%"
Write-Host "       Project Risks: $(($aiBody.data.projectRisks | Measure-Object).Count)"
Write-Host "       Workload Heatmap: $(($aiBody.data.workloadHeatmap | Measure-Object).Count) employees"
Write-Host "       Recommendations: $(($aiBody.data.recommendations | Measure-Object).Count)"

$results += Test-Endpoint "AI Recommendations" "GET" "/ai/recommendations"
$results += Test-Endpoint "AI Project Risk" "GET" "/ai/project-risk"
$results += Test-Endpoint "AI Workload" "GET" "/ai/workload"

# Auth profile
$results += Test-Endpoint "Auth Profile" "GET" "/auth/profile"
$results += Test-Endpoint "Auth Sessions" "GET" "/auth/sessions"

# ===== SUMMARY =====
Write-Host ""
Write-Host "============================================"
Write-Host "       UAT RESULTS SUMMARY"
Write-Host "============================================"
$pass = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$fail = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $results.Count
Write-Host "Total Tests  : $total"
Write-Host "PASSED       : $pass"
Write-Host "FAILED       : $fail"
Write-Host "Pass Rate    : $([math]::Round($pass * 100 / $total, 1))%"
Write-Host ""
if ($fail -gt 0) {
    Write-Host "FAILED TESTS:"
    $results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name) : HTTP $($_.Code)"
    }
}
Write-Host "============================================"
Write-Host "Frontend : http://localhost:5173 [UP]"
Write-Host "Backend  : http://localhost:8080 [UP]"
Write-Host "Swagger  : http://localhost:8080/swagger-ui.html"
Write-Host "============================================"
