package com.example.Board.domains;

import java.util.Arrays;

public enum MemberStatus {
    ACTIVE(0),
    LEAVE(1);

    private int id;

    private MemberStatus(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static MemberStatus getStatus(int id) {
        return Arrays.stream(MemberStatus.values())
                .filter(status -> status.getId() == id)
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
