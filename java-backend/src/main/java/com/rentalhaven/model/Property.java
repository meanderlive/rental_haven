package com.rentalhaven.model;

import jakarta.persistence.*;

@Entity
@Table(name = "properties")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double pricePerNight; // maps to price

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String type;

    @Column(nullable = true)
    private String images; // comma-separated URLs

    @Column(nullable = false)
    private Double rating = 4.5;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getPricePerNight() { return pricePerNight != null ? pricePerNight : price; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; this.price = pricePerNight; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
} 