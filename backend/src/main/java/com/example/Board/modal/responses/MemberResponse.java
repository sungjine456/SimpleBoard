package com.example.Board.modal.responses;

import com.example.Board.domains.Member;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponse {

	private Long id;
	private String name;
	private String email;
	private String message;

	public MemberResponse(Member mem, String message) {
		this(mem.getId(), mem.getName(), mem.getEmail(), message);
	}
}
