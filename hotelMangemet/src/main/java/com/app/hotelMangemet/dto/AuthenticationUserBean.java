package com.app.hotelMangemet.dto;

import lombok.Data;

@Data
public class AuthenticationUserBean {

    private String email;
    private String password;

    public AuthenticationUserBean(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
