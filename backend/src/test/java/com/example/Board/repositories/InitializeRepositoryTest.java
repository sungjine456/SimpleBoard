package com.example.Board.repositories;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;

public class InitializeRepositoryTest extends InitializeDBTest {

    @Autowired
    protected MemberRepository memberRepository;

    protected String initName = "name";
    protected String initPassword = "password";
    protected String initEmail = "email@test.com";
    protected Member initMember = new Member(initName, initEmail, initPassword);

    @BeforeEach
    protected void beforeEach() {
        memberRepository.save(initMember);
    }
}
