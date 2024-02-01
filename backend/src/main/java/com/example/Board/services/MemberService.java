package com.example.Board.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Board.domains.Member;
import com.example.Board.repositories.MemberRepository;

@Service
public class MemberService {
	private static Logger log = LoggerFactory.getLogger(MemberService.class);
	
	@Autowired private MemberRepository memberRepository;

    public boolean loginCheck(String email, String password) {
        log.info("execute MemberService loginCheck");
        
        if(email == null || email.equals("") || password == null || password.equals("")){
            return false;
        }

        String login = memberRepository.loginCheck(email, password);

        if(login == null){
            return false;
        }

        return true;
    }
    
    public Member getMemberById(Long id) {
    	return memberRepository.getReferenceById(id);
    }
    
    public void signin(Member mem) {
    	memberRepository.save(mem);
    }
}
