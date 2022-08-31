package com.app.hotelMangemet.services.hotel;

import com.app.hotelMangemet.dto.FacilityDto;
import com.app.hotelMangemet.dto.FileDto;
import com.app.hotelMangemet.dto.HotelDto;
import com.app.hotelMangemet.dto.RoomDto;
import com.app.hotelMangemet.entities.Facility;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.entities.File;
import com.app.hotelMangemet.entities.Room;
import com.app.hotelMangemet.exceptions.HotelExceptions;
import com.app.hotelMangemet.exceptions.RoomExceptions;
import com.app.hotelMangemet.repositories.FacilityRepository;
import com.app.hotelMangemet.repositories.FileRepository;
import com.app.hotelMangemet.repositories.HotelRepository;
import com.app.hotelMangemet.repositories.RoomRepository;
import com.app.hotelMangemet.services.facility.FacilityService;
import com.app.hotelMangemet.services.room.RoomServiceImpl;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelServiceImpl implements HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomServiceImpl roomService;

    @Autowired
    private FacilityService facilityService;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private FileRepository fileRepository;

    @Override
    public Long createHotel(HotelDto hotelDto) {
        List<String> validationHotelMsg = validateHotelFields(hotelDto);
        if (!validationHotelMsg.isEmpty()) {
            throw new HotelExceptions(validationHotelMsg);
        }
        for (var room : hotelDto.getRooms()) {
            List<String> validation = roomService.validateRoomFields(room);
            if (!validation.isEmpty()) {
                throw new RoomExceptions(validation);
            }
        }

        Hotel hotel = new Hotel();
        hotel.setHotelName(hotelDto.getHotelName());
        hotel.setLocation(hotelDto.getLocation());
        hotel.setCity(hotelDto.getCity());
        hotelRepository.save(hotel);
        List<Room> roomList = new ArrayList<>();

        for (var room : hotelDto.getRooms()) {
          Room roomToCreate = roomService.createRoom(room, hotel);
          roomList.add(roomToCreate);
        }
        hotel.setRooms(roomList);
        List<Facility> facilityList = new ArrayList<>();
        for(var facility : hotelDto.getFacilities()){
            Facility createNewFacility = facilityService.createFacility(facility, hotel);
            facilityList.add(createNewFacility);
        }
        hotel.setFacilities(facilityList);
        return hotel.getId();
    }

    @Override
    public void updateHotel(Long id, HotelDto hotelDto) {

        Hotel hotel = hotelRepository.getById(id);
        hotel.setHotelName(hotelDto.getHotelName());
        hotel.setLocation(hotelDto.getLocation());
        hotelRepository.save(hotel);

        hotelDto.getFacilities().forEach(facilityDto -> {
            if(facilityDto.getId() == null){
                facilityService.createFacility(facilityDto, hotel);
            }else{
                Facility updatedFacility = facilityRepository.getById(facilityDto.getId());
                updatedFacility.setFacilityName(facilityDto.getFacilityName());
                updatedFacility.setFacilityCharge(facilityDto.getFacilityCharge());
                facilityRepository.save(updatedFacility);
            }
        });

        hotelDto.getRooms().forEach(roomDto -> {
            if(roomDto.getId() == null){
                roomService.createRoom(roomDto, hotel);
            }else{
                Room room = roomRepository.getById(roomDto.getId());
                room.setRoomCharge(roomDto.getRoomCharge());
                roomRepository.save(room);
            }
        });

    }

    @Override
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.getById(id);
        hotelRepository.delete(hotel);
    }

    @Override
    public List<HotelDto> getAllHotels(List<Hotel> hotelList) {
        List<HotelDto> dtoList = new ArrayList<>();
        hotelList.forEach(hotel -> {
            HotelDto dto = new HotelDto();
            dto.setId(hotel.getId());
            dto.setHotelName(hotel.getHotelName());
            dto.setLocation(hotel.getLocation());
            dto.setImageData(hotel.getFile().get(0).getImage());
            dto.setExtension(hotel.getFile().get(0).getExtension());
            List<RoomDto> roomDtoList = new ArrayList<>();
            hotel.getRooms().forEach(room -> {
                RoomDto roomDto = new RoomDto();
                roomDto.setRoomCharge(room.getRoomCharge());
                roomDto.setRoomType(room.getRoomType());
                roomDto.setRoomNumber(room.getRoomNumber());
                roomDto.setMaxGuests(room.getMaxGuests());
                roomDtoList.add(roomDto);
            });
            dto.setRooms(roomDtoList);
            List<FacilityDto> facilityDtos = new ArrayList<>();
            hotel.getFacilities().forEach(facility -> {
                FacilityDto fDto = new FacilityDto();
                fDto.setFacilityCharge(facility.getFacilityCharge());
                fDto.setFacilityName(facility.getFacilityName());
                facilityDtos.add(fDto);
            });
            dto.setFacilities(facilityDtos);

            dtoList.add(dto);
        });
        return dtoList;
    }

    @Override
    public List<RoomDto> getAllRoomsInHotel(Long id) {
        List<Room> roomList = roomRepository.findAllByHotelId(id);
        List<RoomDto> dtoList = new ArrayList<>();
        roomList.forEach(room -> {
            RoomDto roomDto = new RoomDto();
            roomDto.setRoomType(room.getRoomType());
            roomDto.setRoomNumber(room.getRoomNumber());
            roomDto.setRoomCharge(room.getRoomCharge());
            roomDto.setMaxGuests(room.getMaxGuests());
            dtoList.add(roomDto);
        });
        return dtoList;
    }

    @Override
    public Boolean getHotelByHotelName(String name) {
        return doesHotelExists(name);
    }

    @Override
    public void uploadFiles(MultipartFile[] files, Long id) throws IOException {
        Hotel hotel = hotelRepository.getById(id);
        for(var file : files){
            File image = new File();
            image.setFileName(file.getOriginalFilename());
            image.setImage(file.getBytes());
            image.setHotel(hotel);
            image.setExtension(FilenameUtils.getExtension(file.getOriginalFilename()));
            fileRepository.save(image);
        }


    }

    @Override
    public HotelDto getHotelById(Long id) {
        HotelDto dto = new HotelDto();
        Hotel hotel = hotelRepository.getById(id);
        dto.setId(hotel.getId());
        dto.setCity(hotel.getCity());
        dto.setHotelName(hotel.getHotelName());
        List<FacilityDto> facility = new ArrayList<>();
        hotel.getFacilities().stream().forEach( f -> {
            FacilityDto facilityDto = new FacilityDto();
            facilityDto.setFacilityName(f.getFacilityName());
            facilityDto.setFacilityCharge(f.getFacilityCharge());
            facilityDto.setId(f.getFacilityId());
            facility.add(facilityDto);
        });
        dto.setFacilities(facility);
        dto.setLocation(hotel.getLocation());
        List<RoomDto> rooms = new ArrayList<>();
        hotel.getRooms().stream().forEach(r->{
            RoomDto roomDto = new RoomDto();
            roomDto.setId(r.getId());
            roomDto.setMaxGuests(r.getMaxGuests());
            roomDto.setRoomType(r.getRoomType());
            roomDto.setRoomNumber(r.getRoomNumber());
            roomDto.setRoomCharge(r.getRoomCharge());
            rooms.add(roomDto);
        });
        dto.setRooms(rooms);
        List<FileDto> fileDtoList = new ArrayList<>();
        hotel.getFile().stream().forEach(f-> {
            FileDto dtofile = new FileDto();
            dtofile.setExtension(f.getExtension());
            dtofile.setFileName(f.getFileName());
            dtofile.setImageData(f.getImage());
            fileDtoList.add(dtofile);
        });
        dto.setFiles(fileDtoList);
        return dto;

    }

    @Override
    public List<HotelDto> getAllHotelsByUserId(Long userId) {
        List<HotelDto> hotelDtoList = new ArrayList<>();
        List<Hotel> hotelList = hotelRepository.findHotelByUserId(userId);
        hotelList.forEach(hotel -> {
            HotelDto hotelDto = new HotelDto();
            hotelDto.setId(hotel.getId());
            hotelDto.setHotelName(hotel.getHotelName());
            hotelDto.setLocation(hotel.getLocation());
            hotelDto.setCity(hotel.getCity());
            hotelDto.setImageData(hotel.getFile().get(0).getImage());
            List<FacilityDto> facilityDtos = hotel.getFacilities().stream().map(facility -> {
                FacilityDto facilityDto = new FacilityDto();
                facilityDto.setFacilityName(facility.getFacilityName());
                return facilityDto;
            }).collect(Collectors.toList());
            hotelDto.setFacilities(facilityDtos);
            hotelDtoList.add(hotelDto);
        });
        return hotelDtoList;
    }

    private List<String> validateHotelFields(HotelDto hotelDto) {
        List<String> validationHotelMsg = new ArrayList<>();
        if (StringUtils.isBlank(hotelDto.getHotelName())) {
            validationHotelMsg.add("Hotel name cannot be empty");
        }
        if (StringUtils.isBlank(hotelDto.getLocation())) {
            validationHotelMsg.add("Hotel location cannot be empty");
        }
        if (hotelDto.getRooms().isEmpty()) {
            validationHotelMsg.add("Hotel should have at least one room");
        }
        if (doesHotelExists(hotelDto.getHotelName())) {
            validationHotelMsg.add("Hotel with this name already exist");
        }

        return validationHotelMsg;
    }

    private boolean doesHotelExists(String hotelName) {
        Hotel hotel = hotelRepository.findHotelByHotelName(hotelName);
        boolean exists = hotel != null ? true : false;
        return exists;
    }



}
