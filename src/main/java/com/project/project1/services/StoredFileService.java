package com.project.project1.services;

import com.project.project1.models.StoredFile;
import com.project.project1.repository.StoredFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoredFileService {

    @Value("${upload.directory}")
    private String uploadDirectory;

    @Autowired private StoredFileRepository storedFileRepository;

    public StoredFile saveFile(MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String originalFileName = Paths.get(multipartFile.getOriginalFilename()).getFileName().toString();
        Path filePath = uploadPath.resolve(originalFileName);
        Files.write(filePath, multipartFile.getBytes());

        StoredFile storedFile = StoredFile.builder()
                .name(multipartFile.getOriginalFilename())
                .type(multipartFile.getContentType())
                .uploadTime(LocalDateTime.now())
                .size(multipartFile.getSize())
                .path(filePath.toString()).build();

        return storedFileRepository.save(storedFile);
    }


    public List<StoredFile> getAllFiles() {
        return storedFileRepository.findAll();
    }

    public byte[] downloadFile(Long id) throws IOException {
        StoredFile storedFile = storedFileRepository.findById(id).orElseThrow(() -> new FileNotFoundException("File not found for id: "+id));
        return Files.readAllBytes(Paths.get(storedFile.getPath()));
    }

    public String getContentType(Long id) throws FileNotFoundException {
        StoredFile storedFile = storedFileRepository.findById(id).orElseThrow(() -> new FileNotFoundException("File not found for id: "+id));
        return storedFile.getType();
    }

}
