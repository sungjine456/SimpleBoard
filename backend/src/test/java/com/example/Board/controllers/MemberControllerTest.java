package com.example.Board.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;
import com.example.Board.modal.requests.members.MemberToEmailRequest;
import com.example.Board.modal.requests.members.SignUpRequest;
import com.example.Board.modal.responses.MemberResponse;
import com.example.Board.modal.responses.SignInResponse;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource("classpath:application-test.yml")
class MemberControllerTest extends InitializeControllerTest {

    @Test
    public void signIn() {
        MemberToEmailRequest memberReq = new MemberToEmailRequest(initMember.getEmail(), password);
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void signIn_whenLeaveMember() {
        Member mem = memberRepository.findByEmail(initMember.getEmail()).get();
        mem.setStatus(MemberStatus.LEAVE);

        memberRepository.save(mem);

        MemberToEmailRequest memberReq = new MemberToEmailRequest(initMember.getEmail(), password);
        String url = String.format("http://localhost:%d/sign-in", serverPort);

        ResponseEntity<SignInResponse> responseEntity = testRestTemplate.postForEntity(url, memberReq,
                SignInResponse.class);

        assertThat(memberRepository.findByEmail(initMember.getEmail()).get().getStatus()).isEqualTo(MemberStatus.LEAVE);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void signIn_whenWrongPassword() {
        MemberToEmailRequest memberReq = new MemberToEmailRequest(initMember.getEmail(), "wrongPassword");
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
        memberService.signIn(initMember.getEmail(), password);

        String url = String.format("http://localhost:%d/mem/%d", serverPort, initMember.getId());

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
        JwtToken jwtToken = memberService.signIn(initMember.getEmail(), password);

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
        memberService.signIn(initMember.getEmail(), password);

        String url = String.format("http://localhost:%d/my/check", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>(password, headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isTrue();
    }

    @Test
    public void verifyIdentity_whenWrongPassword() {
        memberService.signIn(initMember.getEmail(), password);

        String url = String.format("http://localhost:%d/my/check", serverPort);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Boolean> responseEntity = testRestTemplate.exchange(url, HttpMethod.POST,
                new HttpEntity<Object>("wrongPassword", headers), Boolean.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isFalse();
    }
}
