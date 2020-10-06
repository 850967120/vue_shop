<template>
<div>
       <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
  <!-- 卡片视图 -->
<el-card>
<el-row>
    <el-col>
        <el-button type="primary" class="addroles" @click="addRolesVisible=true" >添加角色</el-button>
    </el-col>
</el-row>
  <!-- 角色列表区域 -->
  <el-table :data="rolesList" border stripe>
    <!-- 展开列  type="expend"-->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row :class="['bdbottom', i1==0 ? 'bdtop': '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
          <!-- 渲染一级权限 -->
          <el-col :span="5">
            <el-tag closable @close="removeRightById (scope.row,item1.id)">
              {{item1.authName}}
            </el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 渲染二级和三级权限 -->
          <el-col :span="19">
            <!-- 通过for循环 嵌套渲染二级权限 -->
            <el-row  :class="[ i2 == 0 ? '': 'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
              <el-col :span="6">
                <el-tag type="success" closable @close="removeRightById (scope.row,item2.id)">
                  {{item2.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--  三级权限渲染 -->
              <el-col :span="18">
                <el-tag type="danger" v-for="(item3) in item2.children"  :key="item3.id"
                closable  @close="removeRightById (scope.row,item3.id)">
                  {{item3.authName}}
                </el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <!-- 索引列 type="index"-->
    <el-table-column label="No." type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作"  width="300px">
      <template slot-scope="scope">
        <el-button type="primary"  @click="showEditDialog(scope.row.id)" size="small" :round="true" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger"  @click="removeRoleById(scope.row.id)" size="small"  :round="true" icon="el-icon-delete" >删除</el-button>
        <el-button type="warning"  @click="showSetRightDialog(scope.row)" size="small" :round="true" icon="el-icon-setting">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>
<!-- 添加角色的对话框 -->
<!--  @close="addRolesClose" 关闭对话框后 重置对话框内容 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addRolesVisible"
    width="50%"
    @close="addRolesClose"
    :close-on-click-modal="false">
    <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
       <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
      </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addRole">确 定</el-button>
       <el-button @click="addRolesVisible = false">取 消</el-button>
    </span>
  </el-dialog>

  <!-- 修改角色信息的对话框 -->
  <el-dialog
    title="修改角色信息"
    :visible.sync="editRolesVisible"
    width="50%"
    @close="editRolesClose"
    :close-on-click-modal="false">
    <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
      <el-form-item label="角色名称" prop="roleName" label-width="100px">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
       <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
      </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editRoleInfo">确 定</el-button>
       <el-button @click="editRolesVisible = false">取 消</el-button>
    </span>
  </el-dialog>

  <!-- 分配权限的对话框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
     @close="RightsClose">
  <!-- show-checkbox 复选框 default-checked-keys 默认勾选的节点的 key 的数组  node-key="id" 复选框选中的值为id  default-expand-all=true 是否默认展开所有节点-->
  <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox  :default-expand-all=true node-key="id" :default-checked-keys="defKeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="allotRights">确 定</el-button>
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 所以角色列表数据
      rolesList: [],
      // 添加角色对话框
      addRolesVisible: false,
      // 添加角色
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证规则
      addFormRules: {
        roleName: [
          { required: true, message: ' 请输入角色名称 ', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称的长度在2-10个符号之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: ' 请输入角色描述 ', trigger: 'blur' },
          { min: 2, max: 10, message: '角色描述的长度在2-10个符号之间', trigger: 'blur' }
        ]
      },
      editRolesVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: ' 请输入角色名称 ', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称的长度在2-10个符号之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: ' 请输入角色描述 ', trigger: 'blur' },
          { min: 2, max: 10, message: '角色描述的长度在2-10个符号之间', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所以权限的数据
      rightsList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值的数组
      defKeys: [],
      // 当前即将分配角色的id
      roleId: ''
    }
  },
  created () {
    // 获取所以的权限
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      } else {
        this.rolesList = res.data
      //  console.log(this.rolesList)
      }
    },
    // 监听添加角色对话框的关闭事件
    addRolesClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定 ，添加新角色
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        } else {
          this.$message.success('添加角色成功！')
        }
        this.addRolesVisible = false
        this.getRolesList()
      })
    },
    editRolesClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示编辑用户信息的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editForm = res.data
      this.editRolesVisible = true
    },
    // 修改角色信息 并提交
    editRoleInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色数据失败！')
        } else {
          this.$message.success('更新角色数据成功！')
        }
        this.editRolesVisible = false
        this.getRolesList()
      })
    },
    // 根据id删除对应的角色数据
    removeRoleById (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: 'btn-custom-cancel',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        } else {
          this.$message({
            type: 'success',
            message: '删除角色成功!'
          })
        }
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据id删除对应的权限数据
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该角色对应的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: 'btn-custom-cancel',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色的权限失败！')
        } else {
          this.$message({
            type: 'success',
            message: '删除角色的权限成功!'
          })
        }
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 把获取到的权限数据保存到 data中
      this.rightsList = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      this.roleId = role.id
      // console.log(this.rightsList)
    },
    // 通过递归的方式 获取角色下所以三级权限的id，并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包括children属性， 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    RightsClose () {
      this.defKeys = []
    },
    // 点击确定 ，分配权限
    async allotRights () {
      // keys 数组 合并 两个函数的值 并返回
      // ...为展开运算符
      const keys = [
        // getCheckedKeys()函数 获取已经选中的节点并返回
        // getHalfCheckedKeys()函数 获取已经选中的半节点并返回
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // - 请求路径：roles/:roleId/rights
      // - 请求方法：post
      // - 请求参数：通过 `请求体` 发送给后端
      // rids 权限 ID 列表（字符串） | 以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点） |
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      } else {
        this.$message.success('分配权限成功！')
      }
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.addroles{
  margin-left: 15px;
}
.el-tag{
margin: 10px;
}
.bdtop{
  border-top:  1.5px solid #eee;
}
.bdbottom{
  border-bottom: 1.5px solid #eee;
}
.el-row{
  display: flex;
  align-items: center;
}
</style>
