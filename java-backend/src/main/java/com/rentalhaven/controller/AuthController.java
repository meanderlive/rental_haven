package com.rentalhaven.controller;

import com.rentalhaven.model.User;
import com.rentalhaven.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email already in use");
            return ResponseEntity.badRequest().body(error);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        Map<String, Object> response = new HashMap<>();
        savedUser.setPassword(null); // Don't return password
        response.put("user", savedUser);
        response.put("token", "dummy-token");
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        Optional<User> userOpt = userRepository.findByEmail(loginUser.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(loginUser.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            user.setPassword(null); // Don't return password
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", "dummy-token");
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid credentials");
        return ResponseEntity.status(401).body(error);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
} 