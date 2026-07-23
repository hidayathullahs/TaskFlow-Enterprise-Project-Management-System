package com.taskflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MilestoneResponse {

    private String publicId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed;
}
