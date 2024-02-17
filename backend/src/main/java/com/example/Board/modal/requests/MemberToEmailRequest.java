package com.example.Board.modal.requests;

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
		return String.format("email = %s, password = %s", email, password);
	}
}
