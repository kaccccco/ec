import axios from 'axios'

// 模拟订单数据生成器
function generateMockOrders(count, startId = 1) {
  const orders = []
  const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
  const statusTexts = ['待付款', '已付款', '已发货', '已完成', '已取消']
  const customers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const products = [
    { name: '美白面膜', price: 99 },
    { name: '玻尿酸精华', price: 199 },
    { name: '防晒霜', price: 129 },
    { name: '洁面乳', price: 69 },
    { name: '爽肤水', price: 89 },
    { name: '面霜', price: 159 },
    { name: '眼霜', price: 239 },
    { name: '精华液', price: 299 }
  ]

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const quantity = Math.floor(Math.random() * 5) + 1
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)

    orders.push({
      id: id,
      orderNo: `ORD${String(id).padStart(8, '0')}`,
      customerName: customer,
      customerPhone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 100000000)).padStart(9, '0')}`,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.price,
      totalAmount: product.price * quantity,
      status: status,
      statusText: statusTexts[statuses.indexOf(status)],
      createTime: createTime.toISOString().slice(0, 19).replace('T', ' '),
      updateTime: createTime.toISOString().slice(0, 19).replace('T', ' ')
    })
  }

  return orders
}

// 全量模拟数据（用于演示大数据量导出）
const MOCK_ORDERS = generateMockOrders(12000) // 生成12000条数据用于测试

/**
 * 获取订单列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回订单列表数据
 */
export function getOrderList(params = {}) {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      let filteredOrders = [...MOCK_ORDERS]

      // 按条件过滤
      if (params.orderNo) {
        filteredOrders = filteredOrders.filter(order => 
          order.orderNo.toLowerCase().includes(params.orderNo.toLowerCase())
        )
      }

      if (params.customerName) {
        filteredOrders = filteredOrders.filter(order => 
          order.customerName.includes(params.customerName)
        )
      }

      if (params.status) {
        filteredOrders = filteredOrders.filter(order => order.status === params.status)
      }

      if (params.startDate && params.endDate) {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = order.createTime.split(' ')[0]
          return orderDate >= params.startDate && orderDate <= params.endDate
        })
      }

      // 排序（按创建时间倒序）
      filteredOrders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))

      const total = filteredOrders.length
      const page = params.page || 1
      const pageSize = params.pageSize || 20
      const start = (page - 1) * pageSize
      const end = start + pageSize

      const data = filteredOrders.slice(start, end)

      resolve({
        data: data,
        total: total,
        page: page,
        pageSize: pageSize
      })
    }, Math.random() * 300 + 100) // 100-400ms的随机延迟
  })
}

/**
 * 获取订单详情
 * @param {number} id 订单ID
 * @returns {Promise} 返回订单详情
 */
export function getOrderDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = MOCK_ORDERS.find(o => o.id === id)
      if (order) {
        resolve(order)
      } else {
        reject(new Error('订单不存在'))
      }
    }, 200)
  })
}