package com.example.Board.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.modal.requests.MemberAddRequest;
import com.example.Board.modal.requests.MemberRequest;
import com.example.Board.modal.responses.MemberRespons;
import com.example.Board.services.MemberService;

@RestController
public class MemberController {
	private static Logger log = LoggerFactory.getLogger(MemberController.class);

	@Autowired private MemberService memberService;
	
	@PostMapping("/login")
	public boolean login(@RequestBody MemberRequest req) {
		log.info("login request : " + req);
		
		return memberService.loginCheck(req.getEmail(), req.getPassword());
	}
	
	@GetMapping("/mem/{id}")
    public MemberRespons findMember(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);
		
        return memberService.getMemberById(id).getMemberRespons();
    }
	
	@PostMapping("/mem")
	public void addMember(@RequestBody MemberAddRequest req) {
		log.info("member data : " + req);
		
		memberService.signin(req.getMember());
	}
}
