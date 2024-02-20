package com.example.Board.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;
import com.example.Board.repositories.MemberRepository;

@SpringBootTest
public class MemberServiceTest extends InitializeDBTest {
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    MemberService memberService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String name = "name";
    private String password = "password";
    private Member member = new Member(name, "email@abc.com");
    private Member savedMember;

    @BeforeEach
    void beforeEach() {
        member.setPassword(passwordEncoder.encode(password));
        savedMember = memberRepository.save(member);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void checkPassword() {
        assertThat(memberService.checkPassword(savedMember.getId(), password)).isTrue();
    }

    @Test
    public void checkPasswordWrongData() {
        String encodedPassword = passwordEncoder.encode(password);

        assertThat(memberService.checkPassword(savedMember.getId(), "wrongPwd")).isFalse();
        assertThat(memberService.checkPassword(-1l, encodedPassword)).isFalse();
    }

    @Test
    public void updateMember() {
        String updatedName = "updated name";
        Optional<Member> m = memberRepository.findById(member.getId());

        assertThat(m.isPresent()).isTrue();
        assertThat(m.get().getName()).as(name);

        boolean isSuccessful = memberService.updateMember(member.getId(), updatedName);
        m = memberRepository.findById(member.getId());

        assertThat(isSuccessful).isTrue();
        assertThat(m.isPresent()).isTrue();
        assertThat(m.get().getName()).as(updatedName);
    }
}
