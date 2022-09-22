package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.Hotel;
import com.app.hotelMangemet.entities.Reservation;
import com.app.hotelMangemet.entities.Room;
import com.app.hotelMangemet.entities.Status;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class FilterRepository {
    EntityManager entityManger;

    public FilterRepository(EntityManager entityManger) {
        this.entityManger = entityManger;
    }

    public List<Hotel> getHotelByCityAndMaxGuests(String city, LocalDate checkIn, LocalDate checkOut, Integer maxGuests) {
        CriteriaBuilder cb = entityManger.getCriteriaBuilder();
        CriteriaQuery<Hotel> cq = cb.createQuery(Hotel.class);
        Root<Room> roomRoot = cq.from(Room.class);
        Join<Room, Reservation> reservationRoom = roomRoot.join("reservations",JoinType.LEFT);
        Join<Room, Hotel> hotel = roomRoot.join("hotel");
        List<Predicate> restrictions = new ArrayList<Predicate>();
        if (checkIn != null && checkOut != null) {
            restrictions.add(cb.or(
                    cb.and(
                            cb.isNull(reservationRoom.get("checkInDate")),
                            cb.isNull(reservationRoom.get("checkOutDate")))
                    ,
                    cb.not(
                          cb.and(
                                 cb.greaterThanOrEqualTo(reservationRoom.get("checkInDate"), checkIn),
                                 cb.lessThanOrEqualTo(reservationRoom.get("checkOutDate"), checkOut))
            )));
        }
        if (!StringUtils.isBlank(city)) {
            restrictions.add(cb.equal(hotel.get("city"), city));
        }
        if (maxGuests != null) {
            restrictions.add(cb.equal(roomRoot.get("maxGuests"), maxGuests));
        }
        cq.where(restrictions.toArray(new Predicate[restrictions.size()]));
        cq.select(hotel);
        cq.distinct(true);
        TypedQuery<Hotel> query = entityManger.createQuery(cq);
        return query.getResultList();

    }

    public List<Room> getAvailableRoomByCityAndMaxGuests(Long id, LocalDate checkIn, LocalDate checkOut, Integer maxGuests) {
        CriteriaBuilder cb = entityManger.getCriteriaBuilder();
        CriteriaQuery<Room> cq = cb.createQuery(Room.class);
        Root<Room> roomRoot = cq.from(Room.class);
        Join<Room, Reservation> reservationRoom = roomRoot.join("reservations",JoinType.LEFT);
        Join<Room, Hotel> hotel = roomRoot.join("hotel");
        List<Predicate> restrictions = new ArrayList<Predicate>();
        if (checkIn != null && checkOut != null) {
            restrictions.add(cb.or(
                    cb.and(
                            cb.isNull(reservationRoom.get("checkInDate")),
                            cb.isNull(reservationRoom.get("checkOutDate")))
                    ,
                    cb.not(
                       cb.or(cb.and(
                               cb.lessThan(reservationRoom.get("checkInDate"),checkOut) , cb.greaterThanOrEqualTo(reservationRoom.get("checkOutDate"),checkOut), cb.notEqual(reservationRoom.get("status"), Status.CANCELED)),

                               cb.and(
                                       cb.lessThan(reservationRoom.get("checkOutDate"),checkOut),
                                       cb.greaterThanOrEqualTo(reservationRoom.get("checkInDate"),checkIn),
                                       cb.notEqual(reservationRoom.get("status"), Status.CANCELED)
                               ),
                               cb.and(cb.lessThan(reservationRoom.get("checkOutDate"), checkOut), cb.lessThanOrEqualTo(reservationRoom.get("checkInDate"), checkIn),
                                       cb.greaterThan(reservationRoom.get("checkOutDate"), checkIn), cb.notEqual(reservationRoom.get("status"), Status.CANCELED)))


                    )));
        }


        if (maxGuests != null) {
            restrictions.add(cb.equal(roomRoot.get("maxGuests"), maxGuests));
        }
        if(id != null){
            restrictions.add(cb.equal(hotel.get("id"), id));
        }

        cq.where(restrictions.toArray(new Predicate[restrictions.size()]));
        cq.select(roomRoot);
        cq.distinct(true);
        TypedQuery<Room> query = entityManger.createQuery(cq);
        return query.getResultList();

    }


}
