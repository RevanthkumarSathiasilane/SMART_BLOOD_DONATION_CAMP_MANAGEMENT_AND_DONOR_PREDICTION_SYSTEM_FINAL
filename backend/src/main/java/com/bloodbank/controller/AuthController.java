package com.bloodbank.controller;

import com.bloodbank.entity.User;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder encoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String,String> body) {
        if (userRepository.findByUsername(body.get("username")).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error","Username already exists"));
        
        User user = new User();
        user.setUsername(body.get("username"));
        user.setEmail(body.get("email"));
        user.setPassword(encoder.encode(body.get("password")));
        user.setRole(body.getOrDefault("role","DONOR"));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message","User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        Optional<User> optUser = userRepository.findByUsername(body.get("username"));
        if (optUser.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error","User not found"));
        
        User user = optUser.get();
        if (!encoder.matches(body.get("password"), user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error","Invalid password"));
        
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", user.getRole(),
            "username", user.getUsername(),
            "userId", user.getId()
        ));
    }
}