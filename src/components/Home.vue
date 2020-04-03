<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 下方 -->
    <el-container class="container_box">
      <!-- 左侧 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggleBtn" @click="toggle">></div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的图标和文本 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <!-- 二级菜单的图标和文本 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单权限
      menulist: [],
      // 字体图标
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      iscollapse: false
    }
  },
  // 这个阶段的钩子函数可以访问data里的数据和methods，但页面还没渲染出来，
  // 在这个生命周期函数中，经常可以发ajax
  created() {
    this.getMenu()
  },
  methods: {
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取左侧菜单权限
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // 将获取到的数据挂载到自己的私有数据data里
      this.menulist = res.data
    },
    toggle() {
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: #2c2f2e;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  > div {
    display: flex;
    color: #fff;
    > h3 {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #262934;
  .toggleBtn {
    background-color: pink;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.iconfont {
  margin-right: 15px;
}
</style>
