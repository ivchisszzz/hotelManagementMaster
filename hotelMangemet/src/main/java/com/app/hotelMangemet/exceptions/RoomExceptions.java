package com.app.hotelMangemet.exceptions;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class RoomExceptions extends RuntimeException {
    private List<String> validationMessages;

    public RoomExceptions(List<String> validationMessages){
        super(StringUtils.join("\n",validationMessages));
        this.validationMessages = validationMessages;
    }
}
