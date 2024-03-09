package com.example.Board.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;
import com.example.Board.repositories.MemberRepository;
import com.example.Board.services.MemberService;

public class InitializeControllerTest extends InitializeDBTest {

    @Autowired
    protected MemberService memberService;
    @Autowired
    protected MemberRepository memberRepository;
    @Autowired
    protected TestRestTemplate testRestTemplate;
    @LocalServerPort
    protected int serverPort;

    protected String token;
    protected String password = "password";
    protected Member initMember = new Member("name", "email@abc.com", password);

    @BeforeEach
    protected void beforeEach() {
        token = memberService.signUp(initMember).map(r -> r.getToken()).get();
    }
}
