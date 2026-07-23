package com.taskflow.service;

import com.taskflow.dto.request.DepartmentRequest;
import com.taskflow.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentByPublicId(String publicId);
    DepartmentResponse createDepartment(DepartmentRequest departmentRequest);
    DepartmentResponse updateDepartment(String publicId, DepartmentRequest departmentRequest);
    void deleteDepartment(String publicId);
}
