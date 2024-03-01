package com.example.Board.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;
import com.example.Board.repositories.MemberRepository;

@SpringBootTest
public class MemberServiceTest extends InitializeDBTest {

    @Autowired
    MemberRepository memberRepository;
    @Autowired
    MemberService memberService;
    @Autowired
    PasswordEncoder passwordEncoder;

    private String name = "name";
    private String password = "password";
    private Member member;

    @BeforeEach
    void beforeEach() {
        member = memberRepository.save(new Member(name, "email@abc.com", passwordEncoder.encode(password)));
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void signUp() {
        String newName = "newName";
        String newEmail = "newEmail@test.com";
        Member newMember = new Member(newName, newEmail, password);

        assertThat(memberRepository.findAll().size()).isEqualTo(1);

        memberService.signUp(newMember);

        assertThat(memberRepository.findAll().size()).isEqualTo(2);

        Member testMember = memberRepository.findByEmail("newEmail@test.com").get();

        assertThat(testMember.getName()).isEqualTo(newName);
        assertThat(testMember.getEmail()).isEqualTo(newEmail);
        assertThat(testMember.getStatus()).isEqualTo(MemberStatus.ACTIVE);
        assertThat(testMember.getCreateDate()).isEqualTo(testMember.getUpdateDate());
    }

    @Test
    public void checkPassword() {
        assertThat(memberService.checkPassword(member.getId(), password)).isTrue();
    }

    @Test
    public void checkPasswordWrongData() {
        assertThat(memberService.checkPassword(member.getId(), "wrongPwd")).isFalse();
        assertThat(memberService.checkPassword(-1l, password)).isFalse();
    }

    @Test
    public void updateMember() {
        String updatedName = "updated name";
        Member testMember = memberRepository.findById(member.getId()).get();
        LocalDateTime beforeUpdateTime = testMember.getUpdateDate();

        assertThat(testMember.getName()).as(name);

        boolean isSuccessful = memberService.updateMember(member.getId(), updatedName);
        testMember = memberRepository.findById(member.getId()).get();
        LocalDateTime afterUpdateTime = testMember.getUpdateDate();

        assertThat(isSuccessful).isTrue();
        assertThat(testMember.getName()).as(updatedName);
        assertThat(ChronoUnit.MILLIS.between(beforeUpdateTime, afterUpdateTime)).isGreaterThan(0);
    }

    @Test
    public void leave() {
        Member mem = memberRepository.findById(member.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
        assertThat(memberService.leave(member.getId(), password)).isTrue();

        mem = memberRepository.findById(member.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.LEAVE);
    }

    @Test
    public void leaveWrongPassword() {
        assertThat(memberService.leave(member.getId(), "wrongPwd")).isFalse();

        Member mem = memberRepository.findById(member.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void leaveWrongId() {
        assertThat(memberService.leave(-1, password)).isFalse();

        Member mem = memberRepository.findById(member.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }
}
