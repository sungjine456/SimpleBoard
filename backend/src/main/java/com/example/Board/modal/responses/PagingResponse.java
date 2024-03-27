package com.example.Board.modal.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PagingResponse {

    private List<BoardResponse> boards;
    private int totalPage;
}
