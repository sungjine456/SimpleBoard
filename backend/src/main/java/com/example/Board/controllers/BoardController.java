package com.example.Board.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Board.domains.Board;
import com.example.Board.modal.requests.boards.BoardRequest;
import com.example.Board.modal.responses.BoardResponse;
import com.example.Board.modal.responses.PagingResponse;
import com.example.Board.repositories.BoardRepository;
import com.example.Board.services.BoardService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class BoardController {

    @Autowired
    private BoardService boardService;
    @Autowired
    private BoardRepository boardRepository;

    @PostMapping("/board")
    public ResponseEntity<Boolean> write(@RequestBody BoardRequest req, Principal principal) {
        log.info("write 제목 : {}, 이메일 : {}", req.getTitle(), principal.getName());

        if (!StringUtils.hasText(req.getTitle()) && !StringUtils.hasText(req.getContent())) {
            return ResponseEntity.ok(false);
        }

        boardService.write(principal.getName(), req.getTitle(), req.getContent());

        return ResponseEntity.ok(true);
    }

    @GetMapping("/board/{id}")
    public ResponseEntity<BoardResponse> findBoard(@PathVariable("id") long id, Principal principal) {
        log.info("findBoard 글의 아이디 ", id);

        Optional<Board> board = boardRepository.findById(id);

        if (board.isPresent()) {
            if (principal == null) {
                return ResponseEntity.ok(new BoardResponse(board.get(), false));
            } else {
                return ResponseEntity
                        .ok(new BoardResponse(board.get(),
                                board.get().getMember().getEmail().equals(principal.getName())));
            }
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/board/{id}")
    public ResponseEntity<Boolean> update(@RequestBody BoardRequest req, @PathVariable("id") long id,
            Principal principal) {
        log.info("update = 제목 : {}, 이메일 : {}", req.getTitle(), principal.getName());

        if (!StringUtils.hasText(req.getTitle()) && !StringUtils.hasText(req.getContent())) {
            return ResponseEntity.ok(false);
        }

        boolean succeded = boardService.update(id, principal.getName(), req.getTitle(), req.getContent());

        return ResponseEntity.ok(succeded);
    }

    @GetMapping("/boards")
    public ResponseEntity<PagingResponse> findBoards(@RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "count", defaultValue = "10") int count) {
        log.info("findBoards = 페이지 : {}, 갯수 : {}", page, count);

        if (page < 0) {
            return ResponseEntity.badRequest().body(null);
        }

        Page<Board> paging = boardService.findBoards(page, count);
        List<BoardResponse> boards = paging.getContent().stream().map(b -> {
            return new BoardResponse(b);
        }).toList();

        return ResponseEntity.ok(new PagingResponse(boards, paging.getTotalPages()));
    }
}
