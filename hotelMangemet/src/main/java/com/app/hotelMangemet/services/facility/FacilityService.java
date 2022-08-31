package com.app.hotelMangemet.services.facility;

import com.app.hotelMangemet.dto.FacilityDto;
import com.app.hotelMangemet.entities.Facility;
import com.app.hotelMangemet.entities.Hotel;

public interface FacilityService {
    Facility createFacility(FacilityDto facilityDto, Hotel hotel);

    FacilityDto getFacility(Long id);


}
