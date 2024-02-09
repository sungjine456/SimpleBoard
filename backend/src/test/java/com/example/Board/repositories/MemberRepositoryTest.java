package com.example.Board.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Member;

@SpringBootTest
public class MemberRepositoryTest extends InitializeDBTest {

    @Autowired
    MemberRepository memberRepository;

    private String password = "password";
    private Member member = new Member("name", "as@sda.xo", password);

    @BeforeEach
    void beforeEach() {
        memberRepository.save(member);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void checkEmail() {
        assertThat(memberRepository.existsByEmail("as@sda.xrl")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.")).isFalse();
        assertThat(memberRepository.existsByEmail("as@sda.xo")).isTrue();
    }
}
