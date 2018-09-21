<template>
  <div id="app" ref="appContainer">
    <router-view name="head"></router-view>
    <keep-alive>
      <!-- 用户组件缓存 -->
      <!-- 缓存用户组件，保存滚动位置 -->
      <router-view name="main" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view name="main" v-if="!$route.meta.keepAlive"></router-view>
    <v-footer></v-footer>
    <signin></signin>
  </div>
</template>

<script>
import vFooter from "./views/footer.vue"
import signin from './views/signin.vue'

export default {
  components: { vFooter, signin }
}
</script>

<style lang="scss" scoped="" type="text/css">
#app {
  // 如果父元素没有设置宽高
  // 设置absolute后宽高的百分比基于屏幕
  // 没有设置的话自适应宽高
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
