package com.example.Board.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.Board.domains.Board;
import com.example.Board.repositories.BoardRepository;
import com.example.Board.repositories.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private MemberRepository memberRepository;

    public boolean write(String email, String title, String content) {
        log.info("write = 사용자 이메일 : {}, 제목 : {}", email, title);

        if (!StringUtils.hasText(title) || !StringUtils.hasText(content)) {
            return false;
        }

        return memberRepository.findByEmail(email).map(member -> {
            return boardRepository.save(new Board(title, content, member));
        }).isPresent();
    }

    @Transactional
    public boolean update(long boardId, String email, String title, String content) {
        log.info("update = 글 아이디 : {}, 사용자 이메일 : {}, 제목 : {}", boardId, email, title);

        if (!StringUtils.hasText(title) || !StringUtils.hasText(content)) {
            return false;
        }

        return boardRepository.findByIdAndMemberEmail(boardId, email).map(board -> {
            board.setTitle(title);
            board.setContent(content);

            return board;
        }).isPresent();
    }

    public Page<Board> findBoards(int page, int count) {
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createDate"));

        return boardRepository.findAll(PageRequest.of(page, count, Sort.by(sorts)));
    }
}
