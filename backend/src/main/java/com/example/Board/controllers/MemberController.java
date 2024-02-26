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
import com.example.Board.domains.MemberStatus;
import com.example.Board.modal.requests.MemberToEmailRequest;
import com.example.Board.modal.requests.MemberToIdRequest;
import com.example.Board.modal.requests.SignUpRequest;
import com.example.Board.modal.requests.UpdateRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.modal.responses.SignInResponse;
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
	public ResponseEntity<SignInResponse> signIn(@RequestBody MemberToEmailRequest req) {
		log.info("sign-in request {}", req);

		JwtToken jwtToken = memberService.signIn(req.getEmail(), req.getPassword());

		log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(),
				jwtToken.getRefreshToken());

		Optional<Member> member = memberRepository.findByEmail(req.getEmail())
				.filter(m -> m.getStatus() == MemberStatus.ACTIVE);

		if (member.isPresent()) {
			return ResponseEntity.ok(new SignInResponse(member.get(), jwtToken.getAccessToken()));
		} else {
			return ResponseEntity.badRequest().body(new SignInResponse("존재하지 않는 사용자입니다."));
		}
	}

	/*
	 * 가입 성공 시 로그인까지 된다
	 */
	@PostMapping("/sign-up")
	public ResponseEntity<SignInResponse> signUp(@RequestBody SignUpRequest req) {
		log.info("sign-up request : " + req);

		if (req.getName().equals("") || !checkPassword(req.getPassword()) || !isEmailFormat(req.getEmail())) {
			return ResponseEntity.badRequest().body(new SignInResponse("실패"));
		}

		Member mem = new Member(req.getName(), req.getEmail(), req.getPassword());
		Optional<SignInResponse> res = memberService.signUp(mem);

		if (res.isPresent()) {
			log.info("email = {}, tokenOrMsg = {} ", req.getEmail(), res.get().getToken());

			return ResponseEntity.ok(res.get());
		} else {
			return ResponseEntity.badRequest().body(new SignInResponse("중복"));
		}
	}

	@GetMapping("/mem/{id}")
	public ResponseEntity<MemberResponse> findMember(@PathVariable("id") Long id) {
		log.info("findMember 받은 아이디 : {} ", id);

		Optional<Member> member = memberService.getMemberById(id);

		if (member.isPresent()) {
			return ResponseEntity.ok(new MemberResponse(member.get(), "성공"));
		} else {
			return ResponseEntity.badRequest().body(wrongResponse);
		}
	}

	@PostMapping("checkEmail")
	public Boolean checkEmail(@RequestBody MemberToEmailRequest req) {
		log.info("checkEmail : {}", req.getEmail());

		return memberRepository.existsByEmail(req.getEmail());
	}

	@PostMapping("/my")
	public Boolean updateMember(@RequestBody UpdateRequest req) {
		log.info("updateMember : {}", req);

		return memberService.updateMember(req.getId(), req.getName());
	}

	@PostMapping("/my/check")
	public Boolean verifyIdentity(@RequestBody MemberToIdRequest req) {
		log.info("checkPassword : {}", req);

		return memberService.checkPassword(req.getId(), req.getPassword());
	}

	@PostMapping("/my/leave")
	public Boolean leave(@RequestBody MemberToIdRequest req) {
		log.info("leave : {}", req);

		return memberService.leave(req.getId(), req.getPassword());
	}

	private boolean checkPassword(String password) {
		return password.length() >= 8 && password.length() <= 15;
	}
}
