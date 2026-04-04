package com.bloodbank.controller;
import com.bloodbank.entity.User;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    @Autowired UserRepository repo;
    @Autowired JwtUtil jwt;
    @Autowired PasswordEncoder enc;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String,String> b) {
        if (repo.existsByUsername(b.get("username")))
            return ResponseEntity.badRequest().body(Map.of("error","Username already taken"));
        if (repo.existsByEmail(b.get("email")))
            return ResponseEntity.badRequest().body(Map.of("error","Email already registered"));
        User u = User.builder()
            .username(b.get("username")).email(b.get("email"))
            .password(enc.encode(b.get("password")))
            .role(b.getOrDefault("role","DONOR")).build();
        repo.save(u);
        return ResponseEntity.ok(Map.of("message","Account created! Please login."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> b) {
        var opt = repo.findByUsername(b.get("username"));
        if (opt.isEmpty())
            return ResponseEntity.status(401).body(Map.of("error",
                "Username not found. Use: admin, donor1, coordinator1, or hospitaladmin"));
        User u = opt.get();
        if (!enc.matches(b.get("password"), u.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error",
                "Wrong password. Default password is: password123"));
        return ResponseEntity.ok(Map.of(
            "token", jwt.generate(u.getUsername(), u.getRole()),
            "role",  u.getRole(),
            "username", u.getUsername(),
            "userId", u.getId(),
            "email", u.getEmail()
        ));
    }
}
