package com.taskflow.service.impl;

import com.taskflow.dto.request.DepartmentRequest;
import com.taskflow.dto.response.DepartmentResponse;
import com.taskflow.entity.Department;
import com.taskflow.entity.User;
import com.taskflow.exception.DuplicateResourceException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.DepartmentRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .filter(d -> !d.isDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentByPublicId(String publicId) {
        Department dept = departmentRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "publicId", publicId));
        return mapToResponse(dept);
    }

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new DuplicateResourceException("Department", "code", request.getCode());
        }

        User manager = null;
        if (request.getManagerPublicId() != null && !request.getManagerPublicId().isEmpty()) {
            manager = userRepository.findByPublicIdAndDeletedFalse(request.getManagerPublicId())
                    .orElse(null);
        }

        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .manager(manager)
                .build();

        Department saved = departmentRepository.save(department);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(String publicId, DepartmentRequest request) {
        Department department = departmentRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "publicId", publicId));

        if (!department.getCode().equalsIgnoreCase(request.getCode()) &&
                departmentRepository.existsByCodeAndDeletedFalse(request.getCode())) {
            throw new DuplicateResourceException("Department", "code", request.getCode());
        }

        User manager = null;
        if (request.getManagerPublicId() != null && !request.getManagerPublicId().isEmpty()) {
            manager = userRepository.findByPublicIdAndDeletedFalse(request.getManagerPublicId())
                    .orElse(null);
        }

        department.setName(request.getName());
        department.setCode(request.getCode().toUpperCase());
        department.setDescription(request.getDescription());
        department.setManager(manager);

        Department updated = departmentRepository.save(department);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteDepartment(String publicId) {
        Department department = departmentRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "publicId", publicId));

        department.setDeleted(true);
        departmentRepository.save(department);
    }

    private DepartmentResponse mapToResponse(Department dept) {
        long empCount = userRepository.findAll().stream()
                .filter(u -> u.getDepartment() != null && u.getDepartment().getId().equals(dept.getId()) && !u.isDeleted())
                .count();

        return DepartmentResponse.builder()
                .publicId(dept.getPublicId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .managerName(dept.getManager() != null ? dept.getManager().getFirstName() + " " + dept.getManager().getLastName() : "Unassigned")
                .managerPublicId(dept.getManager() != null ? dept.getManager().getPublicId() : null)
                .status(dept.getStatus())
                .employeeCount(empCount)
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
