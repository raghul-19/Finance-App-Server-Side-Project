package com.cipher.MoneyManagementSystem.Service.Authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service

public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil tokenUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       String header=request.getHeader("Authorization");
       String token=null;
       String email=null;
       if(header!=null && header.startsWith("Bearer ")) {
           token=header.substring(7);
           email=tokenUtil.extractEmailFromToken(token);
       }
       if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null) {
           if(tokenUtil.validateToken(email,token)) {
               UserDetails userDetails=userDetailsService.loadUserByUsername(email);
               UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(
                       userDetails,
                       null,
                       userDetails.getAuthorities()
               );
               authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
               SecurityContextHolder.getContext().setAuthentication(authenticationToken);
           }
       }
       filterChain.doFilter(request,response);
    }
}
