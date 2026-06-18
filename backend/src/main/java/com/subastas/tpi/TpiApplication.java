package com.subastas.tpi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TpiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TpiApplication.class, args);
	}

}
