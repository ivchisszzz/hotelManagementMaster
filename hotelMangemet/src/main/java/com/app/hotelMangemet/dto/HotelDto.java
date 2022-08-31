package com.app.hotelMangemet.dto;

import com.app.hotelMangemet.entities.File;
import lombok.Data;


import java.util.List;

@Data
public class HotelDto {
    private Long id;
    private String hotelName;
    private String location;
    private int rating;
    private List<RoomDto> rooms;
    private List<FacilityDto> facilities;
    private byte[] imageData;
    private String extension;
    private String city;
    private List<FileDto> files;


}
