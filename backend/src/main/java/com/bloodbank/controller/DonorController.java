package com.bloodbank.controller;

import com.bloodbank.entity.Donor;
import com.bloodbank.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/donor")
public class DonorController {

    @Autowired 
    private DonorRepository donorRepository;

    @GetMapping("/all")
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonor(@PathVariable Long id) {
        return donorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public Donor registerDonor(@RequestBody Donor donor) {
        // Eligibility: Must be 90 days after last donation
        if (donor.getLastDonationDate() != null) {
            LocalDate nextEligible = donor.getLastDonationDate().plusDays(90);
            donor.setIsEligible(LocalDate.now().isAfter(nextEligible));
        }
        return donorRepository.save(donor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long id, @RequestBody Donor updated) {
        return donorRepository.findById(id).map(d -> {
            d.setName(updated.getName());
            d.setPhone(updated.getPhone());
            d.setCity(updated.getCity());
            return ResponseEntity.ok(donorRepository.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/eligibility/{id}")
    public ResponseEntity<Map<String, Object>> checkEligibility(@PathVariable Long id) {
        return donorRepository.findById(id).map(d -> {

            boolean eligible = true;
            String reason = "Eligible to donate";

            if (d.getLastDonationDate() != null) {
                LocalDate nextEligible = d.getLastDonationDate().plusDays(90);
                eligible = LocalDate.now().isAfter(nextEligible);

                if (!eligible) {
                    reason = "Must wait until " + nextEligible;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("eligible", eligible);
            response.put("reason", reason);
            response.put("lastDonation",
                    d.getLastDonationDate() != null ? d.getLastDonationDate() : "Never");

            return ResponseEntity.ok(response);

        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public List<Donor> getDonorsByBloodGroup(@PathVariable String bloodGroup) {
        return donorRepository.findByBloodGroup(bloodGroup);
    }
}