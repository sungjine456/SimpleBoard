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

import com.example.Board.DatabaseCleanUp;
import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.domains.Member;
import com.example.Board.modal.requests.MemberAddRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.services.MemberService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MemberControllerTest {

    @Autowired
    DatabaseCleanUp databaseCleanUp;
    @Autowired
    MemberService memberService;
    @Autowired
    TestRestTemplate testRestTemplate;
    @LocalServerPort
    int serverPort;

    private MemberAddRequest addSuccessReq;
    private String name = "name";
    private String email = "email@abc.com";
    private String password = "password";

    @BeforeEach
    void beforeEach() {
        addSuccessReq = new MemberAddRequest(name, email, password);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    // TODO: 로그인 테스트 필요
    // TODO: 실패하는 테스트 필요

    @Test
    public void signUpTest() {
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        MemberResponse res = responseEntity.getBody();
        assertThat(res.getName()).isEqualTo(addSuccessReq.getName());
        assertThat(res.getEmail()).isEqualTo(addSuccessReq.getEmail());
    }

    @Test
    public void findMemberTest() {
        MemberResponse mr = memberService.signUp(new Member(name, email, password));
        JwtToken jwtToken = memberService.signIn(email, password);

        String url = String.format("http://localhost:%d/mem/%d", serverPort, mr.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(jwtToken.getAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getName()).isEqualTo("name");
        assertThat(responseEntity.getBody().getEmail()).isEqualTo("email@abc.com");
    }
}
