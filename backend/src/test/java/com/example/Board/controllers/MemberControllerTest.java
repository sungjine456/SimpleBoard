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
import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.domains.Member;
import com.example.Board.modal.requests.MemberAddRequest;
import com.example.Board.modal.requests.MemberRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.services.MemberService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MemberControllerTest extends InitializeDBTest {

    @Autowired
    MemberService memberService;
    @Autowired
    TestRestTemplate testRestTemplate;
    @LocalServerPort
    int serverPort;

    private MemberResponse mr;
    private String password = "password";
    private Member member = new Member("name", "email@abc.com", password);

    @BeforeEach
    void beforeEach() {
        mr = memberService.signUp(member);
    }

    @AfterEach
    void afterEach() {
        databaseCleanUp.truncateAllEntity();
    }

    @Test
    public void signIn() {
        MemberRequest memberReq = new MemberRequest(member.getEmail(), password);
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<String> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void signIn_whenWrongPassword() {
        MemberRequest memberReq = new MemberRequest(member.getEmail(), "wrongPassword");
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<String> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void signIn_whenWrongEmail() {
        MemberRequest memberReq = new MemberRequest("wrongEmail@abc.com", "password");
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<String> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void signUp() {
        MemberAddRequest addSuccessReq = new MemberAddRequest("newName", "newemail@abc.com", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        MemberResponse res = responseEntity.getBody();
        assertThat(res.getName()).isEqualTo(addSuccessReq.getName());
        assertThat(res.getEmail()).isEqualTo(addSuccessReq.getEmail());
    }

    @Test
    public void signUp_whenWrongName() {
        MemberAddRequest addSuccessReq = new MemberAddRequest("", "newemail@abc.com", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        MemberResponse res = responseEntity.getBody();
        assertThat(res.getMessage()).isEqualTo("올바르지 않은 로그인 형식입니다.");
    }

    @Test
    public void signUp_whenWrongEmail() {
        MemberAddRequest addSuccessReq = new MemberAddRequest("newName", "wrongFormatEmail", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        MemberResponse res = responseEntity.getBody();
        assertThat(res.getMessage()).isEqualTo("올바르지 않은 로그인 형식입니다.");
    }

    @Test
    public void signUp_whenWrongPassword() {
        MemberAddRequest addSuccessReq = new MemberAddRequest("newName", "newemail@abc.com", "short");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        MemberResponse res = responseEntity.getBody();
        assertThat(res.getMessage()).isEqualTo("올바르지 않은 로그인 형식입니다.");
    }

    @Test
    public void findMember() {
        JwtToken jwtToken = memberService.signIn(member.getEmail(), password);

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

    @Test
    public void findMember_whenWrongId() {
        JwtToken jwtToken = memberService.signIn(member.getEmail(), password);

        String url = String.format("http://localhost:%d/mem/%d", serverPort, 0);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(jwtToken.getAccessToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<MemberResponse> responseEntity = testRestTemplate.exchange(url, HttpMethod.GET,
                new HttpEntity<Object>(headers), MemberResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
