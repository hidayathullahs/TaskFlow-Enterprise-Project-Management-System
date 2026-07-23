package com.taskflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectMemberRequest {

    @NotBlank(message = "User public ID is required")
    private String userPublicId;

    private String projectRole = "DEVELOPER";
}
