package com.app.hotelMangemet.services;

import com.app.hotelMangemet.dto.LoginUserDto;
import com.app.hotelMangemet.dto.UserDto;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;


public interface UserService {

     LoginUserDto login(String email, String password);
     boolean registerUser(UserDto user) throws NoSuchAlgorithmException, InvalidKeySpecException;


}
