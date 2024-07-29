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
     * Verifies whether the result of adding two integers is correct. It uses JUnit's
     * `assertEquals` method to compare the sum of 2 and 2 with an expected value of 4.
     * The test expects that the addition is correct, which means the actual result should
     * be equal to the expected result.
     */
    @Test
    public void addition_isCorrect() throws Exception {
        assertEquals(4, 2 + 2);
    }
}
