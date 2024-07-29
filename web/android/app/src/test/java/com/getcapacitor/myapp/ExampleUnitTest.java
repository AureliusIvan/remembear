package com.getcapacitor.myapp;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * Example local unit test, which will execute on the development machine (host).
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
public class ExampleUnitTest {

    /**
     * Verifies whether the result of adding two numbers is correct. It uses the
     * `assertEquals` method to compare the expected output (4) with the actual output
     * (2 + 2). If the outputs match, the test passes; otherwise, it fails and reports
     * an error.
     */
    @Test
    public void addition_isCorrect() throws Exception {
        assertEquals(4, 2 + 2);
    }
}
