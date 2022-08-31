package com.app.hotelMangemet.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rating")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int ratingStars;

}
