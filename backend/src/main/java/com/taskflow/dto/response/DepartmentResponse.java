package com.taskflow.dto.response;

import com.taskflow.enums.DepartmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentResponse {

    private String publicId;
    private String name;
    private String code;
    private String description;
    private String managerName;
    private String managerPublicId;
    private DepartmentStatus status;
    private Long employeeCount;
    private LocalDateTime createdAt;
}
