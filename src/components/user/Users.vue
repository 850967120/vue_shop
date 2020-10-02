<template>
<div>
    <div v-wechat-title="$route.meta.title"></div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card>
  <!-- 搜索与添加区域 -->
  <el-row :gutter="15">
      <el-col :span="7">
        <!-- v-model="quertInfo.query" 设置双向绑定 获取查询参数-->
        <!-- clearable 使用clearable属性即可得到一个可清空的输入框 -->
        <!-- @clear="getUserList" 点击清空按钮 清空查询 返回所以数据 -->
          <el-input placeholder="请输入内容" v-model="quertInfo.query" clearable @clear="getUserList">
            <!-- @click="getUserList" 设置点击事件 返回符合查询结果的数据 -->
            <!-- slot="append" 指定插槽后置   slot="prepend" 指定插槽前置-->
    <el-button slot="append" icon="el-icon-search"  @click="getUserList" ></el-button>
  </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true" >添加用户</el-button>
      </el-col>
  </el-row>
  <!-- 用户列表区域 -->
  <el-table :data="userlist" border stripe>
       <el-table-column label="No." type="index"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="职位" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <!--  slot-scope="scope" 来取得作用域插槽:data绑定的数据，scope可以随便替换其他名称，只是定义对象来代表取得的data数据，便于使用 -->
        <!--   @change="userStateChange(scope.row) 获取switch开关的数值 用来保存到数据库中-->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-tooltip  effect="dark" content="修改信息" placement="top" :enterable="false">
      <el-button type="primary" icon="el-icon-edit" size="medium" :circle="true" @click="showEditDialog(scope.row.id)"></el-button>
          </el-tooltip>
          <!-- 删除按钮 -->
           <el-tooltip  effect="dark" content="删除信息" placement="top" :enterable="false">
          <el-button type="danger" icon="el-icon-delete" size="medium" :circle="true" @click="removeUserById(scope.row.id)"></el-button>
          </el-tooltip>
          <!-- 分配按钮 -->
          <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="medium" :circle="true"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="quertInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="quertInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
   <!-- 添加用户的对话框 -->
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClose"
    :close-on-click-modal="false">
    <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" :type="pwdType">
          <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
      </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addUser">确 定</el-button>
       <el-button @click="addDialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>

   <!-- 修改信息的对话框 -->
  <el-dialog
    title="修改用户信息"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClose"
    :close-on-click-modal="false">
    <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
      </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
       <el-button @click="editDialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证邮箱的规则
    var checkMobile = (rule, value, callback) => {
      // 电话的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 用户数据列表s
      quertInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 10 //  每页显示条数
      },
      userlist: [],
      total: 0, // 分页总数据数量
      addDialogVisible: false, // 控制添加用户对话框的显示和隐藏
      pwdType: 'password',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }, // 添加用户的表单数据
      // 添加用户表单的验证规则对象
      addFormRules: {
        username: [
          // trigger: 'blur' 触发方式为失去焦点
          // required: true 设置必填项
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在3-10个字符之间', trigger: 'blur' }
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
      editDialogVisible: false, // 控制修改信息对话框的显示和隐藏
      // 查询到的用户信息对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取管理员信息
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.quertInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res) 获取管理员信息
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      this.quertInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听pagesize改变的事件
    handleCurrentChange (newPage) {
      this.quertInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChange (userinfo) {
      // console.log(userinfo)
      // 用``反引号 因为uid是动态数据 用''单引号可能会报错
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state // 更新失败后 开关取反 变回原样
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 密码显示与隐藏
    showPwd () {
      this.pwdType === 'password' ? this.pwdType = 'text' : this.pwdType = 'password'
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！用户名已存在')
        } else {
          this.$message.success('添加用户成功！')
        }
        // 隐藏用户添加对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户信息的对话框
    // eslint-disable-next-line vue/no-dupe-keys
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息 并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户数据失败！')
        } else {
          this.$message.success('更新用户数据成功！')
        }
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 根据id删除对应的用户数据
    removeUserById (id) {
      // 删除弹框
      this.$confirm('此操作将删除该用户数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: 'btn-custom-cancel',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        } else {
          this.$message({
            type: 'success',
            message: '删除用户成功!'
          })
        }
        this.getUserList()
        // .catch() 捕获错误
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log(confirmResule)
    }

  }
}
</script>

<style lang="less" >
.btn-custom-cancel{
  float :right;
  margin-left: 10px;
}
</style>
