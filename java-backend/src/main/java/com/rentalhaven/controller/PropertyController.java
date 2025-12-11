package com.rentalhaven.controller;

import com.rentalhaven.model.Property;
import com.rentalhaven.model.User;
import com.rentalhaven.repository.PropertyRepository;
import com.rentalhaven.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addProperty(@RequestBody Property property, @RequestParam Long ownerId) {
        Optional<User> ownerOpt = userRepository.findById(ownerId);
        if (ownerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Owner not found");
        }
        property.setOwner(ownerOpt.get());
        propertyRepository.save(property);
        return ResponseEntity.ok(property);
    }
} 