package com.example.Board.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
public class MemberServiceTest extends InitializeServiceTest {

    @Test
    public void signUp() {
        String newName = "newName";
        String newEmail = "newEmail@test.com";
        Member newMember = new Member(newName, newEmail, initPassword);

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
        assertThat(memberService.checkPassword(initMember.getEmail(), initPassword)).isTrue();
    }

    @Test
    public void checkPasswordWrongData() {
        assertThat(memberService.checkPassword(initMember.getEmail(), "wrongPwd")).isFalse();
        assertThat(memberService.checkPassword("", initPassword)).isFalse();
    }

    @Test
    public void updateMember() {
        String updatedName = "updated name";
        Member testMember = memberRepository.findById(initMember.getId()).get();
        LocalDateTime beforeUpdateTime = testMember.getUpdateDate();

        assertThat(testMember.getName()).as(initName);

        boolean isSuccessful = memberService.updateMember(initMember.getEmail(), updatedName);
        testMember = memberRepository.findById(initMember.getId()).get();
        LocalDateTime afterUpdateTime = testMember.getUpdateDate();

        assertThat(isSuccessful).isTrue();
        assertThat(testMember.getName()).as(updatedName);
        assertThat(ChronoUnit.MILLIS.between(beforeUpdateTime, afterUpdateTime)).isGreaterThan(0);
    }

    @Test
    public void leave() {
        Member mem = memberRepository.findById(initMember.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
        assertThat(memberService.leave(initMember.getEmail(), initPassword)).isTrue();

        mem = memberRepository.findById(initMember.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.LEAVE);
    }

    @Test
    public void leaveWrongPassword() {
        assertThat(memberService.leave(initMember.getEmail(), "wrongPwd")).isFalse();

        Member mem = memberRepository.findById(initMember.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void leaveWrongId() {
        assertThat(memberService.leave("", initPassword)).isFalse();

        Member mem = memberRepository.findById(initMember.getId()).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }
}
