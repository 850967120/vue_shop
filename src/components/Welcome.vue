<template>
<div class="welcome_box">
    <div v-wechat-title="$route.meta.title"></div>
</div>
</template>

<style lang="less" scoped>

.welcome_box{
    padding: 0;
    width: 100%;
    height: 100%;
   background: url(../assets/welcome_bg1.gif) no-repeat;
   background-size: 100% 100%;
}
</style>
