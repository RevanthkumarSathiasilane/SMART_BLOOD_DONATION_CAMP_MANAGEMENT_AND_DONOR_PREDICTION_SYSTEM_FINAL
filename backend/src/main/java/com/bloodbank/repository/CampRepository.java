package com.bloodbank.repository;
import com.bloodbank.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CampRepository extends JpaRepository<Camp, Long> {
    List<Camp> findByStatus(String status);
    List<Camp> findByCity(String city);
}