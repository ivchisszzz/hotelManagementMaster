package com.app.hotelMangemet.entities;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long facilityId;
    private String facilityName;
    private BigDecimal facilityCharge;
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    @ManyToMany(mappedBy = "facilities")
    private List<Reservation> reservations;


}
