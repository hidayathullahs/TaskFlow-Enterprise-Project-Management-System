package com.taskflow.controller;

import com.taskflow.dto.request.DepartmentRequest;
import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.DepartmentResponse;
import com.taskflow.service.DepartmentService;
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
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Department Management Module", description = "Endpoints for department CRUD, manager assignments, and statistics")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @Operation(summary = "Get All Departments", description = "Retrieves directory of all active organization departments.")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {
        List<DepartmentResponse> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", departments));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Department by Public ID", description = "Retrieves specific department metadata.")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable("id") String publicId) {
        DepartmentResponse department = departmentService.getDepartmentByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Department retrieved", department));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Create New Department", description = "Creates a new organizational department.")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse created = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Update Department Details", description = "Modifies department name, code, description, or manager.")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable("id") String publicId,
            @Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse updated = departmentService.updateDepartment(publicId, request);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'SYSTEM_ADMIN')")
    @Operation(summary = "Soft-Delete Department", description = "Soft deletes department.")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable("id") String publicId) {
        departmentService.deleteDepartment(publicId);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }
}
