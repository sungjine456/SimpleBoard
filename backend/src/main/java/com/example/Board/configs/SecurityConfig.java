package com.example.Board.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.Board.configs.jwt.JwtAuthenticationFilter;
import com.example.Board.configs.jwt.JwtTokenProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Bean
	SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.httpBasic(h -> h.disable())
				.csrf(c -> c.disable())
				.sessionManagement(m -> m.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(req -> req
						.requestMatchers("/sign-in", "/sign-up", "checkEmail").permitAll()
						.requestMatchers("/mem/**").hasRole("USER")
						.anyRequest()
						.authenticated())
				.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
						UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	@ConditionalOnProperty(name = "spring.h2.console.enabled", havingValue = "true")
	WebSecurityCustomizer configureH2ConsoleEnable() {
		return web -> web.ignoring()
				.requestMatchers(PathRequest.toH2Console());
	}
}
