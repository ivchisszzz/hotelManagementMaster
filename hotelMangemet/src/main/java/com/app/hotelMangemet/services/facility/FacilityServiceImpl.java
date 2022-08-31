package com.app.hotelMangemet.services.facility;

import com.app.hotelMangemet.dto.FacilityDto;
import com.app.hotelMangemet.entities.Facility;
import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.repositories.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FacilityServiceImpl implements FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;
    @Override
    public Facility createFacility(FacilityDto facilityDto, Hotel hotel) {
        Facility facility = new Facility();
        facility.setFacilityName(facilityDto.getFacilityName());
        facility.setFacilityCharge(facilityDto.getFacilityCharge());
        facility.setHotel(hotel);
        facilityRepository.save(facility);
        return facility;
    }

    @Override
    public FacilityDto getFacility(Long id) {
        Facility facility = facilityRepository.getById(id);
        FacilityDto facilityDto = new FacilityDto();
        facilityDto.setFacilityName(facility.getFacilityName());
        facilityDto.setFacilityCharge(facility.getFacilityCharge());
        return facilityDto;
    }
}
