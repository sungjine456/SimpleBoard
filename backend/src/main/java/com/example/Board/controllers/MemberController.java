package com.example.Board.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.domains.Member;
import com.example.Board.modal.requests.MemberAddRequest;
import com.example.Board.modal.requests.MemberRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.services.MemberService;

@RestController
public class MemberController {
	private static Logger log = LoggerFactory.getLogger(MemberController.class);

	@Autowired
	private MemberService memberService;

	@PostMapping("/sign-in")
	public JwtToken signIn(@RequestBody MemberRequest req) {
		String username = req.getEmail();
		String password = req.getPassword();
		JwtToken jwtToken = memberService.signIn(username, password);

		log.info("request username = {}, password = {}", username, password);
		log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());

		return jwtToken;
	}

	@PostMapping("/sign-up")
	public ResponseEntity<MemberResponse> signUp(@RequestBody MemberAddRequest req) {
		log.info("sign up data : " + req);

		Member mem = new Member(req.getName(), req.getEmail(), req.getPassword());

		return ResponseEntity.ok(memberService.signUp(mem));
	}

	@GetMapping("/mem/{id}")
	public MemberResponse findMember(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);

		return memberService.getMemberById(id).getMemberRespons();
	}

	@PostMapping("/test")
	public String test() {
		return "success";
	}
}
