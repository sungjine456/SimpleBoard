package com.example.Board.modal.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {

    private Long id;
    private String name;

    @Override
    public String toString() {
        return String.format("아이디: %d, 이름: %s", id, name);
    }
}
