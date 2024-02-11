package com.example.Board.controllers;

import static com.example.Board.utils.Commons.isEmailFormat;

import java.util.Optional;

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
import com.example.Board.repositories.MemberRepository;
import com.example.Board.services.MemberService;

@RestController
public class MemberController {
	private static Logger log = LoggerFactory.getLogger(MemberController.class);

	@Autowired
	private MemberService memberService;
	@Autowired
	private MemberRepository memberRepository;

	private MemberResponse wrongResponse = new MemberResponse(-1L, "", "", "올바르지 않은 로그인 형식입니다.");

	@PostMapping("/sign-in")
	public ResponseEntity<String> signIn(@RequestBody MemberRequest req) {
		log.info("sign-in request {}", req);

		JwtToken jwtToken = memberService.signIn(req.getEmail(), req.getPassword());

		log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(),
				jwtToken.getRefreshToken());

		return ResponseEntity.ok(jwtToken.getAccessToken());
	}

	@PostMapping("/sign-up")
	public ResponseEntity<String> signUp(@RequestBody MemberAddRequest req) {
		log.info("sign-up request : " + req);

		if (req.getName().equals("") || !checkPassword(req.getPassword()) || !isEmailFormat(req.getEmail())) {
			return ResponseEntity.badRequest().body("실패");
		}

		Member mem = new Member(req.getName(), req.getEmail(), req.getPassword());

		String tokenOrMsg = memberService.signUp(mem).map(t -> t.getAccessToken()).orElse("중복");

		log.info("email = {}, tokenOrMsg = {} ", req.getEmail(), tokenOrMsg);

		return ResponseEntity.ok(tokenOrMsg);
	}

	@GetMapping("/mem/{id}")
	public ResponseEntity<MemberResponse> findMember(@PathVariable("id") Long id) {
		log.info("받은 아이디 : " + id);

		Optional<Member> member = memberService.getMemberById(id);

		if (member.isPresent()) {
			return ResponseEntity.ok(new MemberResponse(member.get(), "성공"));
		} else {
			return ResponseEntity.badRequest().body(wrongResponse);
		}
	}

	@PostMapping("checkEmail")
	public Boolean checkEmail(@RequestBody MemberRequest req) {
		log.info("checkEmail : {}", req.getEmail());

		return memberRepository.existsByEmail(req.getEmail());
	}

	private boolean checkPassword(String password) {
		return password.length() >= 8 && password.length() <= 15;
	}
}
