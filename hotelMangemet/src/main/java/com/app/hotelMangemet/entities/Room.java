package com.app.hotelMangemet.entities;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Enumerated(EnumType.STRING)
    private RoomType roomType;
    private BigDecimal roomCharge;
    private String roomNumber;
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    private int maxGuests;
    @Enumerated(EnumType.STRING)
    private Status roomStatus;
    @OneToMany(mappedBy = "room", cascade ={CascadeType.REMOVE,CascadeType.PERSIST})
    List<Reservation> reservations;


}
