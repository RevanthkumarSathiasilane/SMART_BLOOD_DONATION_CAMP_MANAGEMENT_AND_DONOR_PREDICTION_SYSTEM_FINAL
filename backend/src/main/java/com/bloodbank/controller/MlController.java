package com.bloodbank.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController @RequestMapping("/api/ml")
public class MlController {
    @Value("${ml.service.url}") private String mlUrl;
    private final RestTemplate rest = new RestTemplate();

    @PostMapping("/predict-donor")
    public ResponseEntity<?> donor(@RequestBody Map<String,Object> b) {
        try { return rest.postForEntity(mlUrl+"/predict-donor", b, Map.class); }
        catch(Exception e) { return ResponseEntity.status(503).body(Map.of("error","ML service not running. Start it first.")); }
    }
    @PostMapping("/predict-stock")
    public ResponseEntity<?> stock(@RequestBody Map<String,Object> b) {
        try { return rest.postForEntity(mlUrl+"/predict-stock", b, Map.class); }
        catch(Exception e) { return ResponseEntity.status(503).body(Map.of("error","ML service not running.")); }
    }
    @PostMapping("/recommend-location")
    public ResponseEntity<?> loc(@RequestBody Map<String,Object> b) {
        try { return rest.postForEntity(mlUrl+"/recommend-location", b, Map.class); }
        catch(Exception e) { return ResponseEntity.status(503).body(Map.of("error","ML service not running.")); }
    }
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String,Object> b) {
        try { return rest.postForEntity(mlUrl+"/chat", b, Map.class); }
        catch(Exception e) { return ResponseEntity.status(503).body(Map.of("reply","ML chat service not running. Start FastAPI first.","source","error")); }
    }
}
