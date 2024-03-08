package com.example.Board.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Board.domains.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

    Optional<Board> findByIdAndMemberId(long id, long memberId);

    Optional<Board> findByIdAndMemberEmail(long id, String email);
}
