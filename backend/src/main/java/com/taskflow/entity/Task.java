package com.taskflow.entity;

import com.taskflow.enums.Priority;
import com.taskflow.enums.TaskStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task extends AuditableEntity {

    @Column(name = "task_number", length = 50)
    private String taskNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL)
    private Set<Task> subtasks = new HashSet<>();

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "estimated_hours", precision = 6, scale = 2)
    private BigDecimal estimatedHours = BigDecimal.ZERO;

    @Column(name = "actual_hours", precision = 6, scale = 2)
    private BigDecimal actualHours = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(name = "section", length = 50)
    private String section = "General";

    @Column(name = "board_order")
    private Integer boardOrder = 0;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskChecklist> checklists = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskComment> comments = new HashSet<>();

    public Task() {}

    public Task(String taskNumber, Project project, Task parentTask, Set<Task> subtasks, String title,
                String description, TaskStatus status, Priority priority, LocalDate startDate, LocalDate dueDate,
                BigDecimal estimatedHours, BigDecimal actualHours, User assignee, User creator, String section,
                Integer boardOrder, Set<TaskChecklist> checklists, Set<TaskComment> comments) {
        this.taskNumber = taskNumber;
        this.project = project;
        this.parentTask = parentTask;
        this.subtasks = subtasks != null ? subtasks : new HashSet<>();
        this.title = title;
        this.description = description;
        this.status = status != null ? status : TaskStatus.TODO;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.estimatedHours = estimatedHours != null ? estimatedHours : BigDecimal.ZERO;
        this.actualHours = actualHours != null ? actualHours : BigDecimal.ZERO;
        this.assignee = assignee;
        this.creator = creator;
        this.section = section != null ? section : "General";
        this.boardOrder = boardOrder != null ? boardOrder : 0;
        this.checklists = checklists != null ? checklists : new HashSet<>();
        this.comments = comments != null ? comments : new HashSet<>();
    }

    public String getTaskNumber() { return taskNumber; }
    public void setTaskNumber(String taskNumber) { this.taskNumber = taskNumber; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Task getParentTask() { return parentTask; }
    public void setParentTask(Task parentTask) { this.parentTask = parentTask; }

    public Set<Task> getSubtasks() { return subtasks; }
    public void setSubtasks(Set<Task> subtasks) { this.subtasks = subtasks; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(BigDecimal estimatedHours) { this.estimatedHours = estimatedHours; }

    public BigDecimal getActualHours() { return actualHours; }
    public void setActualHours(BigDecimal actualHours) { this.actualHours = actualHours; }

    public BigDecimal getLoggedHours() { return actualHours != null ? actualHours : BigDecimal.ZERO; }
    public void setLoggedHours(BigDecimal loggedHours) { this.actualHours = loggedHours; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public Integer getBoardOrder() { return boardOrder; }
    public void setBoardOrder(Integer boardOrder) { this.boardOrder = boardOrder; }

    public Set<TaskChecklist> getChecklists() { return checklists; }
    public void setChecklists(Set<TaskChecklist> checklists) { this.checklists = checklists; }

    public Set<TaskComment> getComments() { return comments; }
    public void setComments(Set<TaskComment> comments) { this.comments = comments; }

    public static TaskBuilder builder() {
        return new TaskBuilder();
    }

    public static class TaskBuilder {
        private String taskNumber;
        private Project project;
        private Task parentTask;
        private Set<Task> subtasks = new HashSet<>();
        private String title;
        private String description;
        private TaskStatus status = TaskStatus.TODO;
        private Priority priority = Priority.MEDIUM;
        private LocalDate startDate;
        private LocalDate dueDate;
        private BigDecimal estimatedHours = BigDecimal.ZERO;
        private BigDecimal actualHours = BigDecimal.ZERO;
        private User assignee;
        private User creator;
        private String section = "General";
        private Integer boardOrder = 0;
        private Set<TaskChecklist> checklists = new HashSet<>();
        private Set<TaskComment> comments = new HashSet<>();

        public TaskBuilder taskNumber(String taskNumber) { this.taskNumber = taskNumber; return this; }
        public TaskBuilder project(Project project) { this.project = project; return this; }
        public TaskBuilder parentTask(Task parentTask) { this.parentTask = parentTask; return this; }
        public TaskBuilder subtasks(Set<Task> subtasks) { this.subtasks = subtasks; return this; }
        public TaskBuilder title(String title) { this.title = title; return this; }
        public TaskBuilder description(String description) { this.description = description; return this; }
        public TaskBuilder status(TaskStatus status) { this.status = status; return this; }
        public TaskBuilder priority(Priority priority) { this.priority = priority; return this; }
        public TaskBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public TaskBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public TaskBuilder estimatedHours(BigDecimal estimatedHours) { this.estimatedHours = estimatedHours; return this; }
        public TaskBuilder actualHours(BigDecimal actualHours) { this.actualHours = actualHours; return this; }
        public TaskBuilder loggedHours(BigDecimal loggedHours) { this.actualHours = loggedHours; return this; }
        public TaskBuilder assignee(User assignee) { this.assignee = assignee; return this; }
        public TaskBuilder creator(User creator) { this.creator = creator; return this; }
        public TaskBuilder section(String section) { this.section = section; return this; }
        public TaskBuilder boardOrder(Integer boardOrder) { this.boardOrder = boardOrder; return this; }
        public TaskBuilder checklists(Set<TaskChecklist> checklists) { this.checklists = checklists; return this; }
        public TaskBuilder comments(Set<TaskComment> comments) { this.comments = comments; return this; }

        public Task build() {
            return new Task(taskNumber, project, parentTask, subtasks, title, description, status, priority,
                            startDate, dueDate, estimatedHours, actualHours, assignee, creator, section,
                            boardOrder, checklists, comments);
        }
    }
}
