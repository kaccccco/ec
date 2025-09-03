package com.ec.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 字符串工具服务单元测试（不依赖Spring上下文）
 */
public class StringUtilServiceUnitTest {
    
    private StringUtilService stringUtilService;
    
    @BeforeEach
    void setUp() {
        stringUtilService = new StringUtilService();
    }
    
    /**
     * 测试图片示例的字符串拆分
     */
    @Test
    void testImageExampleSplit() {
        String str1 = "Elle Girl aa8B ElleGirl ccddelliegirLEF";
        String str2 = "Elle Girl";
        
        List<String> result = stringUtilService.splitString(str1, str2);
        
        System.out.println("图片示例测试:");
        System.out.println("输入: " + str1);
        System.out.println("分隔符: " + str2);
        System.out.println("结果: " + result);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(6, result.size());
        assertEquals("Elle Girl", result.get(0));
        assertEquals("aa8B", result.get(1));
        assertEquals("ElleGirl", result.get(2));
        assertEquals("ccdd", result.get(3));
        assertEquals("ellegirl", result.get(4));
        assertEquals("LEF", result.get(5));
    }
    
    /**
     * 测试基础拆分功能
     */
    @Test
    void testBasicSplit() {
        // 测试简单拆分
        List<String> result = stringUtilService.splitString("apple,banana,orange", ",");
        
        System.out.println("基础拆分测试:");
        System.out.println("结果: " + result);
        
        assertNotNull(result);
        assertTrue(result.size() >= 3);
    }
    
    /**
     * 测试边界情况
     */
    @Test
    void testEdgeCases() {
        // 测试空字符串
        List<String> result1 = stringUtilService.splitString("", "test");
        assertTrue(result1.isEmpty());
        
        // 测试null输入
        List<String> result2 = stringUtilService.splitString(null, "test");
        assertTrue(result2.isEmpty());
        
        List<String> result3 = stringUtilService.splitString("test", null);
        assertTrue(result3.isEmpty());
    }
}