package com.example.Board.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Board;
import com.example.Board.domains.Member;

import jakarta.transaction.Transactional;

@SpringBootTest
public class BoardRepositoryTest extends InitializeDBTest {

    @Autowired
    MemberRepository memberRepository;
    @Autowired
    BoardRepository boardRepository;

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
    @Transactional
    public void save() {
        List<Board> boards = boardRepository.findAll();
        assertThat(boards.size()).isZero();

        String title = "title";
        String content = "content";

        Board board = new Board(title, content, member);
        boardRepository.save(board);

        boards = boardRepository.findAll();
        assertThat(boards.size()).isOne();

        Board findBoard = boards.get(0);
        assertThat(findBoard.getTitle()).isEqualTo(title);
        assertThat(findBoard.getContent()).isEqualTo(content);
        assertThat(findBoard.getCreateDate()).isEqualTo(findBoard.getUpdateDate());
        assertThat(findBoard.getMember().getEmail()).isEqualTo(testEmail);
    }
}
