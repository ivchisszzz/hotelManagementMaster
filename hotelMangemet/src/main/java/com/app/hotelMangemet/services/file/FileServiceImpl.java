package com.app.hotelMangemet.services.file;

import com.app.hotelMangemet.entities.File;
import com.app.hotelMangemet.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileServiceImpl implements FileService{
    @Autowired
    FileRepository fileRepository;

    @Override
    public List<File> getAllFiles() {
        List<File> fileList = fileRepository.findAll();
        return fileList;
    }

    @Override
    public File getImage(Long id) {
        File img = fileRepository.getById(id);
        return img;
    }
}
