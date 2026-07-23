package com.taskflow.service;

import com.taskflow.dto.request.MilestoneRequest;
import com.taskflow.dto.request.ProjectMemberRequest;
import com.taskflow.dto.request.ProjectRequest;
import com.taskflow.dto.response.MilestoneResponse;
import com.taskflow.dto.response.ProjectAnalyticsResponse;
import com.taskflow.dto.response.ProjectResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllProjects();
    ProjectResponse getProjectByPublicId(String publicId);
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(String publicId, ProjectRequest request);
    void deleteProject(String publicId);

    void addMemberToProject(String projectPublicId, ProjectMemberRequest request);
    void removeMemberFromProject(String projectPublicId, String userPublicId);
    List<UserResponse> getProjectMembers(String projectPublicId);

    MilestoneResponse createMilestone(String projectPublicId, MilestoneRequest request);
    List<MilestoneResponse> getProjectMilestones(String projectPublicId);

    ProjectAnalyticsResponse getProjectAnalytics(String projectPublicId);
    List<ProjectResponse> searchProjects(String query, String status, String priority);
}
