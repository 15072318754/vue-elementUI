<template>
  <div>
    <Mbxs msg="用户管理" msg2="用户列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getuserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisibleFlag = true"
            >添加</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.mg_state"
                @change="statechange(scope.row)"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showeditdialog(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteuser(scope.row.id)"
              ></el-button>
              <el-tooltip
                content="分配权限"
                placement="top-start"
                :enterable="true"
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

    <!-- 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisibleFlag"
      width="50%"
      @close="dialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="ruleForm"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleFlag = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisibleFlag"
      width="50%"
      @close="editdialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormref"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisibleFlag = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 邮箱校验
    const checkEmail = (rules, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱地址'))
    }
    // 手机校验
    const checkMobile = (rules, value, cb) => {
      const regMobile = /^1[3-9]\d{9}$/g
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    return {
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 1
      },
      // 用户列表
      userlist: [],
      // 总数据条数
      total: 0,
      switchFlag: true,
      // 添加对话框默认隐藏
      dialogVisibleFlag: false,
      // 表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验规则
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改对话框默认隐藏
      editdialogVisibleFlag: false,
      // 表单的默认数据
      editForm: {}
    }
  },
  created() {
    this.getuserlist()
  },
  methods: {
    // 获取用户数据
    async getuserlist() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.userlist = res.data.users
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
    },
    // 监听用户状态
    async statechange(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        // 如果请求失败就不改变页面的状态
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success('用户状态修改成功')
    },
    // 搜索
    search() {
      this.getuserlist()
    },
    // 对话框关闭
    dialogClose() {
      // console.log(this.$refs.ruleForm)
      this.$refs.ruleForm.resetFields()
    },
    // 添加用户前的表单预校验
    addUser() {
      // 添加用户前的表单预校验
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功！')
        // 将对话框隐藏
        this.dialogVisibleFlag = false
        // 刷新列表
        this.getuserlist()
      })
    },
    // 点击修改按钮
    async showeditdialog(id) {
      this.editForm = id
      this.editdialogVisibleFlag = true
    },
    // 修改按钮关闭
    editdialogClose() {
      this.$refs.editFormref.resetFields()
    },
    // 修改提交用户前的表单预校验
    editUser() {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功！')
        // 将对话框隐藏
        this.editdialogVisibleFlag = false
        // 刷新列表
        this.getuserlist()
      })
    },
    async deleteuser(id) {
      const confirmresult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmresult)
      if (confirmresult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      // 这种情况适用于每页显示一条数据，当如果数据剩1条了，删完后就要跳转到上一页
      console.log(this.userlist, this.queryInfo.pagenum)
      // 如果当前页不是第一页，我们就开始处理
      if (this.queryInfo.pagenum !== 1) {
        // 如果当前页只有1条数据 就将当前页码减1
        if (this.userlist.length === 1) {
          this.queryInfo.pagenum -= 1
        }
      }
      this.getuserlist()
    }
  }
}
</script>

<style lang="less" scoped></style>
