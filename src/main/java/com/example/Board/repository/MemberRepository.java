package com.example.Board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Board.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
