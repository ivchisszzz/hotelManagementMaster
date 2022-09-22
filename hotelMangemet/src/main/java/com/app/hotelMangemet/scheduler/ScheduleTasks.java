package com.app.hotelMangemet.scheduler;

import com.app.hotelMangemet.entities.Reservation;
import com.app.hotelMangemet.entities.Status;
import com.app.hotelMangemet.repositories.ReservationRepository;
import com.app.hotelMangemet.services.reservation.ReservationServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ScheduleTasks {

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    ReservationServiceImpl reservationService;

    private static final Logger log = LoggerFactory.getLogger(ScheduleTasks.class);

    @Scheduled(cron = "0 13 0 * * ?")
    //@Scheduled(fixedRate = 5000)
    public void setReservationsToComplete(){
        List<Reservation> reservationList = reservationRepository.findAll();
        reservationList.stream().forEach(reservation -> {
            if(reservation.getCheckOutDate().isEqual(LocalDate.now()) || reservation.getCheckOutDate().isBefore(LocalDate.now())){
                reservationService.updateReservationStatus(reservation.getId(), Status.COMPLETED);
            }
        });

    }
}
