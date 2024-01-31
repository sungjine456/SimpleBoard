package com.example.Board.domains;

import com.example.Board.modal.responses.MemberRespons;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String email;
    
    @Column(nullable = false, length = 50)
    private String password;

	public Member() { }
	
	public Member(String name, String email) {
    	this.name = name;
    	this.email = email;
    }
    
    public Member(String name, String email, String password) {
    	this(name, email);
    	
    	this.password = password;
    }
    
    public MemberRespons getMemberRespons() {
    	return new MemberRespons(id, name, email);
    }
    
    public Long getId() {
    	return id;
    }
    public String getName() {
    	return name;
    }
    public void setName(String name) {
    	this.name = name;
    }
    public String getEmail() {
		return email;
	}
    public void setEmail(String email) {
		this.email = email;
	}
    public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	@Override
	public String toString() {
		return String.format("이름: %s, 이메일: %s", name, email);
	}
}
