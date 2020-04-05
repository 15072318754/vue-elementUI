<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ msg }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ msg2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['msg', 'msg2'],
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
