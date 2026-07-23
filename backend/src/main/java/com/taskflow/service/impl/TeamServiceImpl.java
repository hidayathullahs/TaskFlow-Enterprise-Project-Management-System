package com.taskflow.service.impl;

import com.taskflow.dto.request.TeamRequest;
import com.taskflow.dto.response.TeamResponse;
import com.taskflow.entity.Department;
import com.taskflow.entity.Team;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.DepartmentRepository;
import com.taskflow.repository.TeamRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .filter(t -> !t.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamByPublicId(String publicId) {
        Team team = teamRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "publicId", publicId));
        return mapToResponse(team);
    }

    @Override
    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        Department department = departmentRepository.findByPublicIdAndDeletedFalse(request.getDepartmentPublicId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "publicId", request.getDepartmentPublicId()));

        User teamLead = null;
        if (request.getTeamLeadPublicId() != null && !request.getTeamLeadPublicId().isEmpty()) {
            teamLead = userRepository.findByPublicIdAndDeletedFalse(request.getTeamLeadPublicId())
                    .orElse(null);
        }

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .department(department)
                .teamLead(teamLead)
                .build();

        Team saved = teamRepository.save(team);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TeamResponse updateTeam(String publicId, TeamRequest request) {
        Team team = teamRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "publicId", publicId));

        Department department = departmentRepository.findByPublicIdAndDeletedFalse(request.getDepartmentPublicId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "publicId", request.getDepartmentPublicId()));

        User teamLead = null;
        if (request.getTeamLeadPublicId() != null && !request.getTeamLeadPublicId().isEmpty()) {
            teamLead = userRepository.findByPublicIdAndDeletedFalse(request.getTeamLeadPublicId())
                    .orElse(null);
        }

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setDepartment(department);
        team.setTeamLead(teamLead);

        Team updated = teamRepository.save(team);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTeam(String publicId) {
        Team team = teamRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Team", "publicId", publicId));

        team.setDeleted(true);
        teamRepository.save(team);
    }

    private TeamResponse mapToResponse(Team team) {
        return TeamResponse.builder()
                .publicId(team.getPublicId())
                .name(team.getName())
                .description(team.getDescription())
                .departmentName(team.getDepartment() != null ? team.getDepartment().getName() : null)
                .departmentPublicId(team.getDepartment() != null ? team.getDepartment().getPublicId() : null)
                .teamLeadName(team.getTeamLead() != null ? team.getTeamLead().getFirstName() + " " + team.getTeamLead().getLastName() : "Unassigned")
                .teamLeadPublicId(team.getTeamLead() != null ? team.getTeamLead().getPublicId() : null)
                .status(team.getStatus())
                .memberCount(team.getMembers() != null ? team.getMembers().size() : 0)
                .createdAt(team.getCreatedAt())
                .build();
    }
}
