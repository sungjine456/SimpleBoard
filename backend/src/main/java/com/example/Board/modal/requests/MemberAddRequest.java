package com.example.Board.modal.requests;

import com.example.Board.domains.Member;

public class MemberAddRequest {
    private String name;
    private String email;
    private String password;
    
    public MemberAddRequest() { }

    public MemberAddRequest(String name, String email, String password) {
    	this.name = name;
    	this.email = email;
    	this.password = password;
    }
    
    public Member getMember() {
    	return new Member(name, email, password);
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
