package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="blood_stock")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BloodStock {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(unique=true,nullable=false) private String bloodGroup;
    private Double unitsAvailable;
    private Double criticalLevel;
    private LocalDateTime lastUpdated;
    @PrePersist @PreUpdate public void pre() { this.lastUpdated=LocalDateTime.now(); }
}
