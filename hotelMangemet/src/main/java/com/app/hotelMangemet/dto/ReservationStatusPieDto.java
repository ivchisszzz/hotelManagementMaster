package com.app.hotelMangemet.dto;

import com.app.hotelMangemet.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationStatusPieDto {
    private Status status;
    private Long statusCount;
}
