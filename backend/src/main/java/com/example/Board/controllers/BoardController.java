package com.example.Board.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.modal.requests.boards.BoardRequest;
import com.example.Board.services.BoardService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class BoardController {

    @Autowired
    private BoardService boardService;

    @PostMapping("/board")
    public ResponseEntity<Boolean> write(@RequestBody BoardRequest req) {
        log.info("write request {} ", req);

        if (!StringUtils.hasText(req.getTitle()) && !StringUtils.hasText(req.getContent())) {
            return ResponseEntity.ok(false);
        }

        boardService.write(req.getMemberId(), req.getTitle(), req.getContent());

        return ResponseEntity.ok(true);
    }

    @PostMapping("/board/{id}")
    public ResponseEntity<Boolean> update(@RequestBody BoardRequest req, @PathVariable("id") Long id) {
        log.info("update request {} ", req);

        if (!StringUtils.hasText(req.getTitle()) && !StringUtils.hasText(req.getContent())) {
            return ResponseEntity.ok(false);
        }

        boolean succeded = boardService.update(id, req.getMemberId(), req.getTitle(), req.getContent());

        return ResponseEntity.ok(succeded);
    }
}
