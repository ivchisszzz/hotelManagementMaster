package com.app.hotelMangemet.exceptions;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class ReservationException extends RuntimeException {
    private List<String> validationMessages;

    public ReservationException(List<String> validationMessages){
        super(StringUtils.join("\n",validationMessages));
        this.validationMessages = validationMessages;
    }
}
