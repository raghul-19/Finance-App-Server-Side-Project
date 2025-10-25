package com.cipher.MoneyManagementSystem.Service.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.websocket.Decoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service

public class JwtTokenUtil {
    private final String secretKey="aTxgY3MkWc1K4BXY5+OZqFf6MxQj1bUVk1n5HOdcQkE=";

    private Key generateSecretKey() {
        byte[] keyBytes= Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createJwtToken(String email, String name, String purpose) {
        Map<String,Object> claims=new HashMap<>();
        claims.put("name",name);
        int duration=0;
        long expiryTime=(purpose.equals("login"))?86400000:180000;
        return generateJwtToken(email,claims,expiryTime);
    }
    private String generateJwtToken(String email, Map<String,Object>claims, long expiryTime) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+expiryTime))
                .signWith(generateSecretKey())
                .compact();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(generateSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean checkTokenExpiration(String token) {
        Date expiryTime=extractClaims(token).getExpiration();
        return expiryTime.after(new Date());
    }

    public String extractEmailFromToken(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean validateToken(String email,String token) {
        return checkTokenExpiration(token) && extractClaims(token).getSubject().equals(email);
    }
}
