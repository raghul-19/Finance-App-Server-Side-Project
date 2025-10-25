package com.cipher.MoneyManagementSystem.Configurations;


import com.cipher.MoneyManagementSystem.Entity.ProfileEntity;
import com.cipher.MoneyManagementSystem.Service.Authentication.CustomUserDetailsService;
import com.cipher.MoneyManagementSystem.Service.Authentication.JwtTokenFilter;
import com.cipher.MoneyManagementSystem.Service.Authentication.JwtTokenUtil;
import com.cipher.MoneyManagementSystem.Service.Interface.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@EnableWebSecurity
@Configuration

public class WebConfigurations {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenFilter jwtFilter;

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return
                http
                        .cors(Customizer.withDefaults())
                        .csrf(csrf -> csrf.disable())
                        .authorizeHttpRequests(authz -> authz.requestMatchers("/profile/**","/api/auth/**","/files/**").permitAll()
                                .anyRequest().authenticated()
                        )
                        .oauth2Login(oauth2 ->
                                oauth2.successHandler((request, response,authentication) -> {
                                    if(authentication instanceof OAuth2AuthenticationToken oauthToken) {
                                        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                                        System.out.println(oAuth2User.toString());
                                        OAuth2AuthorizedClient auth2AuthorizedClient=authorizedClientService.loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(),oauthToken.getName());
                                        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
                                        String email="";
                                        String name="";
                                        String imageUrl="";
                                        if(registrationId.equals("google")) {
                                            email=oAuth2User.getAttribute("email");
                                            name=oAuth2User.getAttribute("name");
                                            imageUrl=oAuth2User.getAttribute("picture");
                                        } else if(registrationId.equals("github")) {
                                            name=oAuth2User.getAttribute("login");
                                            imageUrl=oAuth2User.getAttribute("avatar_url");
                                            String token=auth2AuthorizedClient.getAccessToken().getTokenValue();
                                            HttpHeaders headers=new HttpHeaders();
                                            headers.setBearerAuth(token);
                                            headers.set("Accept", "application/vnd.github.v3+json");
                                            HttpEntity<Void> entity=new HttpEntity<>(headers);
                                            RestTemplate restTemplate = new RestTemplate();
                                            ResponseEntity<List>emailResponse=restTemplate.exchange(
                                                    "https://api.github.com/user/emails",
                                                    HttpMethod.GET,
                                                    entity,
                                                    List.class
                                            );
                                            if(emailResponse==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Problem while extracting email from github");
                                            List<Map<String,Object>>emails=emailResponse.getBody();
                                            for(Map<String,Object> emailMap:emails) {
                                                if (Boolean.TRUE.equals(emailMap.get("primary")) && Boolean.TRUE.equals(emailMap.get("verified"))) {
                                                    email = emailMap.get("email").toString();
                                                }
                                            }

                                        }

                                        ProfileEntity profile = profileService.verifyUserExistence(email, name, imageUrl);
                                        String token = jwtTokenUtil.createJwtToken(email, name,"login");

                                        String redirectUrl = UriComponentsBuilder
                                                .fromUriString("http://localhost:5173/oauth-success")
                                                .queryParam("email", email)
                                                .queryParam("name", name)
                                                .queryParam("token", token)
                                                .build()
                                                .toUriString();
                                        response.sendRedirect(redirectUrl);
                                    } else {
                                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"authentication class mismatch");
                                    }
                                })
                                        .failureHandler((request,response,exception) -> {
                                            exception.printStackTrace();
                                            String redirectUrl=UriComponentsBuilder
                                                    .fromUriString("http://localhost:5173/login")
                                                    .queryParam("error",exception.getMessage())
                                                    .build()
                                                    .toUriString();
                                            response.sendRedirect(redirectUrl);
                                        })
                        )
                        .exceptionHandling(exception -> exception
                                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.FORBIDDEN))
                                .accessDeniedHandler((request,response,accessDeniedException) -> {
                                    response.setContentType("application/json");
                                    response.setStatus(HttpStatus.FORBIDDEN.value());
                                    response.getWriter().write("Either the endpoint is not existed or you are unauthorized");
                                })
                        )

                        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                        .formLogin(form -> form.disable())
                        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(getCorsConfiguration());
    }

    private UrlBasedCorsConfigurationSource getCorsConfiguration() {
        CorsConfiguration cors=new CorsConfiguration();
        cors.addAllowedOrigin("http://localhost:5173");
        cors.setAllowedMethods(List.of("*"));
        cors.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
        cors.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlCorsConfiguration=new UrlBasedCorsConfigurationSource();
        urlCorsConfiguration.registerCorsConfiguration("/**",cors);
        return urlCorsConfiguration;
    }
    @Bean
    public AuthenticationManager generateAuthenticationManager() {
        DaoAuthenticationProvider authenticationProvider=new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authenticationProvider);
    }


}
