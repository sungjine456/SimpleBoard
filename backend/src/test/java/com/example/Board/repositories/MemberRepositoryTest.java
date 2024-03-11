package com.example.Board.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;

import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
public class MemberRepositoryTest extends InitializeRepositoryTest {

    @Test
    public void save() {
        LocalDateTime testTime = LocalDateTime.now();
        List<Member> members = memberRepository.findAll();

        assertThat(members.size()).isEqualTo(1);

        String testName = "test";
        String testPassword = "testPassword";
        String testEmail = "test@test.com";
        Member testMember = new Member(testName, testEmail, testPassword);

        memberRepository.save(testMember);

        members = memberRepository.findAll();

        assertThat(members.size()).isEqualTo(2);

        Member findMember = memberRepository.findByEmail(testEmail).get();

        assertThat(findMember.getName()).isEqualTo(testName);
        assertThat(findMember.getPassword()).isEqualTo(testPassword);
        assertThat(findMember.getStatus()).isEqualTo(MemberStatus.ACTIVE);
        assertThat(findMember.getCreateDate()).isEqualTo(findMember.getUpdateDate());
        assertThat(ChronoUnit.MILLIS.between(testTime, findMember.getCreateDate())).isGreaterThan(0);
    }

    @Test
    public void checkEmail() {
        assertThat(memberRepository.existsByEmail("")).isFalse();
        assertThat(memberRepository.existsByEmail("assdaxrl")).isFalse();
        assertThat(memberRepository.existsByEmail("assdax.rl")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.xrl")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.")).isFalse();
        assertThat(memberRepository.existsByEmail(initEmail)).isTrue();
    }

    @Test
    @Transactional
    public void updateStatus() {
        Member mem = memberRepository.findByEmail(initEmail).get();
        LocalDateTime testTime = LocalDateTime.now();

        assertThat(mem.getStatus()).isNotEqualTo(MemberStatus.LEAVE);
        assertThat(ChronoUnit.MILLIS.between(testTime, mem.getUpdateDate())).isLessThan(0);

        memberRepository.findById(mem.getId())
                .map(m -> {
                    m.setStatus(MemberStatus.LEAVE);
                    return m;
                });

        mem = memberRepository.findByEmail(initEmail).get();

        assertThat(mem.getStatus()).isEqualTo(MemberStatus.LEAVE);
        assertThat(ChronoUnit.MILLIS.between(testTime, mem.getUpdateDate())).isGreaterThan(0);
    }
}
