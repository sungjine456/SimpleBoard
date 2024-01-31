package com.example.Board.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.repository.MemberRepository;

@RestController
public class MemberController {
	private static Logger log = LoggerFactory.getLogger(MemberController.class);
	
	@Autowired private MemberRepository memberRepository;
	
	@GetMapping("/mem/{id}")
    public String helloWorld(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);
		
        return memberRepository.getReferenceById(id).getName();
    }
}
