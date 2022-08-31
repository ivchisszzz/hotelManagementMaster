package com.app.hotelMangemet.services.file;

import com.app.hotelMangemet.entities.File;

import java.util.List;

public interface FileService {
    List<File> getAllFiles();
    File getImage(Long id);
}
