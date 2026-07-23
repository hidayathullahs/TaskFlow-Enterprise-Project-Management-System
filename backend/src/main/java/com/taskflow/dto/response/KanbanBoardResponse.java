package com.taskflow.dto.response;

import com.taskflow.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KanbanBoardResponse {

    private Map<TaskStatus, List<TaskResponse>> columns;
    private int totalTasks;
}
