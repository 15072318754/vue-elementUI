<template>
  <div>
    <Mbxs msg="订单管理" msg2="订单列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getorderlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getorderlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="orderslist" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <div>
              <el-tag type="warning" v-if="scope.row.pay_status === '0'"
                >未付款</el-tag
              >
              <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <template>
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showeditdialog"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-location-information"
                size="mini"
                @click="showprogress"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editorderdialog"
        width="50%"
        @close="editorderdialogColse"
      >
        <!-- 表单 -->
        <el-form
          :model="editorderform"
          :rules="cateformrules"
          ref="editorderformref"
          label-width="100px"
        >
          <el-form-item label="省市区" prop="address1">
            <el-cascader
              v-model="editorderform.address1"
              :options="citydata"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editorderform.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editorderdialog = false">取 消</el-button>
          <el-button type="primary" @click="editorderdialog = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度对话框 -->
      <el-dialog
        title="物流进度显示"
        :visible.sync="progressdialog"
        width="50%"
      >
        <!-- 时间线 -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            color="#0bbd87"
            v-for="(activity, index) in progressdata"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   订单列表
      orderslist: [],
      total: 0,
      //  修改对话框
      editorderdialog: false,
      //   表单对象
      editorderform: {
        address1: [],
        address2: ''
      },
      //   表单校验
      cateformrules: {
        address1: [
          { required: true, message: '请输入省市区', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      //   物流对话框
      progressdialog: false,
      //   物流信息
      progressdata: [],
      //   正序或倒序展示
      reverse: false
    }
  },
  created() {
    this.getorderlist()
  },
  methods: {
    //   获取订单数据列表
    async getorderlist() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderslist = res.data.goods
      this.total = res.data.total
    },
    // 监听每页显示的条数
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getorderlist()
    },
    // 监听当前页的变化
    handleCurrentChange(newnum) {
      // console.log(newnum)
      this.queryInfo.pagenum = newnum
      this.getorderlist()
    },
    // 对话框的关闭事件
    editorderdialogColse() {
      this.$refs.editorderformref.resetFields()
    },
    // 展示修改地址对话框
    showeditdialog() {
      this.editorderdialog = true
    },
    // 展示物流对话框
    async showprogress() {
      // 获取物流数据
      this.progressdialog = true
      const { data: res } = await this.$http.get(`/kuaidi/${1106975712662}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      console.log(res)
      this.progressdata = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
