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
    private Member testMember = new Member(testName, testEmail, testPassword);

    private String testTitle = "testTitle";
    private String testContent = "testContent";
    private Board testBoard;

    @BeforeEach
    void beforeEach() {
        testMember = memberRepository.save(testMember);
        testBoard = boardRepository.save(new Board(testTitle, testContent, testMember));
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    @Transactional
    public void save() {
        List<Board> boards = boardRepository.findAll();
        assertThat(boards.size()).isOne();

        String title = "title";
        String content = "content";

        Board board = new Board(title, content, testMember);
        boardRepository.save(board);

        boards = boardRepository.findAll();
        assertThat(boards.size()).isEqualTo(2);

        Board findBoard = boards.get(1);
        assertThat(findBoard.getTitle()).isEqualTo(title);
        assertThat(findBoard.getContent()).isEqualTo(content);
        assertThat(findBoard.getCreateDate()).isEqualTo(findBoard.getUpdateDate());
        assertThat(findBoard.getMember().getEmail()).isEqualTo(testEmail);
    }

    @Test
    public void findByIdAndMemberId() {
        Board board = boardRepository.findByIdAndMemberId(testBoard.getId(), testMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
    }

    @Test
    public void findByIdAndMemberId_wrongData() {
        assertThat(boardRepository.findByIdAndMemberId(99999, testMember.getId())).isEmpty();
        assertThat(boardRepository.findByIdAndMemberId(testBoard.getId(), 99999)).isEmpty();
    }

    @Test
    public void findByIdAndMemberEmail() {
        Board board = boardRepository.findByIdAndMemberEmail(testBoard.getId(), testMember.getEmail()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
    }

    @Test
    public void findByIdAndMemberEmail_wrongData() {
        assertThat(boardRepository.findByIdAndMemberEmail(99999, testMember.getEmail())).isEmpty();
        assertThat(boardRepository.findByIdAndMemberEmail(testBoard.getId(), "")).isEmpty();
    }

    @Test
    @Transactional
    public void update() {
        String updateTitle = "updateTitle";
        String updateContent = "updateContent";

        Board board = boardRepository.findByIdAndMemberId(testBoard.getId(), testMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
        assertThat(board.getCreateDate()).isEqualTo(board.getUpdateDate());

        boardRepository.findByIdAndMemberId(testBoard.getId(), testMember.getId()).map(b -> {
            b.setTitle(updateTitle);
            b.setContent(updateContent);

            return b;
        });

        board = boardRepository.findByIdAndMemberId(testBoard.getId(), testMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(updateTitle);
        assertThat(board.getContent()).isEqualTo(updateContent);
        assertThat(board.getCreateDate()).isNotEqualTo(board.getUpdateDate());
    }
}
