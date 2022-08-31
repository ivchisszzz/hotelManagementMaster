package com.app.hotelMangemet.services.room;

import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.dto.RoomTypeDto;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.entities.Room;

import java.util.List;

public interface RoomService {

    Room createRoom(RoomDto roomDto, Hotel hotel);

    void updateRoom(Long id, RoomDto roomDto);

    void deleteRoom(Long id);

    Boolean getRoomByRoomNumber(String roomNumber);

    List<RoomTypeDto> getRoomTypes();

    List<RoomDto> getAvailableRooms(List<Room> roomList);



}
