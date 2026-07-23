package com.taskflow.dto.response;

import com.taskflow.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String publicId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserStatus status;
    private boolean emailVerified;
    private String designation;
    private LocalDate joiningDate;
    private BigDecimal salary;
    private String skills;
    private Integer experienceYears;
    private String bio;
    private String departmentName;
    private String departmentPublicId;
    private String reportingManagerName;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
