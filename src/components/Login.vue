<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="img_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区 -->
      <el-form
        class="login_form"
        :model="formdata"
        :rules="rules"
        ref="formrefs"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="formdata.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="formdata.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="form_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  methods: {
    resetform() {
      // 重置表单
      this.$refs.formrefs.resetFields()
    },
    login() {
      this.$refs.formrefs.validate(async valid => {
        // 如果验证失败就不往下走
        if (!valid) return this.$message.error('校验失败')
        // 验证成功就发起请求
        // 需要先导入axios
        // 再将axios挂载到vue的原型上，这样组件可以通过this.$http.就可以发起请求
        // 再设置基准的请求路径
        // 请求回来的值有5项，只有data是服务器返回的数据，将data这一项进行结构赋值
        const { data: res } = await this.$http.post('login', this.formdata)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        // 将服务器返回的token保存到sessionstorage
        window.sessionStorage.setItem('token', res.data.token)
        // 再通过编程式导航跳转到home页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // margin-left: -225px;
    // margin-top: -150px;
    .img_box {
      width: 130px;
      height: 130px;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      margin: 0 auto;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .form_btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
