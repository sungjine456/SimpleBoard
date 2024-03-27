package com.example.Board.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.domains.Board;
import com.example.Board.repositories.BoardRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
public class BoardServiceTest extends InitializeServiceTest {

    @Autowired
    BoardService boardService;
    @Autowired
    BoardRepository boardRepository;

    private String testTitle = "testTitle";
    private String testContent = "testContent";
    private Board testBoard;

    @BeforeEach
    @Override
    protected void beforeEach() {
        super.beforeEach();

        testBoard = boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
        boardRepository.save(new Board(testTitle, testContent, initMember));
    }

    @Test
    @Transactional
    public void write() {
        assertThat(boardRepository.findAll().size()).isEqualTo(11);

        String title = "title";
        String content = "content";

        boardService.write(initMember.getEmail(), title, content);

        List<Board> boards = boardRepository.findAll();

        assertThat(boards.size()).isEqualTo(12);

        Board board = boards.get(11);

        assertThat(board.getTitle()).isEqualTo(title);
        assertThat(board.getContent()).isEqualTo(content);
        assertThat(board.getMember().getName()).isEqualTo(initName);
        assertThat(board.getMember().getEmail()).isEqualTo(initEmail);
        assertThat(board.getCreateDate()).isEqualTo(board.getUpdateDate());
    }

    @Test
    @Transactional
    public void update() {
        String updateTitle = "updateTitle";
        String updateContent = "updateContent";

        Board board = boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
        assertThat(board.getMember().getName()).isEqualTo(initName);
        assertThat(board.getMember().getEmail()).isEqualTo(initEmail);
        assertThat(board.getCreateDate()).isEqualTo(board.getUpdateDate());

        boolean succeded = boardService.update(testBoard.getId(), initEmail, updateTitle, updateContent);

        board = boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).get();

        assertThat(succeded).isTrue();
        assertThat(board.getTitle()).isEqualTo(updateTitle);
        assertThat(board.getContent()).isEqualTo(updateContent);
        assertThat(board.getMember().getName()).isEqualTo(initName);
        assertThat(board.getMember().getEmail()).isEqualTo(initEmail);
        assertThat(board.getCreateDate()).isNotEqualTo(board.getUpdateDate());
    }

    @Test
    public void update_whenWrongTitle() {
        boolean succeded = boardService.update(testBoard.getId(), initMember.getEmail(), null, "updateContent");

        assertThat(succeded).isFalse();
    }

    @Test
    public void update_whenEmptyContent() {
        boolean succeded = boardService.update(testBoard.getId(), initMember.getEmail(), "updateTitle", "");

        assertThat(succeded).isFalse();
    }

    @Test
    public void update_whenNullContent() {
        boolean succeded = boardService.update(testBoard.getId(), initMember.getEmail(), "updateTitle", null);

        assertThat(succeded).isFalse();
    }

    @Test
    public void findBoards() {
        Page<Board> paging = boardService.findBoards(0, 5);

        assertThat(paging.getSize()).isEqualTo(5);
        assertThat(paging.getTotalPages()).isEqualTo(3);
        assertThat(paging.getTotalElements()).isEqualTo(11);

        List<Board> boards = paging.getContent();

        assertThat(paging.getSize()).isEqualTo(boards.size());

        LocalDateTime date = boards.get(0).getCreateDate();

        for (int i = 1; i < boards.size(); i++) {
            assertThat(ChronoUnit.MILLIS.between(date, boards.get(i).getCreateDate())).isLessThanOrEqualTo(0);
            date = boards.get(i).getCreateDate();
        }
    }
}
