package com.example.Board.modal.requests.boards;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {

    private String title;
    private String content;

    @Override
    public String toString() {
        return String.format("제목 %s", title);
    }
}
