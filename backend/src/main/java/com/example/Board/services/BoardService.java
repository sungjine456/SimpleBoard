package com.example.Board.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.Board.domains.Board;
import com.example.Board.repositories.BoardRepository;
import com.example.Board.repositories.MemberRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private MemberRepository memberRepository;

    public boolean write(long memberId, String title, String content) {
        log.info("사용자 아이디 {}, 제목 {}", memberId, title);

        if (!StringUtils.hasText(title) || !StringUtils.hasText(content)) {
            return false;
        }

        return memberRepository.findById(memberId).map(member -> {
            return boardRepository.save(new Board(title, content, member));
        }).isPresent();
    }
}
