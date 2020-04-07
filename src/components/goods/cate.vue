<template>
  <div>
    <Mbxs msg="商品管理" msg2="商品列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddcatedialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        stripe
        border
        show-index
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 1 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green;"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 2 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 3 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delecate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
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
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addcatedialog"
        width="50%"
        @close="addcatedialogColse"
      >
        <!-- 表单 -->
        <el-form
          :model="addcateform"
          :rules="cateformrules"
          ref="cateformref"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addcateform.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectkeys"
              :options="parentcatelist"
              @change="parentcatechange"
              :props="cascaderprops"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addcatedialog = false">取 消</el-button>
          <el-button type="primary" @click="addcate">确 定</el-button>
        </span>
      </el-dialog>
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
      total: 0,
      // 表格配置对象
      columns: [
        {
          // 列标题名称
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框
      addcatedialog: false,
      // 表单对象
      addcateform: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cateformrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类的数据
      parentcatelist: [],
      // 级联选择器的配置对象
      cascaderprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中父级分类的id数组
      selectkeys: []
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
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$messsage.error('获取商品列表数据失败')
      }
      this.$message.success('获取角色列表数据成功')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getcatelist()
    },
    handleCurrentChange(current) {
      // console.log(current)
      this.queryInfo.pagenum = current
      this.getcatelist()
    },
    // 显示添加分类
    showaddcatedialog() {
      // 获取父级分类的数据列表
      this.getparentlist()
      this.addcatedialog = true
    },
    // 获取父级分类的数据列表
    async getparentlist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.$message.success('获取父级分类数据成功')
      // console.log(res)
      this.parentcatelist = res.data
    },
    // 级联选择器的变化
    parentcatechange() {
      console.log(this.selectkeys)
      // 如果大于0就代表选中的是父级分类
      if (this.selectkeys.length > 0) {
        // 父级分类的id
        this.addcateform.cat_pid = this.selectkeys[this.selectkeys.length - 1]
        // 为等级赋值
        this.addcateform.cat_level = this.selectkeys.length
      } else {
        // 如果不大于0,代表没有选择分类，就是添加一级分类
        this.addcateform.cat_pid = 0
        this.addcateform.cat_level = 0
      }
    },
    // 点击确定添加分类
    addcate() {
      this.$refs.cateformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addcateform
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getcatelist()
        this.addcatedialog = false
      })
    },
    // 添加分类对话框的关闭
    addcatedialogColse() {
      this.$refs.cateformref.resetFields()
      this.selectkeys = []
      this.addcateform.cat_name = ''
      this.addcateform.cat_pid = ''
      this.addcateform.cat_level = ''
    },
    // 删除分类
    async delecate(row) {
      // console.log(row.cat_id)
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
      const { data: res } = await this.$http.delete(`categories/${row.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getcatelist()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
