package com.app.hotelMangemet.api;

import com.app.hotelMangemet.entities.File;
import com.app.hotelMangemet.repositories.FileRepository;
import com.app.hotelMangemet.services.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RequestMapping("/files")
public class FileController {

    @Autowired
    FileService fileService;

    @GetMapping("/{id}")
    public ResponseEntity<File> retrieveImage(@PathVariable Long id){
        File file = fileService.getImage(id);
        return ResponseEntity.ok(file);
    }
}
