package com.app.hotelMangemet.dto;

import lombok.Data;

@Data
public class UserDto {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
    private Boolean isPersonal;
    private String companyName;
    private String vatNumber;
    private String salt;

    public UserDto(String firstName, String lastName, String username, String email, String password, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;

    }
}
