package com.taskflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class TaskFlowApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext loads cleanly
    }
}
