package com.app.hotelMangemet.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class ReservationDto {

    private String hotelName;
    private String email;
    private List<String> facilitiesList;
    private double total;
    private String roomType;
    private String firstName;
    private String lastName;
    private String phone;
    private int maxGuests;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long id;
    private String status;
    private Long roomId;



}
