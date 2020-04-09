<template>
  <div>
    <Mbxs msg="商品管理" msg2="参数列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品区域 -->
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            v-model="selectkeys"
            :options="catelist"
            :props="cascaderprops"
            @change="cascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 1 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtndisable"
            @click="showaddparamsdialog"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="manytabledata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deletetag(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditparamsdialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleparam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 2 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtndisable"
            @click="showaddparamsdialog"
            >添加参数</el-button
          >
          <!-- 表格 -->
          <el-table :data="onlytabledata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tab标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deletetag(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showeditparamsdialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleparam(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titletext"
      :visible.sync="addparamsdialog"
      width="50%"
    >
      <!-- 表单 -->
      <el-form
        :model="addparamsForm"
        :rules="addparamsFormrules"
        ref="addparamsFormref"
        label-width="100px"
        class="demo-ruleForm"
        @close="addparamsclose"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addparamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addparamsdialog = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titletext"
      :visible.sync="editparamsdialog"
      width="50%"
    >
      <!-- 表单 -->
      <el-form
        :model="editparamsForm"
        :rules="addparamsFormrules"
        ref="editparamsFormref"
        label-width="100px"
        class="demo-ruleForm"
        @close="editparamsclose"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editparamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editparamsdialog = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catelist: [],
      cascaderprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      selectkeys: [],
      //   默认显示动态参数
      activeName: 'many',
      // 动态参数数据
      manytabledata: [],
      onlytabledata: [],
      //   添加参数对话框
      addparamsdialog: false,
      //   表单对象
      addparamsForm: {
        attr_name: ''
      },
      //   表单验证
      addparamsFormrules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editparamsForm: {
        attr_name: ''
      },
      //   修改对话框
      editparamsdialog: false
    }
  },
  created() {
    this.getcatelist()
  },
  methods: {
    // 商品分类数据列表
    async getcatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据列表失败')
      }
      //   console.log(res)
      this.$message.success('获取分类数据列表成功')
      this.catelist = res.data
    },
    // 级联选择器的变化
    cascaderChange() {
      this.getparamsdata()
    },
    // tab切换
    handleTabClick() {
      this.getparamsdata()
    },
    // 获取参数列表
    async getparamsdata() {
      //   console.log(this.selectkeys)
      if (this.selectkeys.length !== 3) {
        this.selectkeys = []
        // 没有选择任何分类，表格数据也要情空
        this.manytabledata = []
        this.onlytabledata = []
        return
      }
      // 根据所选id和面板，获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.$message.success('获取参数列表成功')
      res.data.forEach(item => {
        // console.log(item)
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制tab文本框的显示与隐藏
        // 每一行数据都有自己的inputvisible和vlaue值
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manytabledata = res.data
      } else {
        this.onlytabledata = res.data
      }
    },
    // 展示添加参数的对话框
    showaddparamsdialog() {
      this.addparamsdialog = true
    },
    // 监听对话框的关闭事件
    addparamsclose() {
      this.$refs.addparamsFormref.resetfields()
    },
    // 添加参数按钮
    addparams() {
      this.$refs.addparamsFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.catId}/attributes`,
          {
            attr_name: this.addparamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addparamsdialog = false
        this.getparamsdata()
      })
    },
    editparamsclose() {
      this.$refs.editparamsFormref.resetfields()
    },
    // 修改对话框的显示
    showeditparamsdialog(name) {
      this.editparamsdialog = true
      this.editparamsForm = name
    },
    // 点击修改确定
    editparams() {
      this.$refs.editparamsFormref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.catId}/attributes/${this.editparamsForm.attr_id}`,
          {
            attr_name: this.editparamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.editparamsdialog = false
      })
    },
    // 点击删除分类按钮
    async deleparam(id) {
      console.log(id)

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
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.catId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      console.log(res)
      this.$message.success('删除参数成功')
      this.getparamsdata()
    },
    // 当文本框失去焦点或按下enter键会触发的函数
    handleInputConfirm(row) {
      // 主要实现按钮与文本框的切换显示
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        //   如果等于0就直接return
        return
      }
      //   如果没有return就做后续的处理
      //   将文本框输入的内容追加到attr_vals中去
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //   保存这次操作
      this.savetag(row)
    },
    // 点击tag展示文本框
    showInput(row) {
      row.inputVisible = true
      //   让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 封装的函数
    async savetag(row) {
      console.log(row)

      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加tag失败')
      }
      this.$message.success('添加tag成功')
    },
    // 删除tag
    deletetag(row, index) {
      row.attr_vals.splice(index, 1)
      this.savetag(row)
    }
  },
  computed: {
    //   按钮是否被禁用
    isBtndisable() {
      if (this.selectkeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取三级分类id
    catId() {
      if (this.selectkeys.length === 3) {
        return this.selectkeys[2]
      }
      return null
    },
    // 对话框是添加静态参数的文本或添加动态参数的文本
    titletext() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin-right: 10px;
}
.el-input {
  width: 120px;
}
</style>
