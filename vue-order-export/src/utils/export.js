import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * 将订单数据导出为Excel文件
 * @param {Array} orders 订单数据数组
 * @param {String} filename 文件名（不含扩展名）
 * @returns {Promise}
 */
export function exportOrdersToExcel(orders, filename = '订单列表') {
  return new Promise((resolve, reject) => {
    try {
      // 准备Excel数据
      const excelData = orders.map((order, index) => ({
        '序号': index + 1,
        '订单号': order.orderNo,
        '客户姓名': order.customerName,
        '客户电话': order.customerPhone,
        '商品名称': order.productName,
        '数量': order.quantity,
        '单价': order.unitPrice,
        '总金额': order.totalAmount,
        '订单状态': getStatusText(order.status),
        '创建时间': order.createTime,
        '更新时间': order.updateTime
      }))

      // 创建工作簿
      const wb = XLSX.utils.book_new()
      
      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // 设置列宽
      const colWidths = [
        { wch: 8 },   // 序号
        { wch: 18 },  // 订单号
        { wch: 12 },  // 客户姓名
        { wch: 15 },  // 客户电话
        { wch: 20 },  // 商品名称
        { wch: 8 },   // 数量
        { wch: 10 },  // 单价
        { wch: 12 },  // 总金额
        { wch: 10 },  // 订单状态
        { wch: 20 },  // 创建时间
        { wch: 20 }   // 更新时间
      ]
      ws['!cols'] = colWidths

      // 设置表头样式
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "366092" } },
        alignment: { horizontal: "center", vertical: "center" }
      }

      // 应用表头样式
      const range = XLSX.utils.decode_range(ws['!ref'])
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C })
        if (!ws[address]) continue
        ws[address].s = headerStyle
      }

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '订单列表')
      
      // 生成Excel文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      
      // 保存文件
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${filename}_${formatDate(new Date())}.xlsx`)
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 将大量订单数据分批导出并压缩为ZIP文件
 * @param {Array} orders 订单数据数组
 * @param {String} filename 文件名（不含扩展名）
 * @param {Number} batchSize 每个Excel文件的记录数
 * @returns {Promise}
 */
export function exportOrdersToZip(orders, filename = '订单列表导出', batchSize = 5000) {
  return new Promise(async (resolve, reject) => {
    try {
      const zip = new JSZip()
      const totalOrders = orders.length
      const batchCount = Math.ceil(totalOrders / batchSize)
      
      // 创建一个包含统计信息的README文件
      const readmeContent = `订单数据导出统计
==================

导出时间: ${formatDateTime(new Date())}
总订单数: ${totalOrders.toLocaleString()} 条
文件数量: ${batchCount} 个Excel文件
每文件记录数: 最多 ${batchSize.toLocaleString()} 条

文件说明:
${Array.from({ length: batchCount }, (_, i) => {
  const start = i * batchSize + 1
  const end = Math.min((i + 1) * batchSize, totalOrders)
  return `- 订单列表_第${i + 1}批.xlsx: 第 ${start.toLocaleString()}-${end.toLocaleString()} 条记录 (共 ${(end - start + 1).toLocaleString()} 条)`
}).join('\n')}

注意事项:
- 所有金额单位为人民币元
- 时间格式为 YYYY-MM-DD HH:mm:ss
- 如有疑问请联系系统管理员
`
      
      zip.file('README.txt', readmeContent)
      
      // 分批处理数据
      for (let i = 0; i < batchCount; i++) {
        const start = i * batchSize
        const end = Math.min(start + batchSize, totalOrders)
        const batchOrders = orders.slice(start, end)
        
        // 准备Excel数据
        const excelData = batchOrders.map((order, index) => ({
          '序号': start + index + 1,
          '订单号': order.orderNo,
          '客户姓名': order.customerName,
          '客户电话': order.customerPhone,
          '商品名称': order.productName,
          '数量': order.quantity,
          '单价': order.unitPrice,
          '总金额': order.totalAmount,
          '订单状态': getStatusText(order.status),
          '创建时间': order.createTime,
          '更新时间': order.updateTime
        }))

        // 创建工作簿
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(excelData)
        
        // 设置列宽
        const colWidths = [
          { wch: 8 },   // 序号
          { wch: 18 },  // 订单号
          { wch: 12 },  // 客户姓名
          { wch: 15 },  // 客户电话
          { wch: 20 },  // 商品名称
          { wch: 8 },   // 数量
          { wch: 10 },  // 单价
          { wch: 12 },  // 总金额
          { wch: 10 },  // 订单状态
          { wch: 20 },  // 创建时间
          { wch: 20 }   // 更新时间
        ]
        ws['!cols'] = colWidths

        // 设置表头样式
        const headerStyle = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" }
        }

        // 应用表头样式
        const range = XLSX.utils.decode_range(ws['!ref'])
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: 0, c: C })
          if (!ws[address]) continue
          ws[address].s = headerStyle
        }

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '订单列表')
        
        // 生成Excel文件
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        
        // 添加到ZIP文件
        const batchFilename = `订单列表_第${i + 1}批_${start + 1}-${end}.xlsx`
        zip.file(batchFilename, excelBuffer)
      }
      
      // 生成ZIP文件
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      })
      
      // 保存ZIP文件
      saveAs(zipBlob, `${filename}_${formatDate(new Date())}.zip`)
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 导出订单汇总统计Excel
 * @param {Array} orders 订单数据数组
 * @param {String} filename 文件名
 * @returns {Promise}
 */
export function exportOrderSummary(orders, filename = '订单汇总统计') {
  return new Promise((resolve, reject) => {
    try {
      const wb = XLSX.utils.book_new()
      
      // 1. 按状态统计
      const statusStats = {}
      orders.forEach(order => {
        const status = getStatusText(order.status)
        if (!statusStats[status]) {
          statusStats[status] = { count: 0, amount: 0 }
        }
        statusStats[status].count++
        statusStats[status].amount += order.totalAmount
      })
      
      const statusData = Object.entries(statusStats).map(([status, stats]) => ({
        '订单状态': status,
        '订单数量': stats.count,
        '总金额': stats.amount.toFixed(2),
        '平均金额': (stats.amount / stats.count).toFixed(2)
      }))
      
      const statusWs = XLSX.utils.json_to_sheet(statusData)
      statusWs['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, statusWs, '按状态统计')
      
      // 2. 按商品统计
      const productStats = {}
      orders.forEach(order => {
        if (!productStats[order.productName]) {
          productStats[order.productName] = { count: 0, quantity: 0, amount: 0 }
        }
        productStats[order.productName].count++
        productStats[order.productName].quantity += order.quantity
        productStats[order.productName].amount += order.totalAmount
      })
      
      const productData = Object.entries(productStats)
        .map(([product, stats]) => ({
          '商品名称': product,
          '订单数量': stats.count,
          '销售数量': stats.quantity,
          '销售金额': stats.amount.toFixed(2),
          '平均单价': (stats.amount / stats.quantity).toFixed(2)
        }))
        .sort((a, b) => parseFloat(b['销售金额']) - parseFloat(a['销售金额']))
      
      const productWs = XLSX.utils.json_to_sheet(productData)
      productWs['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, productWs, '按商品统计')
      
      // 3. 按日期统计
      const dateStats = {}
      orders.forEach(order => {
        const date = order.createTime.split(' ')[0]
        if (!dateStats[date]) {
          dateStats[date] = { count: 0, amount: 0 }
        }
        dateStats[date].count++
        dateStats[date].amount += order.totalAmount
      })
      
      const dateData = Object.entries(dateStats)
        .map(([date, stats]) => ({
          '日期': date,
          '订单数量': stats.count,
          '总金额': stats.amount.toFixed(2),
          '平均金额': (stats.amount / stats.count).toFixed(2)
        }))
        .sort((a, b) => new Date(b['日期']) - new Date(a['日期']))
      
      const dateWs = XLSX.utils.json_to_sheet(dateData)
      dateWs['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, dateWs, '按日期统计')
      
      // 生成并保存文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `${filename}_${formatDate(new Date())}.xlsx`)
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取状态文本
 * @param {String} status 状态码
 * @returns {String} 状态文本
 */
function getStatusText(status) {
  const textMap = {
    'pending': '待付款',
    'paid': '已付款',
    'shipped': '已发货',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return textMap[status] || status
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date 日期对象
 * @returns {String} 格式化后的日期字符串
 */
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss
 * @param {Date} date 日期对象
 * @returns {String} 格式化后的日期时间字符串
 */
function formatDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * 验证导出数据
 * @param {Array} orders 订单数据
 * @returns {Object} 验证结果
 */
export function validateExportData(orders) {
  if (!Array.isArray(orders)) {
    return { valid: false, message: '数据格式错误：不是数组' }
  }
  
  if (orders.length === 0) {
    return { valid: false, message: '没有数据可导出' }
  }
  
  // 检查必要字段
  const requiredFields = ['orderNo', 'customerName', 'productName', 'totalAmount']
  const missingFields = []
  
  const firstOrder = orders[0]
  requiredFields.forEach(field => {
    if (!(field in firstOrder)) {
      missingFields.push(field)
    }
  })
  
  if (missingFields.length > 0) {
    return { 
      valid: false, 
      message: `缺少必要字段: ${missingFields.join(', ')}` 
    }
  }
  
  return { valid: true, message: '数据验证通过' }
}