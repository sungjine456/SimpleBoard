package com.example.Board.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Board.domains.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
