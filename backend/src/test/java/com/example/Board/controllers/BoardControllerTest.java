package com.example.Board.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.domains.Board;
import com.example.Board.modal.requests.boards.BoardRequest;
import com.example.Board.modal.responses.BoardResponse;
import com.example.Board.modal.responses.PagingResponse;
import com.example.Board.repositories.BoardRepository;
import com.example.Board.services.BoardService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
class BoardControllerTest extends InitializeControllerTest {

    @Autowired
    BoardService boardService;
    @Autowired
    BoardRepository boardRepository;

    private String testTitle = "title";
    private String testContent = "content";
    private Board testBoard;

    @BeforeEach
    @Override
    protected void beforeEach() {
        super.beforeEach();

        testBoard = boardRepository.save(new Board(testTitle, testContent, initMember));
    }

    @Test
    public void write() {
        BoardRequest req = new BoardRequest("title", "content");

        String url = String.format("http://localhost:%d/board", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isTrue();
    }

    @Test
    public void update() {
        BoardRequest req = new BoardRequest("updateTitle", "updateContent");

        String url = String.format("http://localhost:%d/board/%d", serverPort, testBoard.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isTrue();
    }

    @Test
    public void update_wrongBoardId() {
        BoardRequest req = new BoardRequest("updateTitle", "updateContent");

        String url = String.format("http://localhost:%d/board/99999", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }

    @Test
    public void findBoard() {
        String url = String.format("http://localhost:%d/board/%d", serverPort, testBoard.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<BoardResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), BoardResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getId()).isEqualTo(testBoard.getId());
        assertThat(responseEntity.getBody().getTitle()).isEqualTo(testTitle);
        assertThat(responseEntity.getBody().getContent()).isEqualTo(testContent);
    }

    @Test
    public void findBoard_whenWrongId() {
        String url = String.format("http://localhost:%d/board/%d", serverPort, 99999);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<BoardResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), BoardResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).isNull();
    }

    @Test
    public void findBoards() {
        String url = String.format("http://localhost:%d/boards", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<PagingResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), PagingResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getBoards().size()).isOne();
        assertThat(responseEntity.getBody().getBoards().get(0).getId()).isEqualTo(testBoard.getId());
        assertThat(responseEntity.getBody().getBoards().get(0).getTitle()).isEqualTo(testTitle);
        assertThat(responseEntity.getBody().getBoards().get(0).getContent()).isEqualTo(testContent);
        assertThat(responseEntity.getBody().getTotalPage()).isEqualTo(1);
    }

    @Test
    public void findBoards_whenWrongPage() {
        String url = String.format("http://localhost:%d/boards?page=-1", serverPort, 99999);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<PagingResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), PagingResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody()).isNull();
    }
}
