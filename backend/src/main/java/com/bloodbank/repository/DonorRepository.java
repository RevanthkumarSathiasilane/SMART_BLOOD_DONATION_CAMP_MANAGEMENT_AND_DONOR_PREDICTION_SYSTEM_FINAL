package com.bloodbank.repository;
import com.bloodbank.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface DonorRepository extends JpaRepository<Donor,Long> {
    List<Donor> findByBloodGroup(String bg);
    List<Donor> findByIsEligible(Boolean e);
    @Query("SELECT d.bloodGroup,COUNT(d) FROM Donor d GROUP BY d.bloodGroup")
    List<Object[]> countByGroup();
}
