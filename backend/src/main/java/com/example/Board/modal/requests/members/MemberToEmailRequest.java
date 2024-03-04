package com.example.Board.modal.requests.members;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberToEmailRequest {

	private String email;
	private String password;

	@Override
	public String toString() {
		return String.format("이메일 = %s, 비밀번호 = %s", email, password);
	}
}
