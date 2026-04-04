package com.bloodbank.controller;
import com.bloodbank.entity.Donor;
import com.bloodbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController @RequestMapping("/api/donor")
public class DonorController {
    @Autowired DonorRepository repo;

    @GetMapping("/all")
    public List<Donor> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> byId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<Donor> register(@RequestBody Donor d) {
        if (d.getLastDonationDate() != null)
            d.setIsEligible(LocalDate.now().isAfter(d.getLastDonationDate().plusDays(90)));
        else d.setIsEligible(true);
        if (d.getTotalDonations() == null) d.setTotalDonations(0);
        return ResponseEntity.ok(repo.save(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> update(@PathVariable Long id, @RequestBody Donor upd) {
        return repo.findById(id).map(d -> {
            if(upd.getName()!=null) d.setName(upd.getName());
            if(upd.getPhone()!=null) d.setPhone(upd.getPhone());
            if(upd.getCity()!=null) d.setCity(upd.getCity());
            if(upd.getLastDonationDate()!=null) {
                d.setLastDonationDate(upd.getLastDonationDate());
                d.setIsEligible(LocalDate.now().isAfter(upd.getLastDonationDate().plusDays(90)));
            }
            return ResponseEntity.ok(repo.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/eligibility/{id}")
    public ResponseEntity<?> eligibility(@PathVariable Long id) {
        return repo.findById(id).map(d -> {
            boolean elig = true;
            String reason = "You are eligible to donate!";
            String next = "Now";
            if (d.getLastDonationDate() != null) {
                LocalDate nx = d.getLastDonationDate().plusDays(90);
                elig = LocalDate.now().isAfter(nx);
                next = nx.toString();
                if (!elig) reason = "Please wait until " + nx;
            }
            Map<String,Object> r = new HashMap<>();
            r.put("eligible",elig); r.put("reason",reason);
            r.put("nextEligibleDate",next); r.put("lastDonation",d.getLastDonationDate());
            r.put("totalDonations",d.getTotalDonations()); r.put("bloodGroup",d.getBloodGroup());
            return ResponseEntity.ok(r);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public Map<String,Object> stats() {
        Map<String,Object> m = new HashMap<>();
        m.put("total", repo.count());
        m.put("eligible", repo.findByIsEligible(true).size());
        Map<String,Long> bg = new LinkedHashMap<>();
        for (Object[] r : repo.countByGroup()) bg.put((String)r[0],(Long)r[1]);
        m.put("byBloodGroup", bg);
        return m;
    }

    @GetMapping("/blood-group/{bg}")
    public List<Donor> byBG(@PathVariable String bg) { return repo.findByBloodGroup(bg); }

    @GetMapping("/eligible")
    public List<Donor> eligible() { return repo.findByIsEligible(true); }
}
