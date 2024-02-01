package com.example.Board.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Board.domains.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
	
    @Query(value = "select id from member where email = ?1 and password = ?2", nativeQuery = true)
    String loginCheck(String email, String password);
}
