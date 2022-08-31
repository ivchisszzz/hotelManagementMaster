package com.app.hotelMangemet.api;

import com.app.hotelMangemet.dto.FacilityDto;
import com.app.hotelMangemet.services.facility.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/facilities")
public class FacilityController {

    @Autowired
    FacilityService facilityService;

    @GetMapping("/{id}")
    public ResponseEntity<FacilityDto> getFacilityById(@PathVariable Long id){
        FacilityDto dto = facilityService.getFacility(id);
        return ResponseEntity.ok(dto);
    }
}
