package com.bloodbank.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expiration}") private long expiration;

    private Key key() { return Keys.hmacShaKeyFor(secret.getBytes()); }

    public String generate(String username, String role) {
        return Jwts.builder()
            .setSubject(username).claim("role",role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis()+expiration))
            .signWith(key()).compact();
    }
    public String username(String t) { return claims(t).getSubject(); }
    public String role(String t)     { return (String) claims(t).get("role"); }
    public boolean valid(String t)   { try{claims(t);return true;}catch(Exception e){return false;} }
    private Claims claims(String t) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(t).getBody();
    }
}
