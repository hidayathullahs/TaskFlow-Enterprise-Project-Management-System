package com.taskflow.service.impl;

import com.taskflow.entity.FileEntity;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.FileRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    @Value("${taskflow.app.upload-dir:uploads}")
    private String uploadDir;

    @Override
    @Transactional
    public FileEntity uploadFile(MultipartFile file, Long uploaderUserId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String storedName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), filePath);

            User uploader = uploaderUserId != null ? userRepository.findById(uploaderUserId).orElse(null) : null;

            FileEntity fileEntity = FileEntity.builder()
                    .originalName(originalName != null ? originalName : "unnamed_file")
                    .storedName(storedName)
                    .mimeType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .fileSize(file.getSize())
                    .storagePath(filePath.toString())
                    .uploadedBy(uploader)
                    .build();

            return fileRepository.save(fileEntity);
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage());
            throw new BadRequestException("Failed to store file on disk", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FileEntity getFileByPublicId(String publicId) {
        return fileRepository.findByPublicIdAndDeletedFalse(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("File", "publicId", publicId));
    }

    @Override
    @Transactional
    public void deleteFile(String publicId) {
        FileEntity fileEntity = getFileByPublicId(publicId);
        fileEntity.setDeleted(true);
        fileRepository.save(fileEntity);
    }
}
