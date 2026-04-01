package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "camps")
@Data @NoArgsConstructor @AllArgsConstructor
public class Camp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String location;
    private String city;
    private LocalDate campDate;
    private String startTime;
    private String endTime;
    
    @ManyToOne
    @JoinColumn(name = "coordinator_id")
    private User coordinator;
    
    private Integer attendanceCount = 0;
    private Double unitsCollected = 0.0;
    private String status = "UPCOMING";
}
