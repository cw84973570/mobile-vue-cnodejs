<template>
  <headerContainer>
    <div class="back" @click="back">
      <span>
        <img src="../static/icon/back.png" alt="" width="20px" height="20px">
      </span>   
    </div>
    <div class="head_title">{{ title }}</div>
  </headerContainer>
</template>

<script>
import headerContainer from '../components/headerContainer.vue'
export default {
  data () {
    return {
      title: '未知'
    }
  },
  beforeRouteEnter(to, from, next) {
    // 复用组件不会触发next回调
    next((vm) => {
      vm.toggleTitle(to.name)
    })
  },
  watch: {
    $route(to, from) {
      // 创建组件不会触发
      // beforeRouteUpdate只有在组件复用且路由路径不变时才会触发，
      // 而watch在组件复用但是路径变化时也能触发
      this.toggleTitle(to.name)
    }
  },
  methods: {
    back() { // 后退
      this.$router.go(-1);
    },
    toggleTitle(name) { // 切换头部标题
      switch (name) {
        case 'article':
          this.title = '文章'
          break
        case 'user':
          this.title = '用户'
          break
        case 'createTopic':
          this.title = '发帖'
          break
        case 'messages':
          this.title = '消息'
          break
        default:
          '未知'
      }
    }
  },
  components: { headerContainer }
}
</script>

<style lang='scss' scoped>
.back {
    display: inline-block;
    width: 50px;
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.16rem;
    color: #ddd;
    span {
      display: block;
      position: relative;
      img {
        position: absolute;
        top: 15px;
        left: 15px;
      }
    }
}
.head_title {
    display: inline-block;
    flex: 1 1 auto;
    height: 0.5rem;
    line-height: 0.5rem;
    font-size: 0.16rem;
    color: #ddd;
}

</style>