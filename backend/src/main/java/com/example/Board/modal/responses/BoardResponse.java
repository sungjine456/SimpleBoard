package com.example.Board.modal.responses;

import java.time.LocalDateTime;

import com.example.Board.domains.Board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {

    private long id;
    private long memberId;
    private String title;
    private String content;
    private String memberName;
    private LocalDateTime date;
    private boolean admin;

    public BoardResponse(Board board) {
        this(board, false);
    }

    public BoardResponse(Board board, boolean admin) {
        id = board.getId();
        memberId = board.getMember().getId();
        title = board.getTitle();
        content = board.getContent();
        memberName = board.getMember().getName();
        date = board.getCreateDate();
        this.admin = admin;
    }

    @Override
    public String toString() {
        return String.format("아이디 %d, 작성자 아이디 %d, 제목 %s", id, memberId, title);
    }
}
