package com.app.hotelMangemet.api;

import com.app.hotelMangemet.dto.HotelDto;
import com.app.hotelMangemet.dto.ReservationDto;
import com.app.hotelMangemet.dto.ReservationLineChartDto;
import com.app.hotelMangemet.dto.ReservationStatusPieDto;
import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.repositories.FilterRepository;
import com.app.hotelMangemet.services.hotel.HotelService;
import com.app.hotelMangemet.services.reservation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@CrossOrigin(origins = "*")
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    HotelService hotelService;

    @Autowired
    FilterRepository filterRepository;

    @Autowired
    ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Long> createHotel(@RequestBody HotelDto hotelDto){
        Long hotelId =  hotelService.createHotel(hotelDto);
        return ResponseEntity.ok(hotelId);
    }
    @PostMapping(value = "/{hotelId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadImages(@RequestParam MultipartFile[] files, @PathVariable Long hotelId) throws IOException {
        hotelService.uploadFiles(files,hotelId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<HotelDto>> getAllHotels(String city, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut, Integer maxGuests){
        List<Hotel> list = filterRepository.getHotelByCityAndMaxGuests(city,checkIn , checkOut, maxGuests);
        List<HotelDto> dtoList = hotelService.getAllHotels(list);
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomDto>> getAllRoomsFromHotel(@PathVariable Long id){
        List<RoomDto> roomDtoList = hotelService.getAllRoomsInHotel(id);
        return ResponseEntity.ok(roomDtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateHotel(@RequestBody HotelDto hotelDto, @PathVariable Long id){
        hotelService.updateHotel(id, hotelDto);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteHotel(@PathVariable Long id){
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/name/{hotelName}")
    public ResponseEntity<Boolean> getHotel(@PathVariable String hotelName){
       boolean exists =  hotelService.getHotelByHotelName(hotelName);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long id){
        HotelDto hotelDto = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotelDto);
    }

    @GetMapping("/{hotelId}/status-statistics")
    public ResponseEntity<List<ReservationStatusPieDto>> getHotelReservationsStatistics(@PathVariable Long hotelId){
        return ResponseEntity.ok(reservationService.getPieDataForHotel(hotelId));
    }

    @GetMapping("/{hotelId}/monthly-statistics")
    public ResponseEntity<List<ReservationLineChartDto>> getHotelReservationsMonthlyStatistics(@PathVariable Long hotelId, @RequestParam int year){
        return ResponseEntity.ok(reservationService.getLineChartDataForHotelByMonths(hotelId,year));
    }

  @GetMapping("/user/{userId}")
    public ResponseEntity<List<HotelDto>> getHotelsByUserId(@PathVariable Long userId){
        List<HotelDto> hotelList = hotelService.getAllHotelsByUserId(userId);
        return ResponseEntity.ok(hotelList);

  }


    @GetMapping("/{hotelId}/reservations")
    public ResponseEntity<List<ReservationDto>> getReservationByHotelId(@PathVariable Long hotelId){
        List<ReservationDto> reservationDtos = reservationService.findReservationByHotelId(hotelId);
        return ResponseEntity.ok(reservationDtos);
    }






}
