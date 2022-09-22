package com.app.hotelMangemet.services.reservation;

import com.app.hotelMangemet.dto.ReservationDto;
import com.app.hotelMangemet.dto.ReservationLineChartDto;
import com.app.hotelMangemet.dto.ReservationStatusPieDto;
import com.app.hotelMangemet.entities.*;
import com.app.hotelMangemet.exceptions.ReservationException;
import com.app.hotelMangemet.repositories.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void createReservation(ReservationDto reservationDto) {
        List<String> validationErrors = validateReservationFields(reservationDto);
        if(!validationErrors.isEmpty()){
            throw new ReservationException(validationErrors);
        }
        Reservation reservation = new Reservation();
        Hotel hotel = hotelRepository.findHotelByHotelName(reservationDto.getHotelName());
        reservation.setHotel(hotel);
        reservation.setCreatedOn(LocalDate.now());
        reservation.setCheckInDate(reservationDto.getCheckInDate());
        reservation.setCheckOutDate(reservationDto.getCheckOutDate());
        reservation.setPhone(reservationDto.getPhone());
        User user = userRepository.findUserByEmail(reservationDto.getEmail());
        reservation.setUser(user);
        List<Facility> facilities = new ArrayList<>();
        reservationDto.getFacilitiesList().stream().forEach(f -> {
            Facility newFacility = facilityRepository.getById(Long.valueOf(f));
            facilities.add(newFacility);
        });
        reservation.setFacilities(facilities);
        Room room = roomRepository.getById(reservationDto.getRoomId());
        reservation.setRoom(room);
        reservation.setTotal(reservationDto.getTotal());
        reservation.setStatus(Status.ONGOING);
        reservationRepository.save(reservation);
    }


    @Override
    public List<ReservationDto> findReservationByUserId(Long userId) {
        List<Reservation> reservations = reservationRepository.findAll();
        List<ReservationDto> reservationDtos = new ArrayList<>();
        reservations.stream().filter(r -> r.getUser().getId().equals(userId)).forEach(reservation -> {
            ReservationDto dto = new ReservationDto();
            dto.setCheckInDate(reservation.getCheckInDate());
            dto.setCheckOutDate(reservation.getCheckOutDate());
            dto.setHotelName(reservation.getHotel().getHotelName());
            dto.setFirstName(reservation.getUser().getFirstName());
            dto.setLastName(reservation.getUser().getLastName());
            dto.setPhone(reservation.getPhone());
            dto.setRoomType(reservation.getRoom().getRoomType().toString());
            dto.setMaxGuests(reservation.getRoom().getMaxGuests());
            dto.setTotal(reservation.getTotal());
            dto.setId(reservation.getId());
            dto.setStatus(reservation.getStatus().toString());
            reservationDtos.add(dto);
        });

        return reservationDtos;
    }

    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public void cancelReservation( Long id) {
       Reservation reservation = reservationRepository.getById(id);
       List<String> errors = new ArrayList<>();
       if(reservation.getCheckInDate().isBefore(LocalDate.now().minusDays(2))){
           errors.add(String.format("Reservation can not be canceled 2 days before the check in date %s", reservation.getCheckInDate().toString()));
          throw new ReservationException(errors);
       }else{
           reservation.setStatus(Status.CANCELED);
           reservationRepository.save(reservation);
       }

    }

    @Override
    public List<ReservationStatusPieDto> getPieDataForHotel(Long hotelId) {
        return  Stream.of(Status.ONGOING,Status.CANCELED,Status.COMPLETED)
                .map(status -> {
                    Long reservationCountForStatus = reservationRepository.countByHotelIdAndStatus(hotelId,status);
                    return new ReservationStatusPieDto(status,reservationCountForStatus);
                }).collect(Collectors.toList());
    }

    @Override
    public List<ReservationLineChartDto> getLineChartDataForHotelByMonths(Long hotelId, int year) {


        return     Arrays.stream(  Month.values()).map(month->{
            ReservationLineChartDto dto =  new ReservationLineChartDto();
            dto.setMonthName(month.getDisplayName(TextStyle.SHORT, Locale.getDefault()));
            LocalDate monthStartDate = LocalDate.of(year,month,1);
            LocalDate monthEndDate = monthStartDate.with(TemporalAdjusters.lastDayOfMonth());
            dto.setCompletedCount(reservationRepository.countByHotelIdAndStatusAndCreatedOnGreaterThanEqualAndCreatedOnLessThanEqual(hotelId,Status.COMPLETED,monthStartDate,monthEndDate));
            dto.setCancelledCount(reservationRepository.countByHotelIdAndStatusAndCreatedOnGreaterThanEqualAndCreatedOnLessThanEqual(hotelId,Status.CANCELED,monthStartDate,monthEndDate));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> findReservationByHotelId(Long hotelId) {
        List<Reservation> reservations = reservationRepository.findAll();
        List<ReservationDto> reservationDtos = new ArrayList<>();
        reservations.stream().filter(r -> r.getHotel().getId().equals(hotelId)).forEach(reservation -> {
            ReservationDto dto = new ReservationDto();
            dto.setCheckInDate(reservation.getCheckInDate());
            dto.setCheckOutDate(reservation.getCheckOutDate());
            dto.setHotelName(reservation.getHotel().getHotelName());
            dto.setFirstName(reservation.getUser().getFirstName());
            dto.setLastName(reservation.getUser().getLastName());
            dto.setPhone(reservation.getPhone());
            dto.setRoomType(reservation.getRoom().getRoomType().toString());
            dto.setMaxGuests(reservation.getRoom().getMaxGuests());
            dto.setTotal(reservation.getTotal());
            dto.setId(reservation.getId());
            dto.setStatus(reservation.getStatus().toString());
            reservationDtos.add(dto);
        });

        return reservationDtos;
    }

    private List<String> validateReservationFields(ReservationDto reservationDto){
        List<String> validationErrors = new ArrayList<>();
        if(StringUtils.isBlank(reservationDto.getHotelName())){
            validationErrors.add("You should choose hotel");
        }
        if(reservationDto.getCheckInDate().isAfter(reservationDto.getCheckOutDate())){
            validationErrors.add("Check-in date should not be after check-out date");
        }
        if(StringUtils.isBlank(reservationDto.getFirstName())){
            validationErrors.add("The first name should not be empty");
        }
        if(StringUtils.isBlank(reservationDto.getLastName())){
            validationErrors.add("The last name should not be empty");
        }
        if(StringUtils.isBlank(reservationDto.getPhone())){
            validationErrors.add("The phone number shoul not be empty");
        }
        if(!checkIfUserExists(reservationDto.getEmail())){
            validationErrors.add("There is no user with this email");
        }
        return validationErrors;
    }

    private boolean checkIfUserExists(String email){
        User user = userRepository.findUserByEmail(email);
        return user != null;
    }

    public void updateReservationStatus(Long reservationId, Status status){
        Reservation reservation = reservationRepository.getById(reservationId);
        reservation.setStatus(status);
        reservationRepository.save(reservation);
    }
}
