package com.bloodbank.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "donors")
@Data @NoArgsConstructor @AllArgsConstructor
public class Donor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private String name;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String phone;
    private String city;
    private LocalDate lastDonationDate;
    private Integer totalDonations = 0;
    private Boolean isEligible = true;
}