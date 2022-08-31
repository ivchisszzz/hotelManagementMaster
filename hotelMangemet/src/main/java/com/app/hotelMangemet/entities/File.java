package com.app.hotelMangemet.entities;

import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Data
@Entity
@Table(name = "images")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    String fileName;
    @Lob
    @Column(columnDefinition = "bytea")
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] image;
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    String extension;

}
