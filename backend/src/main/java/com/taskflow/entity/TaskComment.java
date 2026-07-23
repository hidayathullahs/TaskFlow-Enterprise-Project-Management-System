package com.taskflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "task_comments")
public class TaskComment extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "comment_text", nullable = false, columnDefinition = "TEXT")
    private String commentText;

    public TaskComment() {}

    public TaskComment(Task task, User user, String commentText) {
        this.task = task;
        this.user = user;
        this.commentText = commentText;
    }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }

    public String getComment() { return commentText; }
    public void setComment(String comment) { this.commentText = comment; }

    public static TaskCommentBuilder builder() {
        return new TaskCommentBuilder();
    }

    public static class TaskCommentBuilder {
        private Task task;
        private User user;
        private String commentText;

        public TaskCommentBuilder task(Task task) { this.task = task; return this; }
        public TaskCommentBuilder user(User user) { this.user = user; return this; }
        public TaskCommentBuilder commentText(String commentText) { this.commentText = commentText; return this; }
        public TaskCommentBuilder comment(String comment) { this.commentText = comment; return this; }

        public TaskComment build() {
            return new TaskComment(task, user, commentText);
        }
    }
}
