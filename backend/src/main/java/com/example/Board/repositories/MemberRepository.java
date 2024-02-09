package com.example.Board.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Board.domains.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    @Query(value = "select id from member where email = ?1 and password = ?2", nativeQuery = true)
    String loginCheck(String email, String password);

    Boolean existsByEmail(String email);
}
