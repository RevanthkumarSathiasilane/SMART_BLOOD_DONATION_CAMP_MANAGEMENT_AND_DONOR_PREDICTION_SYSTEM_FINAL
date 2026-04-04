package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="donors")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Donor {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="user_id") private User user;
    private String name;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String phone;
    private String city;
    private LocalDate lastDonationDate;
    private Integer totalDonations;
    private Boolean isEligible;
    private LocalDateTime createdAt;
    @PrePersist public void pre() {
        if(this.totalDonations==null) this.totalDonations=0;
        if(this.isEligible==null) this.isEligible=true;
        this.createdAt=LocalDateTime.now();
    }
}
