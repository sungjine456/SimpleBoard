package com.example.Board.modal.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {

    private long memberId;
    private String title;
    private String content;

    @Override
    public String toString() {
        return String.format("사용자 아이디 %d, 제목 %s", memberId, title);
    }
}
