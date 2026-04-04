package com.bloodbank.controller;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/admin")
public class AdminController {
    @Autowired UserRepository userRepo;
    @Autowired DonorRepository donorRepo;
    @Autowired CampRepository campRepo;
    @Autowired BloodStockRepository stockRepo;
    @Autowired DonationRepository donRepo;

    @GetMapping("/overview")
    public Map<String,Object> overview() {
        Map<String,Object> m = new HashMap<>();
        m.put("totalUsers", userRepo.count());
        m.put("totalDonors", donorRepo.count());
        m.put("totalCamps", campRepo.count());
        m.put("totalDonations", donRepo.count());
        m.put("upcomingCamps", campRepo.findByStatus("UPCOMING").size());
        m.put("criticalAlerts", stockRepo.findAll().stream()
            .filter(s->s.getUnitsAvailable()<s.getCriticalLevel()).count());
        Double u=campRepo.totalUnits(); Long a=campRepo.totalAttendance();
        m.put("totalUnitsCollected",u!=null?u:0); m.put("totalAttendance",a!=null?a:0);
        m.put("bloodStock",stockRepo.findAll());
        return m;
    }

    @GetMapping("/users") public Object users() { return userRepo.findAll(); }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> del(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message","Deleted"));
    }
}
