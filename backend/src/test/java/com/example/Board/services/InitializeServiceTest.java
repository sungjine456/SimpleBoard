package com.example.Board.services;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;
import com.example.Board.repositories.MemberRepository;

public class InitializeServiceTest extends InitializeDBTest {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    protected MemberRepository memberRepository;
    @Autowired
    protected MemberService memberService;

    protected String initName = "name";
    protected String initEmail = "test@abc.com";
    protected String initPassword = "password";
    protected Member initMember;

    @BeforeEach
    protected void beforeEach() {
        initMember = memberRepository.save(new Member(initName, initEmail, passwordEncoder.encode(initPassword)));
    }
}
