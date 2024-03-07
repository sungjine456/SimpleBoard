package com.example.Board.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Board.configs.jwt.JwtToken;
import com.example.Board.configs.jwt.JwtTokenProvider;
import com.example.Board.domains.Member;
import com.example.Board.domains.MemberStatus;
import com.example.Board.modal.responses.SignInResponse;
import com.example.Board.repositories.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public JwtToken signIn(String username, String password) {
        log.info("sign in username: {}, password {} ", username, password);

        return createJWTToken(username, password);
    }

    /*
     * @return response or none
     */
    @Transactional
    public Optional<SignInResponse> signUp(Member mem) {
        log.info("sign up member: {}", mem);

        if (!memberRepository.existsByEmail(mem.getEmail())) {
            String password = mem.getPassword();
            String encodedPassword = passwordEncoder.encode(password);

            mem.setPassword(encodedPassword);
            mem.addRole("USER");

            Member saveMember = memberRepository.save(mem);
            JwtToken token = createJWTToken(mem.getUsername(), password);

            return Optional.of(new SignInResponse(saveMember, token.getAccessToken()));
        } else {
            return Optional.empty();
        }
    }

    @Transactional
    public Boolean updateMember(String email, String name) {
        log.info("update member: email = {}, name = {}", email, name);

        return memberRepository.findByEmail(email).map(m -> {
            m.setName(name);
            return m;
        }).isPresent();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public boolean checkPassword(String email, String password) {
        log.info("check password: email = {}, password = {}", email, password);

        return memberRepository
                .findByEmail(email)
                .filter(m -> passwordEncoder.matches(password, m.getPassword()))
                .isPresent();
    }

    @Transactional
    public boolean leave(String email, String password) {
        log.info("leave: email = {}, password = {}", email, password);

        return memberRepository.findByEmail(email)
                .filter(m -> passwordEncoder.matches(password, m.getPassword()))
                .map(m -> {
                    m.setStatus(MemberStatus.LEAVE);
                    log.info("leave: {}", m.getStatus());
                    return m;
                }).isPresent();
    }

    private JwtToken createJWTToken(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        return jwtTokenProvider.generateToken(authentication);
    }
}
