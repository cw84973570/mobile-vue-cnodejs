<template>
  <div id="header">
    <slot></slot>
    <div class="right_btn">
      <!-- <router-link :to="{ name: 'signin' }">登陆</router-link> -->
      <span 
        @click="toggleSigninInterface(1)"
        v-if="!signinInfo.success" 
        class="signin"
      ><img src="../static/icon/signin.png" alt="" width="20px" height="20px"></span>
      <span 
        v-else-if="signinInfo.success && $route.name === 'createTopic'"
        @click="createTopic"
        class="post_article"
      ><img src="../static/icon/postArticle.png" alt="" width="20px" height="20px"></span>
      <span @click="signout()" v-else class="signout">
        <img src="../static/icon/signout.png" alt="" width="20px" height="20px">
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions }  from 'vuex'
import { TOGGLE_SIGNIN_INTERFACE, SIGNOUT } from '../store/mutation-types.js'

export default {
  computed: {
    ...mapState({
      newTopic: state => state.personal.newTopic,
      signinInfo: state => state.personal.signinInfo,
    })
  },
  watch: {
    // 发帖成功跳转到文章页面
    newTopic(val) {
      if(val.success) {
        this.$router.push({ name: 'article', params: { id: val.topic_id }})
      }
    }
  },
  methods: {
    ...mapMutations({
      toggleSigninInterface: TOGGLE_SIGNIN_INTERFACE
    }),
    ...mapActions(['createTopic']),
    signout() {
      // 登出
      this.$store.commit(SIGNOUT)
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped="" type="text/css">
#header {
  position: relative;
  width: 100%;
  height: 50px;
  font-size: 0;
  background-color: #4e4949;
  display: flex;
  // background-color: #fff;
  // border-bottom: 1px solid #e5e5e5;
  .right_btn {
    display: inline-block;
    // min-width: 20%;
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
}
</style>