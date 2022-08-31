package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    Facility findFacilityByFacilityName(String facilityName);
}
