package com.bloodbank.repository;
import com.bloodbank.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DonationRepository extends JpaRepository<Donation,Long> {
    List<Donation> findByDonorId(Long id);
}
