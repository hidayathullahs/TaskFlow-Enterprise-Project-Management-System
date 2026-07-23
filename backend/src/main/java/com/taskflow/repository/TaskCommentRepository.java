package com.taskflow.repository;

import com.taskflow.entity.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {
    Optional<TaskComment> findByPublicIdAndDeletedFalse(String publicId);
    List<TaskComment> findByTaskIdAndDeletedFalse(Long taskId);
}
