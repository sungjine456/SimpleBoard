package com.example.Board;

import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;

public class InitializeDBTest {

    @Autowired
    DatabaseCleanUp databaseCleanUp;

    @AfterEach
    protected void afterEach() {
        System.err.println("InitializeDBTest.afterEach");
        databaseCleanUp.truncateAllEntity();
    }
}
