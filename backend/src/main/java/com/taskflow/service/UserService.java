package com.taskflow.service;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    List<UserResponse> getAllEmployees();
    UserResponse getEmployeeByPublicId(String publicId);
    void deleteEmployee(String publicId);
    List<UserResponse> searchEmployeeDirectory(String query, String departmentCode, String status);
    Map<String, Object> getOrganizationHierarchy();
}
