package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.Reservation;
import com.app.hotelMangemet.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Long  countByHotelIdAndStatus(Long hotelId, Status status);

    Long  countByHotelIdAndStatusAndCreatedOnGreaterThanEqualAndCreatedOnLessThanEqual(Long hotelId, Status status, LocalDate monthStartDate, LocalDate monthEndDate);
}

