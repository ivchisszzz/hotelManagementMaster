package com.app.hotelMangemet.services.hotel;

import com.app.hotelMangemet.dto.HotelDto;
import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.entities.Hotel;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface HotelService {

     Long createHotel(HotelDto hotelDto);

     void updateHotel(Long id, HotelDto hotelDto);

     void deleteHotel(Long id);

     List<HotelDto> getAllHotels(List<Hotel> hotelList);

     List<RoomDto> getAllRoomsInHotel(Long id);

     Boolean getHotelByHotelName(String name);

     void uploadFiles(MultipartFile[] files, Long id) throws IOException;

     HotelDto getHotelById(Long id);

     List<HotelDto> getAllHotelsByUserId(Long userId);


}
