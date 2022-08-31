package com.app.hotelMangemet.repositories;

import com.app.hotelMangemet.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

     User findUserByEmail(String email);

}
