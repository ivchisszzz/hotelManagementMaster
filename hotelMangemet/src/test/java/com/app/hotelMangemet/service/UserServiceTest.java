package com.app.hotelMangemet.service;

import com.app.hotelMangemet.dto.LoginUserDto;
import com.app.hotelMangemet.dto.UserDto;
import com.app.hotelMangemet.entities.User;
import com.app.hotelMangemet.exceptions.UserExceptions;
import com.app.hotelMangemet.repositories.UserRepository;
import com.app.hotelMangemet.services.UserServiceImpl;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @Test
     void testLoginWithValidData(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(new User("Iva","Dimitrova", "iva98","iva@abv.bg", "123456","08976544"));
        LoginUserDto isLoggedIn = userService.login("iva@abv.bg", "123456");
        assertThat(isLoggedIn).isNotNull();
    }
    @Test
    void testLoginWithInvalidPassword(){
       Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(new User("Iva","Dimitrova", "iva98","iva@abv.bg", "123456","08976544"));
       Throwable exception = assertThrows(IllegalArgumentException.class, () -> userService.login("iva@abv.bg", "123"));
       assertThat(exception.getMessage()).isEqualTo("Wrong password");
    }
    @Test
    void testLoginWithInvalidEmail(){
        UserExceptions exception = assertThrows(UserExceptions.class, () -> userService.login("iva", "123456"));
        assertThat(exception.getValidationMessages()).contains("Email is not in the right format");
    }
    @Test
    void testLoginWithInvalidPasswordLength(){
        UserExceptions exception = assertThrows(UserExceptions.class, () -> userService.login("iva@abv.bg", "12"));
        assertThat(exception.getValidationMessages()).contains("Password should be longer than 3 symbols");
    }
    @Test
    void testLoginWithNonExistingUser(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        Throwable exception = assertThrows(IllegalArgumentException.class, () -> userService.login("iva@abv.bg", "123456"));
        assertThat(exception.getMessage()).contains("User with this email does not exists");
    }

    @Test
    void testRegisterWithExistingUser(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(new User("Iva","Dimitrova", "iva98","iva@abv.bg", "123456","08976544"));
        Throwable exception = assertThrows(IllegalArgumentException.class, () -> userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@abv.bg", "123456", "0987666")));
        assertThat(exception.getMessage()).isEqualTo("User with this email already exists");
    }
    @Test
    void testRegisterUserWithValidData(){
        Mockito.doReturn(new User()).when(userRepository).save(Mockito.any(User.class));
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        Boolean isRegistered = userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@abv.bg", "123456", "0987666"));
        assertThat(isRegistered).isTrue();
    }

    @Test
    void testRegisterUserWithInvalidFirstName(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("", "Dimitrova", "ivaaa","iva@abv.bg", "123456", "0987666")));
        assertThat(exception.getValidationMessages()).contains("First name is required");
    }
    @Test
    void testRegisterUserWithInvalidLastName(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "", "ivaaa","iva@abv.bg", "123456", "0987666")));
        assertThat(exception.getValidationMessages()).contains("Last name is required");
    }
    @Test
    void testRegisterUserWithInvalidPhoneNumber(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@abv.bg", "123456", "")));
        assertThat(exception.getValidationMessages()).contains("Phone number is required");
    }
    @Test
    void testRegisterUserWithInvalidPasswordLength(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@abv.bg", "12", "")));
        assertThat(exception.getValidationMessages()).contains("Password must be longer than 3 characters");
    }
    @Test
    void testRegisterUserWithInvalidEmailFormat(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@", "123456", "")));
        assertThat(exception.getValidationMessages()).contains("Email is not in the right format");
    }
    @Test
    void testRegisterUserWithBlankPassword(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "Dimitrova", "ivaaa","iva@abv.bg", null, "09876554")));
        assertThat(exception.getValidationMessages()).contains("Password is required");
    }
    @Test
    void testRegisterUserWithBlankUsername(){
        Mockito.when(userRepository.findUserByEmail(Mockito.anyString())).thenReturn(null);
        UserExceptions exception = assertThrows(UserExceptions.class, ()->userService.registerUser(new UserDto("Iva", "Dimitrova", null,"iva@abv.bg", "123456", "09876554")));
        assertThat(exception.getValidationMessages()).contains("Username is required");
    }











}
