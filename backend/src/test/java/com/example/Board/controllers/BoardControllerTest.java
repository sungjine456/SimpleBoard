package com.example.Board.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.example.Board.InitializeDBTest;
import com.example.Board.domains.Board;
import com.example.Board.domains.Member;
import com.example.Board.modal.requests.boards.BoardRequest;
import com.example.Board.repositories.BoardRepository;
import com.example.Board.services.BoardService;
import com.example.Board.services.MemberService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BoardControllerTest extends InitializeDBTest {

    @Autowired
    BoardService boardService;
    @Autowired
    BoardRepository boardRepository;
    @Autowired
    MemberService memberService;
    @Autowired
    TestRestTemplate testRestTemplate;
    @LocalServerPort
    int serverPort;

    private String token;
    private Member testMember = new Member("name", "email@abc.com", "password");

    private String testTitle = "title";
    private String testContent = "content";
    private Board testBoard;

    @BeforeEach
    void beforeEach() {
        token = memberService.signUp(testMember).map(r -> r.getToken()).get();
        testBoard = boardRepository.save(new Board(testTitle, testContent, testMember));
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void write() {
        BoardRequest req = new BoardRequest(testMember.getId(), "title", "content");

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
        BoardRequest req = new BoardRequest(testMember.getId(), "updateTitle", "updateContent");

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
    public void update_wrongMemberId() {
        BoardRequest req = new BoardRequest(9999999, "updateTitle", "updateContent");

        String url = String.format("http://localhost:%d/board/%d", serverPort, testBoard.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }

    @Test
    public void update_wrongBoardId() {
        BoardRequest req = new BoardRequest(testMember.getId(), "updateTitle", "updateContent");

        String url = String.format("http://localhost:%d/board/99999", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }
}
