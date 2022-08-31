package com.app.hotelMangemet.services.reservation;

import com.app.hotelMangemet.dto.ReservationDto;
import com.app.hotelMangemet.entities.Reservation;

import java.util.List;

public interface ReservationService {

    void createReservation(ReservationDto reservationDto);

    void updateReservation(Long id, ReservationDto reservationDto);

    List<ReservationDto> findReservationByUserId(Long userId);

    void deleteReservation(Long id);

    void cancelReservation( Long id);

}
