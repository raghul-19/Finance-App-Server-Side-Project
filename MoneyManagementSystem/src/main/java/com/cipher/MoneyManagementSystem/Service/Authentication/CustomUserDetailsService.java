package com.cipher.MoneyManagementSystem.Service.Authentication;


import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.UUID;

@Service

public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ProfileEntity profile=profileRepository.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT,"User not found with email: " + email));
        if(profile.getPassword()==null) {
            profile.setPassword("Dummy_Password_123"+ UUID.randomUUID().toString());
        }
        return new org.springframework.security.core.userdetails.User(
                profile.getEmail(),
                profile.getPassword(),
                Collections.emptyList()
        );
    }
}
