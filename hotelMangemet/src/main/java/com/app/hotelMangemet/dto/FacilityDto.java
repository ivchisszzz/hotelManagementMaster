package com.app.hotelMangemet.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FacilityDto {
    private String facilityName;
    private BigDecimal facilityCharge;
    private Long id;
}
