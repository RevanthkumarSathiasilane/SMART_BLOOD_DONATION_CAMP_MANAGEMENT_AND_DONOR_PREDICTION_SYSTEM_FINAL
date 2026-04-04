package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity @Table(name="users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true,nullable=false) private String username;
    @Column(unique=true,nullable=false) private String email;
    @JsonIgnore
    @Column(nullable=false) private String password;
    @Column(nullable=false) private String role;
    private LocalDateTime createdAt;
    @PrePersist public void pre() { this.createdAt = LocalDateTime.now(); }
}
