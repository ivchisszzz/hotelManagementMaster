package com.app.hotelMangemet.entities;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    private Hotel hotel;
    @ManyToOne
    private User user;
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDate createdOn;
    private LocalDate updatedOn;
    @ManyToMany(cascade = { CascadeType.PERSIST,CascadeType.MERGE,CascadeType.DETACH })
    @JoinTable(
            name = "reservations_facilities",
            joinColumns = { @JoinColumn(name = "id") },
            inverseJoinColumns = { @JoinColumn(name = "facilityId") }
    )
    private List<Facility> facilities;
    private String phone;
    private double total;
    @Enumerated(EnumType.STRING)
    private Status status;


}
