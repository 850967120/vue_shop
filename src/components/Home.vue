<template>
<div class="home-box">
    <div v-wechat-title="$route.meta.title"></div>
<el-container class="home-container">
  <!-- 头部区域 -->
  <el-header>
    <div class="header_box">
      <img src="../assets/home_logo.png" alt="">
      <span class="header_title">电商后台管理系统</span>
    </div>
    <el-button type="warning" @click="logout">退出</el-button>
  </el-header>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边区域 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
      >
      <!--一级菜单 -->
      <el-submenu v-for="item in menuList" :index="item.id + ''" :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item  v-for="subItem in item.children" :index="'/'+subItem.path" :key="subItem.id"
          @click="saveNavState('/'+subItem.path)">
          <!-- saveNavState('/'+subItem.path) 保存导航链接的状态 -->
            <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-main>
      <router-view ></router-view>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // 子菜单图标
      iconsObj: {
        125: 'el-icon-user',
        103: 'el-icon-message-solid',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-shopping-cart-2',
        145: 'el-icon-picture-outline'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 获取所以的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res) 获取菜单
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态 储存到session中
    saveNavState (activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;//设置弹性盒子
  justify-content: space-between;//设置弹性盒子中间的空白 使空白相同
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // 通过> 实现内嵌布局的样式设置
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 30px;
      color: #E6A23C;
      font-size: 30px;
    }
    img{
      margin-left: 20px;
      width: 55px;
      height: 55px;
    }
  }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #EAEDF1;
  padding: 10px;
}
.home-container{
  height: 100%;
}
.home-box{
  height: 100%;
}

.el-menu{
    border-right-width: 0;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
