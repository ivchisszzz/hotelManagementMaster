package com.app.hotelMangemet.api;

import com.app.hotelMangemet.dto.HotelDto;
import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.dto.RoomTypeDto;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.entities.Room;
import com.app.hotelMangemet.repositories.FilterRepository;
import com.app.hotelMangemet.services.room.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    FilterRepository filterRepository;

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateRoom(@PathVariable Long id, @RequestBody RoomDto roomDto){
        roomService.updateRoom(id, roomDto);
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteRoom(@PathVariable Long id){
        roomService.deleteRoom(id);
        return ResponseEntity.ok(true);
    }

    @GetMapping("/{roomNumber}")
    public ResponseEntity<Boolean> getRoomByRoomNumber(@PathVariable String roomNumber){
        boolean exists = roomService.getRoomByRoomNumber(roomNumber);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/roomTypes")
    public ResponseEntity<List<RoomTypeDto>> getRoomTypes(){
        List<RoomTypeDto> typeList = roomService.getRoomTypes();
        return ResponseEntity.ok(typeList);
    }

    @GetMapping
    public ResponseEntity<List<RoomDto>> getAvailableRooms(Long id, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut, Integer maxGuests){
        List<Room> list = filterRepository.getAvailableRoomByCityAndMaxGuests(id ,checkIn , checkOut, maxGuests);
        List<RoomDto> dtoList = roomService.getAvailableRooms(list);
        return ResponseEntity.ok(dtoList);
    }



}
