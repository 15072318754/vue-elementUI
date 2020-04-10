<template>
  <div>
    <Mbxs msg="商品管理" msg2="商品列表"></Mbxs>
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getgoodlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getgoodlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="jumpadd">添加</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="goodlist" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="70px">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="90px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataformate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deletegoodlist(scope.row)"
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   商品列表数据
      goodlist: [],
      total: 0
    }
  },
  created() {
    this.getgoodlist()
  },
  methods: {
    async getgoodlist() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      //   console.log(res)
      this.goodlist = res.data.goods
      this.total = res.data.total
    },
    // 监听每页显示的条数
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getgoodlist()
    },
    // 监听当前页的变化
    handleCurrentChange(newnum) {
      // console.log(newnum)
      this.queryInfo.pagenum = newnum
      this.getgoodlist()
    },
    async deletegoodlist(row) {
      //   console.log(row)
      const confirmres = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmres !== 'confirm') {
        return this.$message.error('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getgoodlist()
    },
    // 点击按钮跳转到添加商品页面
    jumpadd() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped></style>
