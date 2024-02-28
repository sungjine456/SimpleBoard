package com.example.Board.utils;

import static com.example.Board.utils.Commons.isEmailFormat;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CommonsTest {

    @Test
    public void isEmailFormatTest() {
        assertThat(isEmailFormat("asdf")).isFalse();
        assertThat(isEmailFormat("asdf.com")).isFalse();
        assertThat(isEmailFormat("asdf@as")).isFalse();

        assertThat(isEmailFormat("wrongEmail@abc.com")).isTrue();
        assertThat(isEmailFormat("email@abc.com")).isTrue();
    }
}
