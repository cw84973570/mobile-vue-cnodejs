<template>
  <div id="footer">
    <ul class="footer-list">
      <li>
        <a href="javascript:void(0);" @click="jumpPage('home')">
          <img src="../static/icon/home.png" alt="" width="16px" height="16px">
          <span>首页</span>
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="jumpPage('createTopic')">
          <img src="../static/icon/postArticle.png" alt="" width="16px" height="16px">
          <span>发帖</span>
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="jumpPage('messages')">
          <img src="../static/icon/message.png" alt="" width="16px" height="16px">
          <span>消息</span>
        </a>
        <div class="unchecked_message_count" v-if="uncheckedMessage>0">{{ messages.hasnot_read_messages.length }}</div>
      </li>
      <li>
        <a href="javascript:void(0);" @click="jumpPage('user', { loginname: signinInfo.loginname })">
          <img src="../static/icon/myself.png" alt="" width="16px" height="16px">
          <span>我的</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapMutations } from "vuex"
import { TOGGLE_SIGNIN_INTERFACE } from "../store/mutation-types.js"

export default {
  data() {
    return {
      uncheckedMessage: 0
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.fullPath === "/home") {
      next()
    }
    if (this.signinInfo.success === false) {
      this.signinInfo(2)
      next(false)
    }
  },
  watch: {
    messages(val) {
      this.uncheckedMessage = val.hasnot_read_messages.length
    }
  },
  computed: {
    ...mapState({
      signinInfo: state => state.personal.signinInfo,
      messages: state => state.personal.messages
    })
  },
  methods: {
    ...mapMutations({
      toggleSigninInterface: TOGGLE_SIGNIN_INTERFACE
    }),
    jumpPage(name, params) {
      if (name === "home") {
        this.$router.push({ path: "/home" })
        return
      }
      if (!this.signinInfo.success) {
        this.toggleSigninInterface(2)
      } else {
        params = params || {}
        this.$router.push({ name: name, params: params })
      }
    }
  }
};
</script>

<style lang="scss" scoped="" type="text/css">
#footer {
  position: relative;
  height: 50px;
  font-size: 0;
  width: 100%;
  background-color: #4e4949;
  ul {
    li {
      display: inline-block;
      position: relative;
      width: 25%;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.16rem;
      color: #ddd;
      .unchecked_message_count {
        position: absolute;
        top: 4px;
        left: 50%;
        z-index: 2;
        padding: 1px 4px;  
        border-radius: 50%;
        text-align: center;
        line-height: 0.12rem;
        font-size: 0.12rem;
        opacity: 0.9;
        color: #fff;
        background: red;
      }
      a {
        display: block;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        font-size: 0;
        color: #ddd;
        padding: 8px 0;
        img {
          display: block;
          margin: 0 auto 6px;
        }
        span {
          display: block;
          font-size: 0.12rem;
          height: 0.12rem;
          line-height: 0.12rem;
        }
      }
    }
  }
}
</style>

