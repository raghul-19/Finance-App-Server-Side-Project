package com.cipher.MoneyManagementSystem.Configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration

public class FileConfiguration implements WebMvcConfigurer {

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String categoryPath=System.getProperty("user.dir")+"\\MoneyManagementSystem\\uploads\\categories\\";
        String expensePath=System.getProperty("user.dir")+"\\MoneyManagementSystem\\uploads\\expenses\\";
        String incomePath=System.getProperty("user.dir")+"\\MoneyManagementSystem\\uploads\\incomes\\";


        registry.addResourceHandler("/files/categories/**")
                .addResourceLocations("file:"+categoryPath);

        registry.addResourceHandler("/files/expenses/**")
                .addResourceLocations("file:"+expensePath);

        registry.addResourceHandler("/files/incomes/**")
                .addResourceLocations("file:"+incomePath);


    }
}
