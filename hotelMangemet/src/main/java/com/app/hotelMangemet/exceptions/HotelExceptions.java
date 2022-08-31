package com.app.hotelMangemet.exceptions;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class HotelExceptions extends RuntimeException{
    private List<String> validationMessages;

    public HotelExceptions(List<String> validationMessages){
        super(StringUtils.join("\n",validationMessages));
        this.validationMessages = validationMessages;
    }
}
