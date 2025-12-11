package com.rentalhaven.controller;

import com.rentalhaven.model.Property;
import com.rentalhaven.model.User;
import com.rentalhaven.repository.PropertyRepository;
import com.rentalhaven.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seed")
public class SeedController {
    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> seedProperties() {
        Optional<User> userOpt = userRepository.findAll().stream().findFirst();
        User owner;
        if (userOpt.isEmpty()) {
            // Create a default owner if none exists
            User demoOwner = new User();
            demoOwner.setEmail("demo-owner@rentalhaven.com");
            demoOwner.setPassword("demo1234"); // You may want to hash this if you use authentication
            demoOwner.setName("Demo Owner");
            owner = userRepository.save(demoOwner);
        } else {
            owner = userOpt.get();
        }
        List<Property> properties = Arrays.asList(
            createProperty("2BHK Apartment in Mumbai", "Spacious 2BHK in Andheri, Mumbai. Close to metro and malls.", 40000.0, "Mumbai", "Maharashtra", "apartment", owner),
            createProperty("1BHK Flat in Bangalore", "Modern 1BHK in Whitefield, Bangalore. Near IT parks.", 25000.0, "Bangalore", "Karnataka", "apartment", owner),
            createProperty("3BHK House in Delhi", "Large 3BHK in South Delhi. Gated community, park facing.", 55000.0, "Delhi", "Delhi", "house", owner),
            createProperty("Studio in Pune", "Affordable studio in Koregaon Park, Pune. Ideal for singles.", 18000.0, "Pune", "Maharashtra", "studio", owner),
            createProperty("2BHK in Hyderabad", "2BHK in Hitech City, Hyderabad. Fully furnished.", 30000.0, "Hyderabad", "Telangana", "apartment", owner),
            createProperty("1RK in Chennai", "Compact 1RK in T Nagar, Chennai. Close to shopping.", 12000.0, "Chennai", "Tamil Nadu", "studio", owner),
            createProperty("3BHK Villa in Goa", "Luxury 3BHK villa with pool in North Goa.", 90000.0, "Goa", "Goa", "villa", owner),
            createProperty("2BHK in Ahmedabad", "2BHK in Satellite, Ahmedabad. Near schools.", 22000.0, "Ahmedabad", "Gujarat", "apartment", owner),
            createProperty("1BHK in Jaipur", "1BHK in Malviya Nagar, Jaipur. Peaceful locality.", 15000.0, "Jaipur", "Rajasthan", "apartment", owner),
            createProperty("2BHK in Chandigarh", "Modern 2BHK in Sector 22, Chandigarh.", 28000.0, "Chandigarh", "Chandigarh", "apartment", owner),
            createProperty("Studio in Lucknow", "Studio apartment in Gomti Nagar, Lucknow.", 10000.0, "Lucknow", "Uttar Pradesh", "studio", owner),
            createProperty("2BHK in Indore", "2BHK in Vijay Nagar, Indore. Family friendly.", 17000.0, "Indore", "Madhya Pradesh", "apartment", owner),
            createProperty("1BHK in Bhopal", "1BHK in Arera Colony, Bhopal. Green surroundings.", 11000.0, "Bhopal", "Madhya Pradesh", "apartment", owner),
            createProperty("2BHK in Surat", "2BHK in Adajan, Surat. Near riverfront.", 20000.0, "Surat", "Gujarat", "apartment", owner),
            createProperty("3BHK in Kochi", "3BHK in Kakkanad, Kochi. Spacious and airy.", 35000.0, "Kochi", "Kerala", "house", owner),
            createProperty("1BHK in Patna", "1BHK in Boring Road, Patna. Affordable rent.", 9000.0, "Patna", "Bihar", "apartment", owner),
            createProperty("2BHK in Kanpur", "2BHK in Swaroop Nagar, Kanpur. Well connected.", 16000.0, "Kanpur", "Uttar Pradesh", "apartment", owner),
            createProperty("2BHK in Nagpur", "2BHK in Dharampeth, Nagpur. Near market.", 18000.0, "Nagpur", "Maharashtra", "apartment", owner),
            createProperty("1BHK in Thiruvananthapuram", "1BHK in Kowdiar, Thiruvananthapuram. Quiet area.", 13000.0, "Thiruvananthapuram", "Kerala", "apartment", owner),
            createProperty("2BHK in Mysore", "2BHK in VV Mohalla, Mysore. Close to parks.", 14000.0, "Mysore", "Karnataka", "apartment", owner)
        );
        propertyRepository.saveAll(properties);
        return ResponseEntity.ok("Sample properties added.");
    }

    private Property createProperty(String title, String description, Double pricePerNight, String city, String state, String type, User owner) {
        Property p = new Property();
        p.setTitle(title);
        p.setDescription(description + " Price: ₹" + pricePerNight + " per month (INR)");
        p.setPricePerNight(pricePerNight);
        p.setPrice(pricePerNight * 30); // Set monthly price as 30x nightly
        p.setCity(city);
        p.setState(state);
        p.setType(type);
        // Assign unique images for each city/type
        String imageUrl = switch (city + "-" + type) {
            case "Mumbai-apartment" -> "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
            case "Bangalore-apartment" -> "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";
            case "Delhi-house" -> "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80";
            case "Pune-studio" -> "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";
            case "Hyderabad-apartment" -> "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80";
            case "Chennai-studio" -> "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80";
            case "Goa-villa" -> "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80";
            case "Ahmedabad-apartment" -> "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80";
            case "Jaipur-apartment" -> "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80";
            case "Chandigarh-apartment" -> "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";
            case "Lucknow-studio" -> "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";
            case "Indore-apartment" -> "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80";
            case "Bhopal-apartment" -> "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
            case "Surat-apartment" -> "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80";
            case "Kochi-house" -> "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80";
            case "Patna-apartment" -> "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";
            case "Kanpur-apartment" -> "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";
            case "Nagpur-apartment" -> "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
            case "Thiruvananthapuram-apartment" -> "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80";
            case "Mysore-apartment" -> "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80";
            default -> "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
        };
        p.setImages(imageUrl);
        p.setRating(4.2 + Math.random() * 0.7); // random rating between 4.2-4.9
        p.setReviewCount(5 + (int)(Math.random() * 20));
        p.setOwner(owner);
        return p;
    }
} 