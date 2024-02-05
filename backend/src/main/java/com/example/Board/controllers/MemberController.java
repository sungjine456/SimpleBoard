package com.example.Board.controllers;

import static com.example.Board.utils.Commons.isEmailFormat;

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
	public ResponseEntity<String> signIn(@RequestBody MemberRequest req) {
		String email = req.getEmail();
		String password = req.getPassword();

		if (!checkPassword(password) && !isEmailFormat(email)) {
			return ResponseEntity.badRequest().body("올바르지 않은 로그인 형식입니다.");
		}

		JwtToken jwtToken = memberService.signIn(email, password);

		log.info("request email = {}, password = {}", email, password);
		log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());

		return ResponseEntity.ok(jwtToken.getAccessToken());
	}

	@PostMapping("/sign-up")
	public ResponseEntity<MemberResponse> signUp(@RequestBody MemberAddRequest req) {
		log.info("sign up data : " + req);

		if (!req.getName().equals("") && !checkPassword(req.getPassword()) && !isEmailFormat(req.getEmail())) {
			return ResponseEntity.badRequest().body(new MemberResponse(-1L, "", "", "올바르지 않은 로그인 형식입니다."));
		}

		Member mem = new Member(req.getName(), req.getEmail(), req.getPassword());

		return ResponseEntity.ok(memberService.signUp(mem));
	}

	@GetMapping("/mem/{id}")
	public MemberResponse findMember(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);

		return new MemberResponse(memberService.getMemberById(id), "성공");
	}

	private boolean checkPassword(String password) {
		return password.length() >= 8 && password.length() <= 15;
	}
}
