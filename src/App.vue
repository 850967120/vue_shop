<template>
  <div id="app">
    <!-- 路由占位符 -->
    <div v-wechat-title="$route.meta.title"></div>
    <router-view ></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
</style>
