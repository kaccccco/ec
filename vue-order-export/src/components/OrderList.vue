<template>
  <div class="order-list">
    <!-- 搜索和筛选区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-form">
        <el-form :model="searchForm" :inline="true" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="searchForm.customerName" placeholder="请输入客户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.status" placeholder="请选择订单状态" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="待付款" value="pending"></el-option>
              <el-option label="已付款" value="paid"></el-option>
              <el-option label="已发货" value="shipped"></el-option>
              <el-option label="已完成" value="completed"></el-option>
              <el-option label="已取消" value="cancelled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport" :loading="exportLoading">
              <i class="el-icon-download"></i>
              导出订单
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 订单列表表格 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <span>订单列表 (共 {{ total }} 条记录)</span>
        <el-button 
          v-if="selectedOrders.length > 0" 
          type="warning" 
          size="small" 
          @click="handleBatchExport"
          :loading="exportLoading">
          批量导出选中 ({{ selectedOrders.length }})
        </el-button>
      </div>
      
      <el-table
        :data="orderList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="120"></el-table-column>
        <el-table-column prop="customerPhone" label="客户电话" width="130"></el-table-column>
        <el-table-column prop="productName" label="商品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" align="center"></el-table-column>
        <el-table-column prop="unitPrice" label="单价" width="100" align="right">
          <template slot-scope="scope">
            ¥{{ scope.row.unitPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
          <template slot-scope="scope">
            ¥{{ scope.row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleExportSingle(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </el-card>

    <!-- 导出进度对话框 -->
    <el-dialog
      title="导出进度"
      :visible.sync="exportDialog.visible"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="export-progress">
        <div class="progress-info">
          <p>正在导出订单数据...</p>
          <p>总数据量: {{ exportDialog.total }}</p>
          <p>当前进度: {{ exportDialog.current }} / {{ exportDialog.total }}</p>
        </div>
        <el-progress
          :percentage="exportDialog.percentage"
          :stroke-width="20"
          :text-inside="true">
        </el-progress>
        <div class="progress-status" style="margin-top: 15px;">
          <p v-if="exportDialog.status">{{ exportDialog.status }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelExport" :disabled="!exportDialog.canCancel">取消导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList } from '@/api/order'
import { exportOrdersToExcel, exportOrdersToZip } from '@/utils/export'

export default {
  name: 'OrderList',
  data() {
    return {
      // 搜索表单
      searchForm: {
        orderNo: '',
        customerName: '',
        status: '',
        dateRange: []
      },
      // 订单列表数据
      orderList: [],
      selectedOrders: [],
      loading: false,
      exportLoading: false,
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      // 导出对话框
      exportDialog: {
        visible: false,
        total: 0,
        current: 0,
        percentage: 0,
        status: '',
        canCancel: true
      },
      // 导出控制
      exportAbortController: null
    }
  },
  mounted() {
    this.loadOrderList()
  },
  methods: {
    // 加载订单列表
    async loadOrderList() {
      this.loading = true
      try {
        const params = {
          ...this.searchForm,
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize
        }
        
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          params.startDate = this.searchForm.dateRange[0]
          params.endDate = this.searchForm.dateRange[1]
        }
        delete params.dateRange

        const response = await getOrderList(params)
        this.orderList = response.data
        this.total = response.total
      } catch (error) {
        this.$message.error('加载订单列表失败')
        console.error('Load order list error:', error)
      } finally {
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1
      this.loadOrderList()
    },

    // 重置搜索
    handleReset() {
      this.searchForm = {
        orderNo: '',
        customerName: '',
        status: '',
        dateRange: []
      }
      this.pagination.currentPage = 1
      this.loadOrderList()
    },

    // 分页相关
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.loadOrderList()
    },

    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loadOrderList()
    },

    // 表格选择
    handleSelectionChange(selection) {
      this.selectedOrders = selection
    },

    // 导出所有查询结果
    async handleExport() {
      try {
        // 获取所有符合条件的数据总数
        const params = { ...this.searchForm }
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          params.startDate = this.searchForm.dateRange[0]
          params.endDate = this.searchForm.dateRange[1]
        }
        delete params.dateRange

        const countResponse = await getOrderList({ ...params, page: 1, pageSize: 1 })
        const totalCount = countResponse.total

        if (totalCount === 0) {
          this.$message.warning('没有符合条件的订单数据')
          return
        }

        // 确认导出
        const confirmMessage = totalCount > 5000 
          ? `查询结果共 ${totalCount} 条记录，将分批导出并压缩成ZIP文件，是否继续？`
          : `查询结果共 ${totalCount} 条记录，是否导出为Excel文件？`
        
        await this.$confirm(confirmMessage, '确认导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.exportLoading = true
        this.showExportDialog(totalCount)

        if (totalCount > 5000) {
          await this.exportLargeDataset(params, totalCount)
        } else {
          await this.exportSmallDataset(params, totalCount)
        }

      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('导出失败：' + (error.message || error))
          console.error('Export error:', error)
        }
      } finally {
        this.exportLoading = false
        this.hideExportDialog()
      }
    },

    // 批量导出选中的订单
    async handleBatchExport() {
      if (this.selectedOrders.length === 0) {
        this.$message.warning('请选择要导出的订单')
        return
      }

      try {
        await this.$confirm(`确定导出选中的 ${this.selectedOrders.length} 条订单？`, '确认导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.exportLoading = true
        this.showExportDialog(this.selectedOrders.length)
        
        await exportOrdersToExcel(this.selectedOrders, '选中订单列表')
        this.$message.success('导出成功')
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('导出失败：' + (error.message || error))
        }
      } finally {
        this.exportLoading = false
        this.hideExportDialog()
      }
    },

    // 导出单个订单
    async handleExportSingle(order) {
      try {
        this.exportLoading = true
        await exportOrdersToExcel([order], `订单_${order.orderNo}`)
        this.$message.success('导出成功')
      } catch (error) {
        this.$message.error('导出失败：' + (error.message || error))
      } finally {
        this.exportLoading = false
      }
    },

    // 导出大数据集（>5000条）
    async exportLargeDataset(params, totalCount) {
      const batchSize = 1000 // 每批1000条
      const batches = Math.ceil(totalCount / batchSize)
      const allData = []

      this.exportDialog.status = '正在分批获取数据...'

      // 创建可取消的控制器
      this.exportAbortController = new AbortController()

      for (let i = 0; i < batches; i++) {
        // 检查是否被取消
        if (this.exportAbortController.signal.aborted) {
          throw new Error('导出已取消')
        }

        const page = i + 1
        this.exportDialog.current = Math.min(i * batchSize + batchSize, totalCount)
        this.exportDialog.percentage = Math.round((i + 1) / batches * 60) // 60%用于数据获取
        this.exportDialog.status = `正在获取第 ${page} 批数据 (${i * batchSize + 1}-${Math.min((i + 1) * batchSize, totalCount)})`

        try {
          const response = await getOrderList({
            ...params,
            page: page,
            pageSize: batchSize
          })
          allData.push(...response.data)
          
          // 添加小延迟避免请求过于频繁
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          throw new Error(`获取第 ${page} 批数据失败: ${error.message}`)
        }
      }

      this.exportDialog.status = '正在生成压缩文件...'
      this.exportDialog.percentage = 80

      // 导出为ZIP文件
      await exportOrdersToZip(allData, '订单列表导出')
      
      this.exportDialog.percentage = 100
      this.exportDialog.status = '导出完成'
      this.$message.success(`成功导出 ${totalCount} 条订单数据`)
    },

    // 导出小数据集（<=5000条）
    async exportSmallDataset(params, totalCount) {
      this.exportDialog.status = '正在获取数据...'
      this.exportDialog.percentage = 30

      const response = await getOrderList({
        ...params,
        page: 1,
        pageSize: totalCount
      })

      this.exportDialog.current = totalCount
      this.exportDialog.percentage = 70
      this.exportDialog.status = '正在生成Excel文件...'

      await exportOrdersToExcel(response.data, '订单列表')
      
      this.exportDialog.percentage = 100
      this.exportDialog.status = '导出完成'
      this.$message.success(`成功导出 ${totalCount} 条订单数据`)
    },

    // 显示导出对话框
    showExportDialog(total) {
      this.exportDialog = {
        visible: true,
        total: total,
        current: 0,
        percentage: 0,
        status: '准备导出...',
        canCancel: true
      }
    },

    // 隐藏导出对话框
    hideExportDialog() {
      setTimeout(() => {
        this.exportDialog.visible = false
        this.exportAbortController = null
      }, 1500)
    },

    // 取消导出
    cancelExport() {
      if (this.exportAbortController) {
        this.exportAbortController.abort()
        this.exportDialog.canCancel = false
        this.exportDialog.status = '正在取消...'
        this.$message.info('导出已取消')
      }
    },

    // 查看订单详情
    handleView(order) {
      this.$message.info(`查看订单: ${order.orderNo}`)
      // 这里可以跳转到订单详情页面或打开详情对话框
    },

    // 获取状态类型
    getStatusType(status) {
      const typeMap = {
        'pending': 'warning',
        'paid': 'primary',
        'shipped': 'info',
        'completed': 'success',
        'cancelled': 'danger'
      }
      return typeMap[status] || 'info'
    },

    // 获取状态文本
    getStatusText(status) {
      const textMap = {
        'pending': '待付款',
        'paid': '已付款',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return textMap[status] || status
    }
  }
}
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form .el-form-item {
  margin-bottom: 15px;
}

.table-card {
  min-height: 600px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 16px;
}

.export-progress {
  text-align: center;
}

.progress-info p {
  margin: 8px 0;
  color: #606266;
}

.progress-status p {
  color: #409EFF;
  font-weight: bold;
}

.el-table .el-table__cell {
  padding: 8px 0;
}
</style>