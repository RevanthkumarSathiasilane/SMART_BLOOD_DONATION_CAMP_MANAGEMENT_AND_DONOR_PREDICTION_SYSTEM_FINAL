package com.bloodbank.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MlController {

    @Value("${ml.service.url}")
    private String mlUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/predict-donor")
    public ResponseEntity<?> predictDonor(@RequestBody Map<String,Object> body) {
        return restTemplate.postForEntity(mlUrl + "/predict-donor", body, Map.class);
    }

    @PostMapping("/predict-stock")
    public ResponseEntity<?> predictStock(@RequestBody Map<String,Object> body) {
        return restTemplate.postForEntity(mlUrl + "/predict-stock", body, Map.class);
    }

    @PostMapping("/recommend-location")
    public ResponseEntity<?> recommendLocation(@RequestBody Map<String,Object> body) {
        return restTemplate.postForEntity(mlUrl + "/recommend-location", body, Map.class);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String,Object> body) {
        return restTemplate.postForEntity(mlUrl + "/chat", body, Map.class);
    }
}
