package com.example.Board;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;
import org.springframework.util.StringUtils;

public class ExterneLibraryTest {

    @Test
    public void compareLocalDateTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime addTime = now.plus(5, ChronoUnit.MINUTES);
        LocalDateTime minusTime = now.minus(5, ChronoUnit.MINUTES);

        assertThat(ChronoUnit.MILLIS.between(now, addTime)).isEqualTo(5 * 60 * 1000);
        assertThat(ChronoUnit.MILLIS.between(now, minusTime)).isEqualTo(-5 * 60 * 1000);
        assertThat(ChronoUnit.MILLIS.between(minusTime, addTime)).isEqualTo(10 * 60 * 1000);
    }

    @Test
    public void StringUtils_hasText() {
        assertThat(StringUtils.hasText("null")).isTrue();
        assertThat(StringUtils.hasText("")).isFalse();
        assertThat(StringUtils.hasText("  ")).isFalse();
        assertThat(StringUtils.hasText(null)).isFalse();
    }
}
