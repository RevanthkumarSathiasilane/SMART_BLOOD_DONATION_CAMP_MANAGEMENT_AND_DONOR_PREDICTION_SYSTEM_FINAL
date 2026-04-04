package com.bloodbank.repository;
import com.bloodbank.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
public interface CampRepository extends JpaRepository<Camp,Long> {
    List<Camp> findByStatus(String s);
    @Query("SELECT SUM(c.unitsCollected) FROM Camp c WHERE c.status='COMPLETED'")
    Double totalUnits();
    @Query("SELECT SUM(c.attendanceCount) FROM Camp c WHERE c.status='COMPLETED'")
    Long totalAttendance();
}
