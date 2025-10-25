package com.cipher.MoneyManagementSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class MoneyManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneyManagementSystemApplication.class, args);
	}

}
