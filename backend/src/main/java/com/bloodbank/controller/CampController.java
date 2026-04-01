package com.bloodbank.controller;

import com.bloodbank.entity.Camp;
import com.bloodbank.repository.CampRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/coordinator")
public class CampController {

    @Autowired private CampRepository campRepository;

    @GetMapping("/camps")
    public List<Camp> getAllCamps() { return campRepository.findAll(); }

    @GetMapping("/camps/{id}")
    public ResponseEntity<Camp> getCamp(@PathVariable Long id) {
        return campRepository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/camps")
    public Camp createCamp(@RequestBody Camp camp) {
        return campRepository.save(camp);
    }

    @PutMapping("/camps/{id}")
    public ResponseEntity<Camp> updateCamp(@PathVariable Long id, @RequestBody Camp updated) {
        return campRepository.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setLocation(updated.getLocation());
            c.setCampDate(updated.getCampDate());
            c.setAttendanceCount(updated.getAttendanceCount());
            c.setUnitsCollected(updated.getUnitsCollected());
            c.setStatus(updated.getStatus());
            return ResponseEntity.ok(campRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/camps/{id}")
    public ResponseEntity<?> deleteCamp(@PathVariable Long id) {
        campRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/camps/upcoming")
    public List<Camp> getUpcomingCamps() {
        return campRepository.findByStatus("UPCOMING");
    }
}
