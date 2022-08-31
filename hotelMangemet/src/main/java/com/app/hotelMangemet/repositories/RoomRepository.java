package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findRoomByRoomNumber(String roomNumber);

    List<Room> findAllByHotelId(Long id);

    Room findRoomByMaxGuests(int maxGuests);
}
