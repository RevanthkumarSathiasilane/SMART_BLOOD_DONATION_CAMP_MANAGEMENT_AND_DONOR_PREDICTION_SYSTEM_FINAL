package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="donations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Donation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="donor_id") private Donor donor;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="camp_id") private Camp camp;
    private LocalDate donationDate;
    private Double unitsDonated;
    private String bloodGroup;
    private String status;
    private LocalDateTime createdAt;
    @PrePersist public void pre() {
        if(this.unitsDonated==null) this.unitsDonated=1.0;
        if(this.status==null) this.status="COMPLETED";
        this.createdAt=LocalDateTime.now();
    }
}
