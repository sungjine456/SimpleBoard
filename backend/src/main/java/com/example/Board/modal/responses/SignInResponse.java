package com.example.Board.modal.responses;

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
    private String message;

    public SignInResponse(Member mem, String token) {
        this(mem.getId(), mem.getName(), mem.getEmail(), token, "");
    }

    public SignInResponse(String message) {
        this(-1L, "", "", "", message);
    }
}
