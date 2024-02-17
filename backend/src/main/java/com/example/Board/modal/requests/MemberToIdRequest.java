package com.example.Board.modal.requests;

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
		return String.format("email = %d, password = %s", id, password);
	}
}
