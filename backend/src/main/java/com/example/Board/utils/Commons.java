package com.example.Board.utils;

import java.util.regex.Pattern;

public class Commons {
    public static boolean isEmailFormat(String email) {
        return Pattern.compile("^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$")
                .matcher(email).matches();
    }
}
