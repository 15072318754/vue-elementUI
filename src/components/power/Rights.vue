<template>
  <div>
    <Mbxs msg="权限管理" msg2="权限列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 列表 -->
      <el-table :data="rightlist" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightlist: []
    }
  },
  created() {
    this.getRightlist()
  },
  methods: {
    //   获取权限列表
    async getRightlist() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表数据失败')
      }
      this.rightlist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-right: 5px;
}
</style>
