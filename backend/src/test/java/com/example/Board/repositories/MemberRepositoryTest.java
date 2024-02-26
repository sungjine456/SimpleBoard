package com.example.Board.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;

import jakarta.transaction.Transactional;

@SpringBootTest
public class MemberRepositoryTest extends InitializeDBTest {

    @Autowired
    MemberRepository memberRepository;

    private String testName = "name";
    private String testPassword = "password";
    private String testEmail = "as@sda.xo";
    private Member member = new Member(testName, testEmail, testPassword);

    @BeforeEach
    void beforeEach() {
        memberRepository.save(member);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void save() {
        List<Member> members = memberRepository.findAll();

        assertThat(members.size()).isEqualTo(1);

        Member testMember = members.get(0);

        assertThat(testMember.getName()).isEqualTo(testName);
        assertThat(testMember.getEmail()).isEqualTo(testEmail);
        assertThat(testMember.getPassword()).isEqualTo(testPassword);
        assertThat(testMember.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void checkEmail() {
        assertThat(memberRepository.existsByEmail("as@sda.xrl")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.xo")).isTrue();
    }

    @Test
    @Transactional
    public void updateStatus() {
        Optional<Member> mem = memberRepository.findByEmail(testEmail);
        assertThat(mem.get().getStatus()).isNotEqualTo(MemberStatus.LEAVE);

        memberRepository.findById(mem.get().getId())
                .map(m -> {
                    m.setStatus(MemberStatus.LEAVE);
                    return m;
                });

        mem = memberRepository.findByEmail(testEmail);
        assertThat(mem.get().getStatus()).isEqualTo(MemberStatus.LEAVE);
    }
}
