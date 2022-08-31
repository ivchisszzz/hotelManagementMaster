package com.app.hotelMangemet.api;

import com.app.hotelMangemet.dto.AuthenticationUserBean;
import com.app.hotelMangemet.dto.LoginUserDto;
import com.app.hotelMangemet.dto.UserDto;
import com.app.hotelMangemet.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Boolean> registerUser(@RequestBody UserDto userDto){
       boolean registeredUser =  userService.registerUser(userDto);
       return ResponseEntity.ok(registeredUser);

    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserDto> loginUser(@RequestBody AuthenticationUserBean bean){
        LoginUserDto loggedUser =  userService.login(bean.getEmail(), bean.getPassword());
        return ResponseEntity.ok(loggedUser);

    }
}
