package com.example.Board.modal.requests.members;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberToIdRequest {

	private long id;
	private String password;

	@Override
	public String toString() {
		return String.format("아이디 = %d, 비밀번호 = %s", id, password);
	}
}
