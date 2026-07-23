package com.taskflow.controller;

import com.taskflow.dto.request.MilestoneRequest;
import com.taskflow.dto.request.ProjectMemberRequest;
import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.MilestoneResponse;
import com.taskflow.dto.response.ProjectAnalyticsResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Enterprise Project Management Engine", description = "Endpoints for project CRUD, milestone tracking, team member assignment, and budget analytics.")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get All Projects", description = "Retrieves directory of all active organization projects.")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success("Projects list retrieved", projects));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Project by Public ID", description = "Retrieves project details, budget, manager, and completion status.")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable("id") String publicId) {
        ProjectResponse project = projectService.getProjectByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Project retrieved", project));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER', 'PROJECT_CREATE')")
    @Operation(summary = "Create New Project", description = "Creates a new enterprise project.")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Project created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER', 'PROJECT_UPDATE')")
    @Operation(summary = "Update Project Details", description = "Modifies project metadata, timeline dates, or budget allocation.")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable("id") String publicId,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse updated = projectService.updateProject(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'PROJECT_DELETE')")
    @Operation(summary = "Soft-Delete Project", description = "Soft deletes project.")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable("id") String publicId) {
        projectService.deleteProject(publicId);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Get Project Members", description = "Retrieves all users assigned to this project.")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getMembers(@PathVariable("id") String publicId) {
        List<UserResponse> members = projectService.getProjectMembers(publicId);
        return ResponseEntity.ok(ApiResponse.success("Project members retrieved", members));
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER')")
    @Operation(summary = "Add Member to Project", description = "Assigns an employee to the project team.")
    public ResponseEntity<ApiResponse<Void>> addMember(@PathVariable("id") String publicId, @Valid @RequestBody ProjectMemberRequest request) {
        projectService.addMemberToProject(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Member added to project", null));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER')")
    @Operation(summary = "Remove Member from Project", description = "Removes an employee from the project team.")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable("id") String publicId, @PathVariable("userId") String userPublicId) {
        projectService.removeMemberFromProject(publicId, userPublicId);
        return ResponseEntity.ok(ApiResponse.success("Member removed from project", null));
    }

    @GetMapping("/{id}/milestones")
    @Operation(summary = "Get Project Milestones", description = "Retrieves milestone timeline targets for a project.")
    public ResponseEntity<ApiResponse<List<MilestoneResponse>>> getMilestones(@PathVariable("id") String publicId) {
        List<MilestoneResponse> milestones = projectService.getProjectMilestones(publicId);
        return ResponseEntity.ok(ApiResponse.success("Milestones retrieved", milestones));
    }

    @PostMapping("/{id}/milestones")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER')")
    @Operation(summary = "Create Milestone", description = "Adds a milestone target to the project timeline.")
    public ResponseEntity<ApiResponse<MilestoneResponse>> createMilestone(@PathVariable("id") String publicId, @Valid @RequestBody MilestoneRequest request) {
        MilestoneResponse milestone = projectService.createMilestone(publicId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Milestone created", milestone));
    }

    @GetMapping("/{id}/analytics")
    @Operation(summary = "Get Project Analytics", description = "Calculates completion %, budget usage, and risk score.")
    public ResponseEntity<ApiResponse<ProjectAnalyticsResponse>> getProjectAnalytics(@PathVariable("id") String publicId) {
        ProjectAnalyticsResponse analytics = projectService.getProjectAnalytics(publicId);
        return ResponseEntity.ok(ApiResponse.success("Project analytics calculated", analytics));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & Filter Projects", description = "Searches projects by keyword query, status, and priority.")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> searchProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        List<ProjectResponse> results = projectService.searchProjects(query, status, priority);
        return ResponseEntity.ok(ApiResponse.success("Project search completed", results));
    }
}
