/**
 * 字符串工具测试文件
 */

import { splitString, smartSplit } from './stringUtils';

/**
 * 测试基础字符串拆分功能
 */
export function testBasicSplit(): void {
    console.log('=== 基础字符串拆分测试 ===');
    
    // 测试用例1：图片示例
    const str1 = "Elle Girl aa8B ElleGirl ccddelliegirLEF";
    const str2 = "Elle Girl";
    const result1 = splitString(str1, str2);
    
    console.log('测试用例1:');
    console.log('输入:', str1);
    console.log('分隔符:', str2);
    console.log('结果:', result1);
    console.log('期望: ["aa8B", "ccddelliegirLEF"]');
    console.log('通过:', JSON.stringify(result1) === JSON.stringify(["aa8B", "ccddelliegirLEF"]));
    
    // 测试用例2：简单拆分
    const result2 = splitString("apple,banana,orange", ",");
    console.log('\n测试用例2:');
    console.log('输入: "apple,banana,orange"');
    console.log('分隔符: ","');
    console.log('结果:', result2);
    console.log('期望: ["apple", "banana", "orange"]');
    console.log('通过:', JSON.stringify(result2) === JSON.stringify(["apple", "banana", "orange"]));
    
    // 测试用例3：空字符串处理
    const result3 = splitString("", "test");
    console.log('\n测试用例3:');
    console.log('输入: ""');
    console.log('分隔符: "test"');
    console.log('结果:', result3);
    console.log('期望: []');
    console.log('通过:', result3.length === 0);
}

/**
 * 测试智能字符串拆分功能
 */
export function testSmartSplit(): void {
    console.log('\n=== 智能字符串拆分测试 ===');
    
    // 测试用例1：不区分大小写
    const result1 = smartSplit("Hello WORLD hello", "hello", { caseSensitive: false });
    console.log('测试用例1 (不区分大小写):');
    console.log('结果:', result1);
    console.log('期望: ["", " WORLD ", ""]');
    
    // 测试用例2：区分大小写
    const result2 = smartSplit("Hello WORLD hello", "hello", { caseSensitive: true });
    console.log('\n测试用例2 (区分大小写):');
    console.log('结果:', result2);
    console.log('期望: ["Hello WORLD ", ""]');
    
    // 测试用例3：保留空字符串
    const result3 = smartSplit("a,,b,c", ",", { keepEmpty: true });
    console.log('\n测试用例3 (保留空字符串):');
    console.log('结果:', result3);
    console.log('期望: ["a", "", "b", "c"]');
    
    // 测试用例4：限制拆分次数
    const result4 = smartSplit("a,b,c,d,e", ",", { maxSplits: 2 });
    console.log('\n测试用例4 (限制拆分次数):');
    console.log('结果:', result4);
    console.log('期望: ["a", "b", "c,d,e"]');
}

/**
 * 运行所有测试
 */
export function runAllTests(): void {
    console.log('开始运行字符串拆分功能测试...\n');
    
    testBasicSplit();
    testSmartSplit();
    
    console.log('\n测试完成！');
}

// 如果直接运行此文件，执行测试
if (typeof window === 'undefined') {
    runAllTests();
}