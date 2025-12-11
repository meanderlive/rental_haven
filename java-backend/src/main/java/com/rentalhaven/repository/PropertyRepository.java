package com.rentalhaven.repository;

import com.rentalhaven.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface PropertyRepository extends JpaRepository<Property, Long> {
} 