package com.app.hotelMangemet.exceptions;

import lombok.Data;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
@Getter
public class UserExceptions extends RuntimeException{

    private List<String> validationMessages;

    public UserExceptions(List<String> validationMessages){
        super(StringUtils.join("\n",validationMessages));
        this.validationMessages = validationMessages;
    }


}
