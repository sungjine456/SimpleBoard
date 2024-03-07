package com.example.Board.modal.requests.members;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {

    private String name;

    @Override
    public String toString() {
        return String.format("이름: %s", name);
    }
}
