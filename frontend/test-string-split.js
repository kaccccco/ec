/**
 * 字符串拆分功能测试（JavaScript版本）
 */

/**
 * 拆分字符串为数组
 * @param {string} str1 第一个字符串，包含完整的数据
 * @param {string} str2 第二个字符串，用作分隔符或模式
 * @returns {string[]} 拆分后的字符串数组
 */
function splitString(str1, str2) {
    if (!str1 || !str2) {
        return [];
    }
    
    // 根据图片示例进行智能拆分
    // "Elle Girl aa8B ElleGirl ccddelliegirLEF" 
    // 按照 "Elle Girl" 模式拆分为: ["Elle Girl", "aa8B", "ElleGirl", "ccdd", "ellegirl", "EF"]
    
    const result = [];
    const text = str1;
    const pattern = str2;
    const patternLower = pattern.toLowerCase();
    
    let i = 0;
    let currentSegment = '';
    
    while (i < text.length) {
        // 检查当前位置是否匹配模式（不区分大小写）
        const remainingText = text.substring(i);
        const remainingLower = remainingText.toLowerCase();
        
        if (remainingLower.startsWith(patternLower)) {
            // 找到匹配，先保存当前段落
            if (currentSegment.trim()) {
                result.push(currentSegment.trim());
                currentSegment = '';
            }
            
            // 保存匹配的部分（保持原始大小写）
            const matchedPart = text.substring(i, i + pattern.length);
            result.push(matchedPart);
            
            // 跳过匹配的部分
            i += pattern.length;
            
            // 跳过空格
            while (i < text.length && text[i] === ' ') {
                i++;
            }
        } else {
            // 不匹配，继续累积字符
            currentSegment += text[i];
            i++;
        }
    }
    
    // 添加最后的段落
    if (currentSegment.trim()) {
        result.push(currentSegment.trim());
    }
    
    return result;
}

/**
 * 智能字符串拆分
 */
function smartSplit(input, pattern, options = {}) {
    const {
        caseSensitive = false,
        keepEmpty = false,
        maxSplits = -1
    } = options;
    
    if (!input || !pattern) {
        return keepEmpty ? [''] : [];
    }
    
    // 转义特殊正则字符
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 创建正则表达式
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(escapedPattern, flags);
    
    let result;
    
    if (maxSplits > 0) {
        // 限制拆分次数
        result = [];
        let remaining = input;
        let splitCount = 0;
        
        while (splitCount < maxSplits) {
            const match = regex.exec(remaining);
            if (!match) break;
            
            result.push(remaining.substring(0, match.index));
            remaining = remaining.substring(match.index + match[0].length);
            splitCount++;
            regex.lastIndex = 0; // 重置正则表达式状态
        }
        
        // 添加剩余部分
        if (remaining) {
            result.push(remaining);
        }
    } else {
        // 无限制拆分
        result = input.split(regex);
    }
    
    // 根据选项过滤结果
    if (!keepEmpty) {
        result = result.filter(part => part.trim().length > 0);
    }
    
    return result;
}

// 运行测试
console.log('=== 字符串拆分功能测试 ===\n');

// 测试图片示例
const str1 = "Elle Girl aa8B ElleGirl ccddelliegirLEF";
const str2 = "Elle Girl";

console.log('图片示例测试:');
console.log('输入字符串1:', str1);
console.log('输入字符串2 (分隔符):', str2);

const result = splitString(str1, str2);
console.log('拆分结果:', result);

// 根据图片，期望结果应该是：["Elle Girl", "aa8B", "ElleGirl", "ccdd", "ellegirl", "EF"]
const expectedResult = ["Elle Girl", "aa8B", "ElleGirl", "ccdd", "ellegirl", "EF"];
console.log('期望结果:', expectedResult);
console.log('测试通过:', JSON.stringify(result) === JSON.stringify(expectedResult));

// 让我们手动分析字符串
console.log('\n手动分析:');
console.log('原字符串: "Elle Girl aa8B ElleGirl ccddelliegirLEF"');
console.log('分析步骤:');
console.log('1. "Elle Girl" - 匹配开头');
console.log('2. " aa8B " - 中间部分');  
console.log('3. "ElleGirl" - 另一个相似匹配');
console.log('4. " ccdd" - 中间部分');
console.log('5. "ellegirl" - 小写匹配');
console.log('6. "LEF" - 结尾部分');

console.log('\n=== 其他测试用例 ===');

// 测试用例2：简单拆分
const result2 = splitString("apple,banana,orange", ",");
console.log('\n简单拆分测试:');
console.log('输入: "apple,banana,orange"');
console.log('分隔符: ","');
console.log('结果:', result2);

// 测试用例3：智能拆分（不区分大小写）
const result3 = smartSplit("Hello WORLD hello", "hello", { caseSensitive: false });
console.log('\n智能拆分测试（不区分大小写）:');
console.log('输入: "Hello WORLD hello"');
console.log('分隔符: "hello"');
console.log('结果:', result3);

// 测试用例4：限制拆分次数
const result4 = smartSplit("a,b,c,d,e", ",", { maxSplits: 2 });
console.log('\n限制拆分次数测试:');
console.log('输入: "a,b,c,d,e"');
console.log('分隔符: ","');
console.log('最大拆分次数: 2');
console.log('结果:', result4);

console.log('\n测试完成！');