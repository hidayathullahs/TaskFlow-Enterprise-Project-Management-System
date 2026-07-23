package com.taskflow.service.impl;

import com.taskflow.dto.response.UserResponse;
import com.taskflow.entity.Department;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.DepartmentRepository;
import com.taskflow.repository.TeamRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final TeamRepository teamRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllEmployees() {
        return userRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getEmployeeByPublicId(String publicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", publicId));
        return mapUserToResponse(user);
    }

    @Override
    @Transactional
    public void deleteEmployee(String publicId) {
        User user = userRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "publicId", publicId));

        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchEmployeeDirectory(String query, String departmentCode, String status) {
        return userRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .filter(u -> {
                    if (query == null || query.trim().isEmpty()) return true;
                    String q = query.toLowerCase();
                    return u.getFirstName().toLowerCase().contains(q) ||
                            u.getLastName().toLowerCase().contains(q) ||
                            u.getEmail().toLowerCase().contains(q) ||
                            (u.getDesignation() != null && u.getDesignation().toLowerCase().contains(q)) ||
                            (u.getSkills() != null && u.getSkills().toLowerCase().contains(q));
                })
                .filter(u -> {
                    if (departmentCode == null || departmentCode.trim().isEmpty()) return true;
                    return u.getDepartment() != null && u.getDepartment().getCode().equalsIgnoreCase(departmentCode);
                })
                .filter(u -> {
                    if (status == null || status.trim().isEmpty()) return true;
                    return u.getStatus().name().equalsIgnoreCase(status);
                })
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationHierarchy() {
        Map<String, Object> orgTree = new LinkedHashMap<>();
        orgTree.put("companyName", "TaskFlow Enterprise Inc.");

        List<Map<String, Object>> deptNodes = new ArrayList<>();
        List<Department> departments = departmentRepository.findAll().stream().filter(d -> !d.isDeleted()).toList();

        for (Department dept : departments) {
            Map<String, Object> deptNode = new LinkedHashMap<>();
            deptNode.put("departmentName", dept.getName());
            deptNode.put("code", dept.getCode());
            deptNode.put("manager", dept.getManager() != null ? dept.getManager().getFirstName() + " " + dept.getManager().getLastName() : "Unassigned");

            List<UserResponse> employees = userRepository.findAll().stream()
                    .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(dept.getId()) && !u.isDeleted())
                    .map(this::mapUserToResponse)
                    .toList();

            deptNode.put("employees", employees);
            deptNodes.add(deptNode);
        }

        orgTree.put("departments", deptNodes);
        return orgTree;
    }

    private UserResponse mapUserToResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .publicId(user.getPublicId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .emailVerified(user.isEmailVerified())
                .designation(user.getDesignation())
                .joiningDate(user.getJoiningDate())
                .salary(user.getSalary())
                .skills(user.getSkills())
                .experienceYears(user.getExperienceYears())
                .bio(user.getBio())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .departmentPublicId(user.getDepartment() != null ? user.getDepartment().getPublicId() : null)
                .reportingManagerName(user.getReportingManager() != null ? user.getReportingManager().getFirstName() + " " + user.getReportingManager().getLastName() : null)
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
