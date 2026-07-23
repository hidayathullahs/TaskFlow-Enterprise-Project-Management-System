package com.taskflow.service;

import com.taskflow.entity.FileEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    FileEntity uploadFile(MultipartFile file, Long uploaderUserId);
    FileEntity getFileByPublicId(String publicId);
    void deleteFile(String publicId);
}
