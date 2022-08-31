package com.app.hotelMangemet.dto;

import lombok.Data;

@Data
public class FileDto {
    private String fileName;
    private String extension;
    private byte[] imageData;

}
