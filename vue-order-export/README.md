# Vue2 订单列表导出系统

基于 Vue2 + Element-UI 实现的订单列表管理和导出功能，支持大数据量分批导出和压缩。

## 功能特性

### 🔍 订单查询
- 支持按订单号、客户姓名、订单状态、创建时间范围等条件查询
- 实时搜索结果统计
- 分页展示，支持自定义每页显示数量

### 📊 订单列表
- 表格展示订单详细信息
- 支持多选操作
- 订单状态标签化显示
- 响应式布局，适配不同屏幕尺寸

### 📤 导出功能
- **小数据量导出**（≤5000条）：直接导出为Excel文件
- **大数据量导出**（>5000条）：自动分批导出并压缩为ZIP文件
- **批量导出**：支持导出选中的订单
- **单个导出**：支持导出单个订单
- **导出进度**：实时显示导出进度和状态
- **取消导出**：支持中途取消导出操作

### 🎨 用户体验
- 导出进度实时反馈
- 友好的错误提示
- 加载状态指示
- 响应式设计

## 技术栈

- **前端框架**：Vue 2.6.14
- **UI组件库**：Element-UI 2.15.13
- **Excel处理**：xlsx 0.18.5
- **文件压缩**：jszip 3.10.1
- **文件保存**：file-saver 2.0.5
- **HTTP客户端**：axios 1.5.0

## 项目结构

```
vue-order-export/
├── public/
│   └── index.html          # HTML模板
├── src/
│   ├── api/
│   │   └── order.js        # 订单API接口
│   ├── components/
│   │   └── OrderList.vue   # 订单列表组件
│   ├── utils/
│   │   └── export.js       # 导出工具函数
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json            # 项目配置
├── vue.config.js           # Vue CLI配置
└── README.md               # 项目文档
```

## 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
cd vue-order-export
npm install
```

### 开发模式
```bash
npm run serve
```
访问 http://localhost:8080

### 生产构建
```bash
npm run build
```

## 核心功能说明

### 1. 分批导出机制

当数据量超过5000条时，系统会自动：
1. 按1000条/批的方式分批获取数据
2. 每批数据生成一个Excel文件
3. 所有Excel文件打包为ZIP压缩包
4. 生成README.txt说明文件

### 2. 导出文件格式

#### Excel文件包含字段：
- 序号
- 订单号
- 客户姓名
- 客户电话
- 商品名称
- 数量
- 单价
- 总金额
- 订单状态
- 创建时间
- 更新时间

#### ZIP文件结构：
```
订单列表导出_2024-01-01.zip
├── README.txt                    # 导出说明文件
├── 订单列表_第1批_1-1000.xlsx      # 第1批数据
├── 订单列表_第2批_1001-2000.xlsx   # 第2批数据
└── ...
```

### 3. 导出进度控制

- 实时显示导出进度百分比
- 显示当前处理的数据条数
- 支持中途取消导出操作
- 错误处理和重试机制

## API接口

### getOrderList(params)
获取订单列表数据

**参数：**
- `orderNo`: 订单号（可选）
- `customerName`: 客户姓名（可选）
- `status`: 订单状态（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认20）

**返回：**
```javascript
{
  data: [...],      // 订单列表数据
  total: 1000,      // 总记录数
  page: 1,          // 当前页码
  pageSize: 20      // 每页数量
}
```

## 导出工具函数

### exportOrdersToExcel(orders, filename)
导出订单为Excel文件

### exportOrdersToZip(orders, filename, batchSize)
分批导出订单并压缩为ZIP文件

### exportOrderSummary(orders, filename)
导出订单汇总统计

## 浏览器兼容性

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 注意事项

1. **内存使用**：大数据量导出时会占用较多内存，建议分批处理
2. **网络超时**：长时间导出可能遇到网络超时，已实现重试机制
3. **文件大小**：ZIP文件会根据数据量自动压缩，一般压缩比在60-80%
4. **浏览器限制**：某些浏览器对文件下载有限制，建议使用现代浏览器

## 开发指南

### 自定义导出字段
修改 `src/utils/export.js` 中的字段映射：

```javascript
const excelData = orders.map((order, index) => ({
  '序号': index + 1,
  '订单号': order.orderNo,
  // 添加或修改字段
  '新字段': order.newField,
  // ...
}))
```

### 修改分批大小
在 `exportOrdersToZip` 函数中修改 `batchSize` 参数默认值。

### 自定义样式
修改 `src/components/OrderList.vue` 中的样式部分。

## 许可证

MIT License