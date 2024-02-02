package com.example.Board.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.configs.jwt.JwtTokenProvider;
import com.example.Board.domains.Member;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.repositories.MemberRepository;

import jakarta.transaction.Transactional;

@Service
public class MemberService {
    private static Logger log = LoggerFactory.getLogger(MemberService.class);

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public JwtToken signIn(String username, String password) {
        log.info("sign in username: {}, password {} ", username, password);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        return jwtTokenProvider.generateToken(authentication);
    }

    @Transactional
    public MemberResponse signUp(Member mem) {
        log.info("sign up member: {}", mem.toString());

        String encodedPassword = passwordEncoder.encode(mem.getPassword());

        mem.setPassword(encodedPassword);
        mem.addRole("USER");

        return memberRepository.save(mem).toMemberResponse();
    }

    public Member getMemberById(Long id) {
        return memberRepository.getReferenceById(id);
    }
}
