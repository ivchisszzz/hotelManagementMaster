package com.app.hotelMangemet.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String hotelName;
    private String location;
    private String city;
    @OneToMany(mappedBy = "hotel", cascade ={CascadeType.REMOVE,CascadeType.PERSIST} )
    private List<Room> rooms;
    @OneToMany(mappedBy = "hotel", cascade = {CascadeType.REMOVE,CascadeType.PERSIST})
    private List<Facility> facilities;
    @OneToMany(mappedBy = "hotel", cascade = {CascadeType.REMOVE,CascadeType.PERSIST})
    private List<File> file;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
