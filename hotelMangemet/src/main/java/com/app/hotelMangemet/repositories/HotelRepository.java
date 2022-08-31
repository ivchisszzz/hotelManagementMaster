package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Hotel findHotelByHotelName(String hotelName);

    List<Hotel> findHotelByUserId(Long id);

}
