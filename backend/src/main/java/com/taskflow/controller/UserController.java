package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Employee & HR Management Module", description = "Endpoints for employee directory, user profiles, soft deletion, and organization chart hierarchy.")
public class UserController {

    private final UserService userService;

    @GetMapping("/employees")
    @Operation(summary = "Get All Employees", description = "Retrieves directory listing of all enterprise employees.")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllEmployees() {
        List<UserResponse> employees = userService.getAllEmployees();
        return ResponseEntity.ok(ApiResponse.success("Employees list retrieved", employees));
    }

    @GetMapping("/employees/{id}")
    @Operation(summary = "Get Employee Profile by Public ID", description = "Retrieves detailed profile information for an employee.")
    public ResponseEntity<ApiResponse<UserResponse>> getEmployeeById(@PathVariable("id") String publicId) {
        UserResponse employee = userService.getEmployeeByPublicId(publicId);
        return ResponseEntity.ok(ApiResponse.success("Employee profile retrieved", employee));
    }

    @DeleteMapping("/employees/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'USER_DELETE')")
    @Operation(summary = "Soft-Delete Employee Account", description = "Soft-deletes employee user record.")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable("id") String publicId) {
        userService.deleteEmployee(publicId);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully", null));
    }

    @GetMapping("/employee-directory")
    @Operation(summary = "Search Employee Directory", description = "Multi-criteria search by query string, department code, and status.")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchEmployeeDirectory(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String departmentCode,
            @RequestParam(required = false) String status) {
        List<UserResponse> results = userService.searchEmployeeDirectory(query, departmentCode, status);
        return ResponseEntity.ok(ApiResponse.success("Employee directory search completed", results));
    }

    @GetMapping("/organization")
    @Operation(summary = "Get Organization Chart Hierarchy", description = "Generates company hierarchy tree (Company -> Departments -> Employees).")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOrganizationHierarchy() {
        Map<String, Object> orgTree = userService.getOrganizationHierarchy();
        return ResponseEntity.ok(ApiResponse.success("Organization hierarchy retrieved", orgTree));
    }
}
