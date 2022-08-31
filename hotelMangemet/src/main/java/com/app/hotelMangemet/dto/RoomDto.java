package com.app.hotelMangemet.dto;

import com.app.hotelMangemet.entities.RoomType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomDto {
    private RoomType roomType;
    private BigDecimal roomCharge;
   private Long id;
    private int maxGuests;
    private String roomNumber;

}
