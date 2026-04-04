package com.bloodbank.controller;
import com.bloodbank.entity.Camp;
import com.bloodbank.repository.CampRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/coordinator")
public class CampController {
    @Autowired CampRepository repo;

    @GetMapping("/camps")     public List<Camp> all()       { return repo.findAll(); }
    @GetMapping("/camps/upcoming")  public List<Camp> upcoming()  { return repo.findByStatus("UPCOMING"); }
    @GetMapping("/camps/completed") public List<Camp> completed() { return repo.findByStatus("COMPLETED"); }

    @GetMapping("/camps/{id}")
    public ResponseEntity<Camp> byId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/camps")
    public Camp create(@RequestBody Camp c) { return repo.save(c); }

    @PutMapping("/camps/{id}")
    public ResponseEntity<Camp> update(@PathVariable Long id, @RequestBody Camp u) {
        return repo.findById(id).map(c -> {
            if(u.getName()!=null) c.setName(u.getName());
            if(u.getLocation()!=null) c.setLocation(u.getLocation());
            if(u.getCity()!=null) c.setCity(u.getCity());
            if(u.getCampDate()!=null) c.setCampDate(u.getCampDate());
            if(u.getStartTime()!=null) c.setStartTime(u.getStartTime());
            if(u.getEndTime()!=null) c.setEndTime(u.getEndTime());
            if(u.getAttendanceCount()!=null) c.setAttendanceCount(u.getAttendanceCount());
            if(u.getUnitsCollected()!=null) c.setUnitsCollected(u.getUnitsCollected());
            if(u.getStatus()!=null) c.setStatus(u.getStatus());
            return ResponseEntity.ok(repo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/camps/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("message","Camp deleted"));
    }

    @GetMapping("/stats")
    public Map<String,Object> stats() {
        Map<String,Object> m = new HashMap<>();
        m.put("total", repo.count());
        m.put("upcoming", repo.findByStatus("UPCOMING").size());
        m.put("completed", repo.findByStatus("COMPLETED").size());
        Double u = repo.totalUnits(); Long a = repo.totalAttendance();
        m.put("totalUnits", u!=null?u:0); m.put("totalAttendance", a!=null?a:0);
        return m;
    }
}
