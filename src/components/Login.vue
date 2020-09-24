<template>
    <div class="login_container" >
      <div v-wechat-title="$route.meta.title"></div>
     <div class="login_box">
    <!-- 头像区域 -->
         <div class="avatar_box">
             <img src="../assets/logo1.png" alt="">
         </div>
    <!-- 登陆表单区域 -->
         <el-form ref="loginRef" :model="loginForm" :rules="login_rules" class="login_from" >
            <!-- 账号： -->
    <el-form-item  label="账号:" label-width="70px" prop="username">
        <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user" placeholder="请输入账号"></el-input>
    </el-form-item>
            <!-- 密码： -->
    <el-form-item label="密码:" label-width="70px" prop="password">
        <el-input v-model="loginForm.password"  prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" :type="pwdType" >
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
        </el-input>
    </el-form-item>
             <!-- 按钮区域： -->
    <el-form-item class="btn">
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="info" @click="resetLogin">重置</el-button>
    </el-form-item>
         </el-form>
     </div>
    </div>
</template>>

<script>
export default {
  data () {
    return {
      // 登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 密码type值设置
      pwdType: 'password',
      // 表单验证规则对象设置
      login_rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证用户名是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 设置密码的显示和隐藏
    showPwd () {
      this.pwdType === 'password' ? this.pwdType = 'text' : this.pwdType = 'password'
    },
    // 点击重置按钮，重置登陆表单
    resetLogin () {
      this.$refs.loginRef.resetFields()
    },
    // 表单登陆预验证 返回false或true
    login () {
      // async await 过滤Promise值
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 如果返回的status值 不为200 进行判断 200为true 400为false
        if (res.meta.status !== 200) {
          // 通过message来设置弹窗信息
          this.$message({
            message: '登陆失败，用户名或密码错误',
            center: true,
            type: 'error'

          })
        } else {
          this.$message({
            message: '登陆成功',
            center: true,
            type: 'success'

          })
        }
        // 将登陆成功的token保存到sessionStorage ,当浏览器关闭后，保存的token会清除
        sessionStorage.setItem('token', res.data.token)
        // 登陆成功后设置登陆跳转页面地址   this.$router.push()为路由传值
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>//scoped使样式只作用在此vue文件中

.login_container{
    height: 100%;
   background: url(../assets/bj1.png) no-repeat;
   background-size: 100% 100%;
   filter: login_container(2px);
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: rgb(255, 255, 255);
    border-radius: 3px;
    position: absolute;
   //position: absolute;  left: 50%; top: 50%; transform: translate(-50%,-50%); 可以实现水平垂直居中
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
}
.btn {
 position: absolute;
 left: 50%;
 transform: translate(-50%);
}
.login_from{
    position: absolute;
    bottom: 25%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.el-icon-view{
    cursor:pointer;
}
</style>
