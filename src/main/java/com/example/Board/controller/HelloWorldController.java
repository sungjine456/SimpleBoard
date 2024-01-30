package com.example.Board.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.domain.Member;
import com.example.Board.repository.MemberRepository;

@RestController
public class HelloWorldController {
	private static Logger log = LoggerFactory.getLogger(HelloWorldController.class);
	
	@Autowired private MemberRepository memberRepository;
	
	@GetMapping("/")
    public String helloWorld() {
        return "Hello World";
    }
	
	@GetMapping("/db")
    public String dbTest() {
		Member m = new Member("test");
		log.info(m.getName());
		
        memberRepository.save(m);
        
        return memberRepository.getReferenceById(1L).getName();
    }
}
