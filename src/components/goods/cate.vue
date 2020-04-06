<template>
  <div>
    <Mbxs msg="商品管理" msg2="商品列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },
      // 商品分类数据
      catelist: [],
      // 总条数
      total: ''
    }
  },
  created() {
    this.getcatelist()
  },
  methods: {
    // 获取商品分类数据
    async getcatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$messsage.error('获取商品列表数据失败')
      }
      this.$message.success('获取角色列表数据成功')
      this.catelist = res.data.result
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped></style>
