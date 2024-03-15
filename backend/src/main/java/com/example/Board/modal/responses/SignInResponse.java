package com.example.Board.modal.responses;

import java.util.Date;

import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.domains.Member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {

    private Long id;
    private String name;
    private String email;
    private String token;
    private Date accessExpired;
    private Date refreshExpired;
    private String message;

    public SignInResponse(Member mem, JwtToken token) {
        this(mem.getId(), mem.getName(), mem.getEmail(), token.getAccessToken(), token.getAccessExpired(),
                token.getRefreshExpired(), "");
    }

    public SignInResponse(String message) {
        this(-1L, "", "", "", null, null, message);
    }
}
