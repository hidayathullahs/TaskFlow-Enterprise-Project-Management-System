package com.taskflow.dto.response;

import com.taskflow.enums.TeamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamResponse {

    private String publicId;
    private String name;
    private String description;
    private String departmentName;
    private String departmentPublicId;
    private String teamLeadName;
    private String teamLeadPublicId;
    private TeamStatus status;
    private int memberCount;
    private LocalDateTime createdAt;
}
