package com.bloodbank.controller;
import com.bloodbank.entity.BloodStock;
import com.bloodbank.repository.BloodStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api/hospital")
public class BloodStockController {
    @Autowired BloodStockRepository repo;

    @GetMapping("/stock")
    public List<BloodStock> all() { return repo.findAll(); }

    @GetMapping("/stock/alerts")
    public List<BloodStock> alerts() {
        return repo.findAll().stream()
            .filter(s -> s.getUnitsAvailable() < s.getCriticalLevel())
            .collect(Collectors.toList());
    }

    @GetMapping("/stock/summary")
    public Map<String,Object> summary() {
        List<BloodStock> all = repo.findAll();
        long crit = all.stream().filter(s->s.getUnitsAvailable()<s.getCriticalLevel()).count();
        double total = all.stream().mapToDouble(BloodStock::getUnitsAvailable).sum();
        return Map.of("totalUnits",total,"criticalGroups",crit,"stockByGroup",all,"healthyGroups",all.size()-crit);
    }

    @PutMapping("/stock/{bg}")
    public ResponseEntity<BloodStock> update(@PathVariable String bg, @RequestBody Map<String,Double> b) {
        return repo.findByBloodGroup(bg).map(s->{
            s.setUnitsAvailable(b.get("units")); return ResponseEntity.ok(repo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/stock/add/{bg}")
    public ResponseEntity<BloodStock> add(@PathVariable String bg, @RequestBody Map<String,Double> b) {
        return repo.findByBloodGroup(bg).map(s->{
            s.setUnitsAvailable(s.getUnitsAvailable()+b.get("units")); return ResponseEntity.ok(repo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }
}
