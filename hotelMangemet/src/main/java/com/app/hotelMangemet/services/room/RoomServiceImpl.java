package com.app.hotelMangemet.services.room;

import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.dto.RoomTypeDto;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.entities.Room;
import com.app.hotelMangemet.entities.RoomType;
import com.app.hotelMangemet.entities.Status;
import com.app.hotelMangemet.repositories.RoomRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Override
    public Room createRoom(RoomDto roomDto, Hotel hotel) {
        Room room = new Room();
        room.setRoomType(roomDto.getRoomType());
        room.setRoomCharge(roomDto.getRoomCharge());
        room.setRoomNumber(roomDto.getRoomNumber());
        room.setMaxGuests(roomDto.getMaxGuests());
        room.setRoomStatus(Status.FREE);
        room.setHotel(hotel);
        roomRepository.save(room);
        return room;

    }

    @Override
    public void updateRoom(Long id, RoomDto roomDto) {

        Room room = roomRepository.getById(id);
        room.setRoomNumber(roomDto.getRoomNumber());
        room.setRoomType(room.getRoomType());
        room.setRoomCharge(roomDto.getRoomCharge());
        room.setMaxGuests(roomDto.getMaxGuests());
        roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.getById(id);
        roomRepository.delete(room);
    }

    @Override
    public Boolean getRoomByRoomNumber(String roomNumber) {
        return roomWithThisNumberExists(roomNumber);
    }

    @Override
    public List<RoomTypeDto> getRoomTypes() {
        List<RoomType> roomTypeList = Arrays.asList(RoomType.values());
        List<RoomTypeDto> list = new ArrayList<>();
        for(RoomType type : roomTypeList){
            RoomTypeDto dto = new RoomTypeDto();
            dto.setLabel(type.name().toLowerCase());
            dto.setValue(type.name());
            list.add(dto);
        }
        return list;
    }

    @Override
    public List<RoomDto> getAvailableRooms(List<Room> roomList) {
        List<RoomDto> roomDtoList = roomList.stream().map(room -> {
            RoomDto dto = new RoomDto();
            dto.setId(room.getId());
            dto.setRoomCharge(room.getRoomCharge());
            dto.setRoomType(room.getRoomType());
            dto.setRoomNumber(room.getRoomNumber());
            dto.setMaxGuests(room.getMaxGuests());
            return dto;
        }).collect(Collectors.toList());

        return roomDtoList;
    }

    public List<String> validateRoomFields(RoomDto roomDto) {
        List<String> validationRoomMsg = new ArrayList<>();
        if (StringUtils.isBlank(roomDto.getRoomType().toString())) {
            validationRoomMsg.add("Room type should not be empty");
        }
        if (roomDto.getRoomCharge() == null) {
            validationRoomMsg.add("Room charge should not be empty");
        }
        if (roomDto.getMaxGuests() <= 0) {
            validationRoomMsg.add("Number of guests should be greater than 0");
        }


        return validationRoomMsg;
    }

    public boolean roomWithThisNumberExists(String roomNumber) {
        Room room = roomRepository.findRoomByRoomNumber(roomNumber);
        boolean exists = room != null ? true : false;
        return exists;
    }


}
