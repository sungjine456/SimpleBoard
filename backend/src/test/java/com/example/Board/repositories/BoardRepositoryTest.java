package com.example.Board.repositories;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.domains.Board;

import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
public class BoardRepositoryTest extends InitializeRepositoryTest {

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
        boardRepository.save(new Board(testTitle, testContent, initMember));
    }

    @Test
    @Transactional
    public void save() {
        List<Board> boards = boardRepository.findAll();
        assertThat(boards.size()).isEqualTo(12);

        String title = "title";
        String content = "content";

        Board board = new Board(title, content, initMember);
        boardRepository.save(board);

        boards = boardRepository.findAll();
        assertThat(boards.size()).isEqualTo(13);

        Board findBoard = boards.get(12);
        assertThat(findBoard.getTitle()).isEqualTo(title);
        assertThat(findBoard.getContent()).isEqualTo(content);
        assertThat(findBoard.getCreateDate()).isEqualTo(findBoard.getUpdateDate());
        assertThat(findBoard.getMember().getEmail()).isEqualTo(initEmail);
    }

    @Test
    public void findByIdAndMemberId() {
        Board board = boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
    }

    @Test
    public void findByIdAndMemberId_wrongData() {
        assertThat(boardRepository.findByIdAndMemberId(99999, initMember.getId())).isEmpty();
        assertThat(boardRepository.findByIdAndMemberId(testBoard.getId(), 99999)).isEmpty();
    }

    @Test
    public void findByIdAndMemberEmail() {
        Board board = boardRepository.findByIdAndMemberEmail(testBoard.getId(), initMember.getEmail()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
    }

    @Test
    public void findByIdAndMemberEmail_wrongData() {
        assertThat(boardRepository.findByIdAndMemberEmail(99999, initMember.getEmail())).isEmpty();
        assertThat(boardRepository.findByIdAndMemberEmail(testBoard.getId(), "")).isEmpty();
    }

    @Test
    @Transactional
    public void update() {
        String updateTitle = "updateTitle";
        String updateContent = "updateContent";

        Board board = boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(testTitle);
        assertThat(board.getContent()).isEqualTo(testContent);
        assertThat(board.getCreateDate()).isEqualTo(board.getUpdateDate());

        boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).map(b -> {
            b.setTitle(updateTitle);
            b.setContent(updateContent);

            return b;
        });

        board = boardRepository.findByIdAndMemberId(testBoard.getId(), initMember.getId()).get();

        assertThat(board.getTitle()).isEqualTo(updateTitle);
        assertThat(board.getContent()).isEqualTo(updateContent);
        assertThat(board.getCreateDate()).isNotEqualTo(board.getUpdateDate());
    }

    @Test
    public void findAll() {
        Pageable pageable = PageRequest.of(0, 10);

        List<Board> list = boardRepository.findAll();
        Page<Board> paging = boardRepository.findAll(pageable);

        assertThat(list.size()).isEqualTo(12);
        assertThat(paging.getSize()).isEqualTo(10);
        assertThat(paging.getTotalPages()).isEqualTo(2);
        assertThat(paging.getTotalElements()).isEqualTo(12);
    }
}
