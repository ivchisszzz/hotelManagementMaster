package com.app.hotelMangemet.services;

import com.app.hotelMangemet.dto.LoginUserDto;
import com.app.hotelMangemet.dto.UserDto;
import com.app.hotelMangemet.entities.User;
import com.app.hotelMangemet.exceptions.UserExceptions;
import com.app.hotelMangemet.repositories.RoleRepository;
import com.app.hotelMangemet.repositories.UserRepository;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Pattern VALID_EMAIL_ADDRESS_REGEX = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Override
    public LoginUserDto login(String email, String password) {

        List<String> validationMsg = validateLogin(email, password);
        if(!validationMsg.isEmpty()){
            throw new UserExceptions(validationMsg);
        }
        User user = userRepository.findUserByEmail(email);
        if(user == null){
            throw new IllegalArgumentException("User with this email does not exists");
        }
        LoginUserDto loginUserDto = new LoginUserDto();
        loginUserDto.setUserId(user.getId());
        loginUserDto.setRoleName(user.getRole().getRoleName());
        byte[] decodedSalt = decodeHex(user.getSalt());

        if(!user.getPassword().equals(hashPassword(password,decodedSalt))){
            throw new IllegalArgumentException("Wrong password");
        }
        return loginUserDto;

    }

    @Override
    public boolean registerUser(UserDto userDto) {
        if(emailExist(userDto.getEmail())){
            throw new IllegalArgumentException("User with this email already exists");
        }
        List<String> validationMsg = validateUser(userDto);
        if(userDto.getIsPersonal()){
            if(StringUtils.isBlank(userDto.getFirstName())){
                validationMsg.add("First name is required");
            }
            if(StringUtils.isBlank(userDto.getLastName())){
                validationMsg.add("Last name is required");
            }
        }else{
            if(StringUtils.isBlank(userDto.getCompanyName())){
                validationMsg.add("Company name is required");
            }
            if(StringUtils.isBlank(userDto.getVatNumber())){
                validationMsg.add("Vat number is required");
            }
        }

        if(!validationMsg.isEmpty()){
            throw new UserExceptions(validationMsg);
        }
        User newUser = new User();
        if(userDto.getIsPersonal()){
            newUser.setFirstName(userDto.getFirstName());
            newUser.setLastName(userDto.getLastName());
            newUser.setRole(roleRepository.findRoleByRoleName("USER"));
        }else{
            newUser.setCompanyName(userDto.getCompanyName());
            newUser.setVatNumber(userDto.getVatNumber());
            newUser.setRole(roleRepository.findRoleByRoleName("HOTEL_ADMIN"));
        }

        newUser.setEmail(userDto.getEmail());
        newUser.setUsername(userDto.getUsername());
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        newUser.setPassword(hashPassword(userDto.getPassword(), salt));
        newUser.setPhoneNumber(userDto.getPhoneNumber());
        newUser.setSalt(encodeHex(salt));

        userRepository.save(newUser);
        return true;

    }

    private boolean validateEmail(String email) {
        if (null != email) {
            Matcher matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(email);
            return matcher.find();
        }
        return false;
    }

    private boolean emailExist(String email) {
        User user = userRepository.findUserByEmail(email);
        if(user != null){
            return true;
        }else{
            return false;
        }
    }
    private List<String> validateUser(UserDto dto){
        List<String> validationErrors = new ArrayList<>();
        if(StringUtils.isBlank(dto.getEmail())){
            validationErrors.add("Email is required");
        }else if(!validateEmail(dto.getEmail())){
            validationErrors.add("Email is not in the right format");
        }
        if(StringUtils.isBlank(dto.getPhoneNumber())){
            validationErrors.add("Phone number is required");
        }
        if(StringUtils.isBlank(dto.getUsername())){
            validationErrors.add("Username is required");
        }
        if(StringUtils.isBlank(dto.getPassword())){
            validationErrors.add("Password is required");
        }else if(dto.getPassword().length() < 3 ){
            validationErrors.add("Password must be longer than 3 characters");
        }

        return validationErrors;
    }

    private List<String> validateLogin( String email, String password){
        List<String> errorMsg = new ArrayList<>();
        if(password.length() < 3){
            errorMsg.add("Password should be longer than 3 symbols");
        }
        if(!validateEmail(email)){
            errorMsg.add("Email is not in the right format");
        }
        return errorMsg;
    }

    private String hashPassword(String password, byte[] salt){
        String encodedPassword = null;
        KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 128);
        SecretKeyFactory factory = null;
        try {
            factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        try {
            byte[] hash = factory.generateSecret(spec).getEncoded();
             encodedPassword = encodeHex(hash);
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        }

        return encodedPassword;
    }

    String encodeHex(final byte[] bytesToEncode) {
        return Hex.encodeHexString(bytesToEncode);
    }

    byte[] decodeHex(final String encodedBytes) {
        try {
            return Hex.decodeHex(encodedBytes);
        } catch (DecoderException e) {
            e.printStackTrace();
        }
        throw new IllegalArgumentException("Error while decoding");
    }
}
