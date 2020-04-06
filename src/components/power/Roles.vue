<template>
  <div>
    <Mbxs msg="权限管理" msg2="角色列表"></Mbxs>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddrightdialog"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="展开项">
          <template slot-scope="scope">
            <div>
              <!-- 一级权限 -->
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'center']"
                v-for="(item, i1) in scope.row.children"
                :key="item.id"
              >
                <el-col :span="5">
                  <el-tag closable @close="delright(scope.row, item.id)">{{
                    item.authName
                  }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限和三级权限 -->
                <el-col :span="19">
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'center']"
                    v-for="(item2, i2) in item.children"
                    :key="item2.id"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="delright(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        closable
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="delright(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
                  @click="showdialogVisible(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightdialogVisible"
        width="50%"
        @close="dialogVisibleclose"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightlist"
          :props="treeprops"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultkeys"
          ref="rightlistref"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRight">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addrightdialog" width="50%">
        <span slot="footer" class="dialog-footer">
          <el-button @click="addrightdialog = false">取 消</el-button>
          <el-button type="primary" @click="addrightdialog = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleslist: [],
      // 分配权限对话框
      setRightdialogVisible: false,
      // 权限列表数据
      rightlist: [],
      // 树形控件的属性绑定对象
      treeprops: {
        // 显示的文本
        label: 'authName',
        // 用谁来嵌套
        children: 'children'
      },
      // 三级权限默认节点的id
      defaultkeys: [],
      // 即将被分配权限的id
      roleId: [],
      // 添加角色对话框
      addrightdialog: false
    }
  },
  created() {
    this.getroleslist()
  },
  methods: {
    async getroleslist() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.$message.success('获取角色列表数据成功')
      this.roleslist = res.data
    },
    async delright(role, rightId) {
      //   console.log(role)
      //   console.log(rightId)
      const confirmres = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //   console.log(confirmres)
      if (confirmres !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // 将删除后最新的权限给到role角色上
      role.children = res.data
    },
    // 展示分配权限对话框
    async showdialogVisible(role) {
      //   console.log(role)

      this.roleId = role.id
      // 获取权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.$message.success('获取权限数据成功')
      // 将三级权限列表的数据保存到data中
      this.rightlist = res.data
      // console.log(this.rightlist)
      // 获取三级权限的id
      this.getrightkeys(role, this.defaultkeys)
      this.setRightdialogVisible = true
    },
    // 获取三级权限的id
    getrightkeys(node, arr) {
      // 判断node节点是否包含children属性,如果不包含就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(ele => {
        this.getrightkeys(ele, arr)
      })
    },
    // 监听对话框的关闭事件
    dialogVisibleclose() {
      this.defaultkeys = []
    },
    // 点击确定分配权限
    async setRight() {
      // 获取半选和全选的id
      const keys = [
        ...this.$refs.rightlistref.getCheckedKeys(),
        ...this.$refs.rightlistref.getHalfCheckedKeys()
      ]
      // 用逗号进行分割
      const reskeys = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: reskeys }
      )
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.setRightdialogVisible = false
      this.getroleslist()
    },
    // 点击添加角色按钮
    showaddrightdialog() {
      this.addrightdialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px;
}
</style>
