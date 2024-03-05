package com.example.Board.modal.responses;

import com.example.Board.domains.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {

    private long id;
    private String title;
    private String content;

    public BoardResponse(Board board) {
        id = board.getId();
        title = board.getTitle();
        content = board.getContent();
    }

    @Override
    public String toString() {
        return String.format("아이디 %d, 제목 %s", id, title);
    }
}
