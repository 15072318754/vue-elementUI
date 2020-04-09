<template>
  <div>
    <Mbxs msg="商品管理" msg2="商品列表"></Mbxs>
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="goodlist" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="70px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
            <template slot-scope="scope">
               {{scope.row.add_time | dataformate}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
             <template>
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
              ></el-button>
              <el-tooltip
                content="分配权限"
                placement="top-start"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
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
      console.log(res)
      this.goodlist = res.data.goods
      this.total = res.data.total
    },
    // 监听每页显示的条数
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getuserlist()
    },
    // 监听当前页的变化
    handleCurrentChange(newnum) {
      // console.log(newnum)
      this.queryInfo.pagenum = newnum
      this.getuserlist()
    }
  }
}
</script>

<style lang="less" scoped></style>
