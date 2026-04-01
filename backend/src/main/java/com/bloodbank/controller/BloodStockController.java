package com.bloodbank.controller;

import com.bloodbank.entity.BloodStock;
import com.bloodbank.repository.BloodStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hospital")
public class BloodStockController {

    @Autowired private BloodStockRepository bloodStockRepository;

    @GetMapping("/stock")
    public List<BloodStock> getAllStock() {
        return bloodStockRepository.findAll();
    }

    @GetMapping("/stock/alerts")
    public List<BloodStock> getCriticalStock() {
        return bloodStockRepository.findAll().stream()
                .filter(s -> s.getUnitsAvailable() < s.getCriticalLevel())
                .collect(Collectors.toList());
    }

    @PutMapping("/stock/{bloodGroup}")
    public ResponseEntity<BloodStock> updateStock(@PathVariable String bloodGroup,
                                                   @RequestBody Map<String, Double> body) {
        return bloodStockRepository.findByBloodGroup(bloodGroup).map(s -> {
            s.setUnitsAvailable(body.get("units"));
            return ResponseEntity.ok(bloodStockRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stock/summary")
    public Map<String, Object> getStockSummary() {
        List<BloodStock> all = bloodStockRepository.findAll();
        long critical = all.stream().filter(s -> s.getUnitsAvailable() < s.getCriticalLevel()).count();
        double total = all.stream().mapToDouble(BloodStock::getUnitsAvailable).sum();
        return Map.of("totalUnits", total, "criticalGroups", critical, "stockByGroup", all);
    }
}
