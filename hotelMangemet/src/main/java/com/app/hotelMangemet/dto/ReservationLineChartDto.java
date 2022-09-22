package com.app.hotelMangemet.dto;

import lombok.Data;

@Data
public class ReservationLineChartDto {
    private String monthName;
    private Long cancelledCount;
    private Long completedCount;
}
