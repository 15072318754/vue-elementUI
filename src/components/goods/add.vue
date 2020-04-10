<template>
  <div>
    <Mbxs msg="商品管理" msg2="添加商品"></Mbxs>
    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        :closable="false"
      ></el-alert>
      <!-- 进度条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="已完成"></el-step>
      </el-steps>
      <!-- tabs -->
      <el-form
        :model="addgoodsForm"
        :rules="addgoodsFormrules"
        ref="addgoodsFormref"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeleave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addgoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addgoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addgoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addgoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                checkStrictly
                v-model="addgoodsForm.goods_cat"
                :options="catelist"
                :props="casprops"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
            <!-- 表单 -->
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manytabdata"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="item2 in item.attr_vals"
                  :key="item2.attr_id"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              prop="attr_name"
              v-for="item in onlytabdata"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 指定激活项
      activeIndex: '0',
      // 指定tabs的标签方向
      tabPosition: 'left',
      //   表单对象
      addgoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: ''
      },
      //   表单验证
      addgoodsFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //   商品分类数据列表
      catelist: [],
      casprops: {
        expandTrigger: 'hover',
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      //   动态参数
      manytabdata: [],
      onlytabdata: []
    }
  },
  created() {
    this.getcatelist()
  },
  methods: {
    //   获取商品分类数据
    async getcatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      //   console.log(res)
      this.catelist = res.data
    },
    // 级联选择器变化
    cascaderChange() {
      // 选择器长度不等于3直接清空不做任何处理
      if (this.addgoodsForm.goods_cat.length !== 3) {
        this.addgoodsForm.goods_cat = []
        return false
      }
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    beforeleave(activeName, oldActiveName) {
      //   console.log('进入' + activeName)
      //   console.log('离开' + oldActiveName)
      if (oldActiveName === '0' && this.addgoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
    },
    async tabClick() {
      console.log(this.activeIndex)
      // 在compute中定义一个分类id
      // 如果activeIndex=0就发请求获取"动态参数"面板并存于data中
      // 如果activeIndex=1就发请求获取"静态属性"面板并存于data中
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类数据失败')
        }
        // 将返回的数组进行遍历,以空格分割
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          //   console.log(item.attr_vals)
        })
        this.manytabdata = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类数据失败')
        }

        this.onlytabdata = res.data
      }
    }
  },
  computed: {
    //   获取分类id
    catId() {
      if (this.addgoodsForm.goods_cat.length === 3) {
        return this.addgoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 10px;
}
.el-form {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 10px 0;
}
</style>
