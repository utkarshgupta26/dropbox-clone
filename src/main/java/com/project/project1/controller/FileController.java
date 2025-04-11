package com.project.project1.controller;

import com.project.project1.models.StoredFile;
import com.project.project1.services.StoredFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping(value = "/api/files")
public class FileController {

    @Autowired private StoredFileService storedFileService;

    @PostMapping("/upload")
    public ResponseEntity<StoredFile> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            StoredFile savedFile = storedFileService.saveFile(file);
            return ResponseEntity.ok(savedFile);
        }
        catch (Exception e) {
            throw new RuntimeException("Exception occurred while uploading file", e);
        }
    }

    @GetMapping("/hello")
    public ResponseEntity hello() {
        return ResponseEntity.ok("Pee ka Boo");
    }

    @GetMapping
    public ResponseEntity<List<StoredFile>> listFiles() {
        return ResponseEntity.ok(storedFileService.getAllFiles());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable("id") Long id) {
        try {
            byte[] data = storedFileService.downloadFile(id);
            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(storedFileService.getContentType(id)))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + id + "\"")
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Exception occurred while downloading file", e);
        }
    }

}
