package com.taskflow.controller;

import com.taskflow.dto.request.TeamRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.TeamResponse;
import com.taskflow.service.TeamService;
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
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@Tag(name = "Team Management Module", description = "Endpoints for team CRUD, lead assignment, and team member management.")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    @Operation(summary = "Get All Teams", description = "Retrieves directory listing of all organization teams.")
    public ResponseEntity<ApiResponse<List<TeamResponse>>> getAllTeams() {
        List<TeamResponse> teams = teamService.getAllTeams();
        return ResponseEntity.ok(ApiResponse.success("Teams retrieved successfully", teams));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Team by Public ID", description = "Retrieves specific team metadata.")
    public ResponseEntity<ApiResponse<TeamResponse>> getTeamById(@PathVariable("id") String publicId) {
        TeamResponse team = teamService.getTeamByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Team retrieved", team));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER')")
    @Operation(summary = "Create New Team", description = "Creates a new team under a department.")
    public ResponseEntity<ApiResponse<TeamResponse>> createTeam(@Valid @RequestBody TeamRequest request) {
        TeamResponse created = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Team created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_PROJECT_MANAGER')")
    @Operation(summary = "Update Team Details", description = "Modifies team name, description, department, or team lead.")
    public ResponseEntity<ApiResponse<TeamResponse>> updateTeam(
            @PathVariable("id") String publicId,
            @Valid @RequestBody TeamRequest request) {
        TeamResponse updated = teamService.updateTeam(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Team updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
    @Operation(summary = "Soft-Delete Team", description = "Soft deletes team.")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable("id") String publicId) {
        teamService.deleteTeam(publicId);
        return ResponseEntity.ok(ApiResponse.success("Team deleted successfully", null));
    }
}
