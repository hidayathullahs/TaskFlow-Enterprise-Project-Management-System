package com.taskflow.controller;

import com.taskflow.dto.response.ApiResponse;
import com.taskflow.entity.FileEntity;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "File Storage Engine", description = "Centralized file upload, preview, and download endpoints")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @Operation(summary = "Upload File Asset", description = "Uploads document, resume, or photo asset into centralized FileStorage.")
    public ResponseEntity<ApiResponse<FileEntity>> uploadFile(@RequestParam("file") MultipartFile file) {
        Long currentUserId = SecurityUtils.getCurrentUserId().orElse(null);
        FileEntity fileEntity = fileService.uploadFile(file, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", fileEntity));
    }

    @GetMapping("/{publicId}")
    @Operation(summary = "Download or Preview File", description = "Retrieves raw binary file stream by public ID.")
    public ResponseEntity<Resource> downloadFile(@PathVariable String publicId) {
        try {
            FileEntity fileEntity = fileService.getFileByPublicId(publicId);
            Path filePath = Paths.get(fileEntity.getStoragePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(fileEntity.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileEntity.getOriginalName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{publicId}")
    @Operation(summary = "Soft-Delete File Asset", description = "Marks file asset as deleted.")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String publicId) {
        fileService.deleteFile(publicId);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }
}
