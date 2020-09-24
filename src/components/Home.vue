<template>
<div>
    <div v-wechat-title="$route.meta.title"></div>
<el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
      this.$message({
        message: '退出成功',
        center: true,
        type: 'success'

      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
