package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="camps")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Camp {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    private String location;
    private String city;
    private LocalDate campDate;
    private String startTime;
    private String endTime;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="coordinator_id") private User coordinator;
    private Integer attendanceCount;
    private Double unitsCollected;
    private String status;
    private LocalDateTime createdAt;
    @PrePersist public void pre() {
        if(this.attendanceCount==null) this.attendanceCount=0;
        if(this.unitsCollected==null) this.unitsCollected=0.0;
        if(this.status==null) this.status="UPCOMING";
        this.createdAt=LocalDateTime.now();
    }
}
