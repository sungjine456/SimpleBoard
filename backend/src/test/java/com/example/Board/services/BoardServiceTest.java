package com.example.Board.services;

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
import com.example.Board.repositories.BoardRepository;
import com.example.Board.repositories.MemberRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
public class BoardServiceTest extends InitializeDBTest {

    @Autowired
    BoardService boardService;
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    MemberRepository memberRepository;

    private String name = "name";
    private String email = "email@abc.com";
    private Member member = new Member(name, email, "password");

    @BeforeEach
    void beforeEach() {
        member = memberRepository.save(member);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    @Transactional
    public void write() {
        assertThat(boardRepository.findAll().size()).isZero();

        String title = "title";
        String content = "content";

        boardService.write(member.getId(), title, content);

        List<Board> boards = boardRepository.findAll();

        assertThat(boards.size()).isOne();

        Board board = boards.get(0);

        assertThat(board.getTitle()).isEqualTo(title);
        assertThat(board.getContent()).isEqualTo(content);
        assertThat(board.getMember().getName()).isEqualTo(name);
        assertThat(board.getMember().getEmail()).isEqualTo(email);
        assertThat(board.getCreateDate()).isEqualTo(board.getUpdateDate());
    }
}
