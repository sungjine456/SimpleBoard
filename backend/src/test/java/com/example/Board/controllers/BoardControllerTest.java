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
import com.example.Board.domains.Member;
import com.example.Board.modal.requests.BoardRequest;
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
    private String password = "password";
    private Member member = new Member("name", "email@abc.com", password);

    @BeforeEach
    void beforeEach() {
        token = memberService.signUp(member).map(r -> r.getToken()).get();
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void write() {
        BoardRequest req = new BoardRequest(member.getId(), "title", "content");

        String url = String.format("http://localhost:%d/board", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isTrue();
    }
}
