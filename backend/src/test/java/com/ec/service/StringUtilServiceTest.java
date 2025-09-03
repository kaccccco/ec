package com.ec.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 字符串工具服务测试类
 */
@SpringBootTest
public class StringUtilServiceTest {
    
    private StringUtilService stringUtilService;
    
    @BeforeEach
    void setUp() {
        stringUtilService = new StringUtilService();
    }
    
    /**
     * 测试基础字符串拆分功能
     */
    @Test
    void testBasicSplit() {
        System.out.println("=== 基础字符串拆分测试 ===");
        
        // 测试用例1：图片示例
        String str1 = "Elle Girl aa8B ElleGirl ccddelliegirLEF";
        String str2 = "Elle Girl";
        List<String> result1 = stringUtilService.splitString(str1, str2);
        
        System.out.println("测试用例1:");
        System.out.println("输入: " + str1);
        System.out.println("分隔符: " + str2);
        System.out.println("结果: " + result1);
        System.out.println("期望: [aa8B, ccddelliegirLEF]");
        
        assertNotNull(result1);
        assertEquals(2, result1.size());
        assertTrue(result1.contains("aa8B"));
        assertTrue(result1.contains("ccddelliegirLEF"));
        
        // 测试用例2：简单拆分
        List<String> result2 = stringUtilService.splitString("apple,banana,orange", ",");
        System.out.println("\n测试用例2:");
        System.out.println("输入: apple,banana,orange");
        System.out.println("分隔符: ,");
        System.out.println("结果: " + result2);
        
        assertEquals(3, result2.size());
        assertEquals("apple", result2.get(0));
        assertEquals("banana", result2.get(1));
        assertEquals("orange", result2.get(2));
        
        // 测试用例3：空字符串处理
        List<String> result3 = stringUtilService.splitString("", "test");
        System.out.println("\n测试用例3:");
        System.out.println("输入: (空字符串)");
        System.out.println("分隔符: test");
        System.out.println("结果: " + result3);
        
        assertTrue(result3.isEmpty());
    }
    
    /**
     * 测试智能字符串拆分功能
     */
    @Test
    void testSmartSplit() {
        System.out.println("\n=== 智能字符串拆分测试 ===");
        
        // 测试用例1：不区分大小写
        List<String> result1 = stringUtilService.smartSplit(
            "Hello WORLD hello", "hello", false, false, -1);
        System.out.println("测试用例1 (不区分大小写):");
        System.out.println("结果: " + result1);
        
        assertNotNull(result1);
        assertTrue(result1.contains("WORLD"));
        
        // 测试用例2：区分大小写
        List<String> result2 = stringUtilService.smartSplit(
            "Hello WORLD hello", "hello", true, false, -1);
        System.out.println("\n测试用例2 (区分大小写):");
        System.out.println("结果: " + result2);
        
        assertNotNull(result2);
        assertTrue(result2.contains("Hello WORLD"));
        
        // 测试用例3：保留空字符串
        List<String> result3 = stringUtilService.smartSplit(
            "a,,b,c", ",", false, true, -1);
        System.out.println("\n测试用例3 (保留空字符串):");
        System.out.println("结果: " + result3);
        
        assertEquals(4, result3.size());
        assertEquals("a", result3.get(0));
        assertEquals("", result3.get(1));
        assertEquals("b", result3.get(2));
        assertEquals("c", result3.get(3));
        
        // 测试用例4：限制拆分次数
        List<String> result4 = stringUtilService.smartSplit(
            "a,b,c,d,e", ",", false, false, 2);
        System.out.println("\n测试用例4 (限制拆分次数):");
        System.out.println("结果: " + result4);
        
        assertEquals(3, result4.size());
        assertEquals("a", result4.get(0));
        assertEquals("b", result4.get(1));
        assertEquals("c,d,e", result4.get(2));
    }
    
    /**
     * 测试演示功能
     */
    @Test
    void testDemonstration() {
        System.out.println("\n=== 演示功能测试 ===");
        
        Map<String, Object> demo = stringUtilService.demonstrateStringSplit();
        
        assertNotNull(demo);
        assertTrue(demo.containsKey("原始字符串1"));
        assertTrue(demo.containsKey("原始字符串2"));
        assertTrue(demo.containsKey("拆分结果"));
        assertTrue(demo.containsKey("智能拆分结果"));
        
        System.out.println("演示结果: " + demo);
    }
}