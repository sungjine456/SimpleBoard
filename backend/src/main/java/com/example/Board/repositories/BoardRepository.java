package com.example.Board.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Board.domains.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

}
