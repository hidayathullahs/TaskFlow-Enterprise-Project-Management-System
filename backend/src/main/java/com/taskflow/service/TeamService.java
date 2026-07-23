package com.taskflow.service;

import com.taskflow.dto.request.TeamRequest;
import com.taskflow.dto.response.TeamResponse;

import java.util.List;

public interface TeamService {
    List<TeamResponse> getAllTeams();
    TeamResponse getTeamByPublicId(String publicId);
    TeamResponse createTeam(TeamRequest request);
    TeamResponse updateTeam(String publicId, TeamRequest request);
    void deleteTeam(String publicId);
}
