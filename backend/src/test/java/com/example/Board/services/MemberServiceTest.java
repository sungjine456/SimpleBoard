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
    public void signUp() {
        String newName = "newName";
        String newEmail = "newEmail@test.com";
        Member newMember = new Member(newName, newEmail, password);

        assertThat(memberRepository.findAll().size()).isEqualTo(1);

        memberService.signUp(newMember);

        assertThat(memberRepository.findAll().size()).isEqualTo(2);

        Optional<Member> testMember = memberRepository.findByEmail("newEmail@test.com");

        assertThat(testMember.get().getName()).isEqualTo(newName);
        assertThat(testMember.get().getEmail()).isEqualTo(newEmail);
        assertThat(testMember.get().getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void checkPassword() {
        assertThat(memberService.checkPassword(savedMember.getId(), password)).isTrue();
    }

    @Test
    public void checkPasswordWrongData() {
        assertThat(memberService.checkPassword(savedMember.getId(), "wrongPwd")).isFalse();
        assertThat(memberService.checkPassword(-1l, password)).isFalse();
    }

    @Test
    public void updateMember() {
        String updatedName = "updated name";
        Optional<Member> m = memberRepository.findById(member.getId());

        assertThat(m.get().getName()).as(name);

        boolean isSuccessful = memberService.updateMember(member.getId(), updatedName);
        m = memberRepository.findById(member.getId());

        assertThat(isSuccessful).isTrue();
        assertThat(m.get().getName()).as(updatedName);
    }

    @Test
    public void leave() {
        Optional<Member> mem = memberRepository.findById(savedMember.getId());

        assertThat(mem.get().getStatus()).isEqualTo(MemberStatus.ACTIVE);
        assertThat(memberService.leave(savedMember.getId(), password)).isTrue();

        mem = memberRepository.findById(savedMember.getId());

        assertThat(mem.get().getStatus()).isEqualTo(MemberStatus.LEAVE);
    }

    @Test
    public void leaveWrongPassword() {
        assertThat(memberService.leave(savedMember.getId(), "wrongPwd")).isFalse();

        Optional<Member> mem = memberRepository.findById(savedMember.getId());

        assertThat(mem.get().getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void leaveWrongId() {
        assertThat(memberService.leave(-1, password)).isFalse();

        Optional<Member> mem = memberRepository.findById(savedMember.getId());

        assertThat(mem.get().getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }
}
