package com.ec.controller;

import com.ec.service.StringUtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 字符串工具控制器
 * 提供字符串拆分相关的API接口
 */
@RestController
@RequestMapping("/api/string")
@CrossOrigin(origins = "*")
public class StringUtilController {
    
    @Autowired
    private StringUtilService stringUtilService;
    
    /**
     * 基础字符串拆分接口
     * @param request 拆分请求参数
     * @return 拆分结果
     */
    @PostMapping("/split")
    public Map<String, Object> splitString(@RequestBody SplitRequest request) {
        List<String> result = stringUtilService.splitString(request.getStr1(), request.getStr2());
        return Map.of(
            "success", true,
            "data", result,
            "message", "字符串拆分成功"
        );
    }
    
    /**
     * 智能字符串拆分接口
     * @param request 智能拆分请求参数
     * @return 拆分结果
     */
    @PostMapping("/smart-split")
    public Map<String, Object> smartSplit(@RequestBody SmartSplitRequest request) {
        List<String> result = stringUtilService.smartSplit(
            request.getInput(),
            request.getPattern(),
            request.isCaseSensitive(),
            request.isKeepEmpty(),
            request.getMaxSplits()
        );
        
        return Map.of(
            "success", true,
            "data", result,
            "message", "智能字符串拆分成功"
        );
    }
    
    /**
     * 演示接口 - 展示图片中的示例
     * @return 演示结果
     */
    @GetMapping("/demo")
    public Map<String, Object> demonstrateStringSplit() {
        Map<String, Object> result = stringUtilService.demonstrateStringSplit();
        result.put("success", true);
        result.put("message", "演示完成");
        return result;
    }
    
    /**
     * 基础拆分请求参数
     */
    public static class SplitRequest {
        private String str1;
        private String str2;
        
        public String getStr1() { return str1; }
        public void setStr1(String str1) { this.str1 = str1; }
        
        public String getStr2() { return str2; }
        public void setStr2(String str2) { this.str2 = str2; }
    }
    
    /**
     * 智能拆分请求参数
     */
    public static class SmartSplitRequest {
        private String input;
        private String pattern;
        private boolean caseSensitive = false;
        private boolean keepEmpty = false;
        private int maxSplits = -1;
        
        public String getInput() { return input; }
        public void setInput(String input) { this.input = input; }
        
        public String getPattern() { return pattern; }
        public void setPattern(String pattern) { this.pattern = pattern; }
        
        public boolean isCaseSensitive() { return caseSensitive; }
        public void setCaseSensitive(boolean caseSensitive) { this.caseSensitive = caseSensitive; }
        
        public boolean isKeepEmpty() { return keepEmpty; }
        public void setKeepEmpty(boolean keepEmpty) { this.keepEmpty = keepEmpty; }
        
        public int getMaxSplits() { return maxSplits; }
        public void setMaxSplits(int maxSplits) { this.maxSplits = maxSplits; }
    }
}