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
import com.example.Board.domains.MemberStatus;
import com.example.Board.modal.requests.MemberToEmailRequest;
import com.example.Board.modal.requests.MemberToIdRequest;
import com.example.Board.modal.requests.SignUpRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.modal.responses.SignInResponse;
import com.example.Board.repositories.MemberRepository;
import com.example.Board.services.MemberService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MemberControllerTest extends InitializeDBTest {

    @Autowired
    MemberService memberService;
    @Autowired
    MemberRepository memberRepository;
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
    public void signIn() {
        MemberToEmailRequest memberReq = new MemberToEmailRequest(member.getEmail(), password);
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void signIn_whenLeaveMember() {
        Member mem = memberRepository.findByEmail(member.getEmail()).get();
        mem.setStatus(MemberStatus.LEAVE);

        memberRepository.save(mem);

        MemberToEmailRequest memberReq = new MemberToEmailRequest(member.getEmail(), password);
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(memberRepository.findByEmail(member.getEmail()).get().getStatus()).isEqualTo(MemberStatus.LEAVE);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void signIn_whenWrongPassword() {
        MemberToEmailRequest memberReq = new MemberToEmailRequest(member.getEmail(), "wrongPassword");
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void signIn_whenWrongEmail() {
        MemberToEmailRequest memberReq = new MemberToEmailRequest("wrongEmail@abc.com", "password");
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void signUp() {
        SignUpRequest addSuccessReq = new SignUpRequest("newName", "newemail@abc.com", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().getName()).isEqualTo("newName");
        assertThat(responseEntity.getBody().getEmail()).isEqualTo("newemail@abc.com");

        Member testMember = memberRepository.findByEmail(responseEntity.getBody().getEmail()).get();

        assertThat(testMember.getStatus()).isEqualTo(MemberStatus.ACTIVE);
    }

    @Test
    public void signUp_whenSameEmail() {
        SignUpRequest addSuccessReq = new SignUpRequest("name", "email@abc.com", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("중복");
    }

    @Test
    public void signUp_whenWrongName() {
        SignUpRequest addSuccessReq = new SignUpRequest("", "newemail@abc.com", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("실패");
    }

    @Test
    public void signUp_whenWrongEmail() {
        SignUpRequest addSuccessReq = new SignUpRequest("newName", "wrongFormatEmail", "newPassword");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("실패");
    }

    @Test
    public void signUp_whenWrongPassword() {
        SignUpRequest addSuccessReq = new SignUpRequest("newName", "newemail@abc.com", "short");
        String url = String.format("http://localhost:%d/sign-up", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, addSuccessReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("실패");
    }

    @Test
    public void findMember() {
        memberService.signIn(member.getEmail(), password);

        String url = String.format("http://localhost:%d/mem/%d", serverPort, member.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
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

    @Test
    public void verifyIdentity() {
        memberService.signIn(member.getEmail(), password);

        MemberToIdRequest req = new MemberToIdRequest(member.getId(), password);

        String url = String.format("http://localhost:%d/my/check", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isTrue();
    }

    @Test
    public void verifyIdentity_whenWrongId() {
        memberService.signIn(member.getEmail(), password);

        MemberToIdRequest req = new MemberToIdRequest(-1l, password);

        String url = String.format("http://localhost:%d/my/check", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }

    @Test
    public void verifyIdentity_whenWrongPassword() {
        memberService.signIn(member.getEmail(), password);

        MemberToIdRequest req = new MemberToIdRequest(member.getId(), "wrongPassword");

        String url = String.format("http://localhost:%d/my/check", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(req, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }
}
