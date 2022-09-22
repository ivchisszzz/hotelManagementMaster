package com.app.hotelMangemet.services.reservation;

import com.app.hotelMangemet.dto.ReservationDto;
import com.app.hotelMangemet.dto.ReservationLineChartDto;
import com.app.hotelMangemet.dto.ReservationStatusPieDto;


import java.util.List;

public interface ReservationService {

    void createReservation(ReservationDto reservationDto);

    List<ReservationDto> findReservationByUserId(Long userId);

    void deleteReservation(Long id);

    void cancelReservation(Long id);

    List<ReservationStatusPieDto> getPieDataForHotel(Long hotelId);

    List<ReservationLineChartDto> getLineChartDataForHotelByMonths(Long hotelId, int year);

    List<ReservationDto> findReservationByHotelId(Long hotelId);

}
