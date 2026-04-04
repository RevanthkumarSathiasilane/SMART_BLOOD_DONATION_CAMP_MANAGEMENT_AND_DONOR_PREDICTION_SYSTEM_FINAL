package com.bloodbank.controller;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/public")
public class PublicController {
    @Autowired BloodStockRepository stockRepo;
    @Autowired CampRepository campRepo;
    @Autowired DonorRepository donorRepo;
    @GetMapping("/stats")
    public Map<String,Object> stats() {
        Map<String,Object> m = new HashMap<>();
        m.put("totalDonors", donorRepo.count());
        m.put("totalCamps", campRepo.count());
        m.put("upcomingCamps", campRepo.findByStatus("UPCOMING").size());
        m.put("bloodStock", stockRepo.findAll());
        Double t = campRepo.totalUnits();
        m.put("totalUnitsCollected", t!=null?t:0);
        return m;
    }
}
