package com.example.Board.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.domains.Member;
import com.example.Board.modal.requests.MemberAddRequest;
import com.example.Board.modal.responses.MemberRespons;
import com.example.Board.repositories.MemberRepository;

@RestController
public class MemberController {
	private static Logger log = LoggerFactory.getLogger(MemberController.class);
	
	@Autowired private MemberRepository memberRepository;
	
	@GetMapping("/mem/{id}")
    public MemberRespons findMember(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);
		
        return memberRepository.getReferenceById(id).getMemberRespons();
    }
	
	@PostMapping("/mem")
	public void addMember(@RequestBody MemberAddRequest req) {
		log.info("Member data : " + req);
		
		memberRepository.save(req.getMember());
	}
}
