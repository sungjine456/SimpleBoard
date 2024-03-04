package com.example.Board.modal.requests.members;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {

	private String name;
	private String email;
	private String password;

	@Override
	public String toString() {
		return String.format("이름: %s, 이메일: %s", name, email);
	}
}
