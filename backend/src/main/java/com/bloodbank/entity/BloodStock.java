package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_stock")
@Data @NoArgsConstructor @AllArgsConstructor
public class BloodStock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String bloodGroup;
    
    private Double unitsAvailable;
    private Double criticalLevel;
}
