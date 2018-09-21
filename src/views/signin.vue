<template>
  <transition name="rightin">
    <div id="signin" v-show="isSignining">
      <form @submit.prevent="submit">
        <div>
          <input type="text" placeholder="ACCESS TOKEN" v-model="form.accessToken" class="access_token">
        </div>
        <div>
          <button type="submit" class="submit_btn">登陆</button>      
        </div>
        <div>
          <button type="button" class="submit_btn" @click="hide()">取消</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState, mapMutations }  from 'vuex'
import { TOGGLE_SIGNIN_INTERFACE } from '../store/mutation-types.js'

export default {
  data () {
    return {
      form: {
        accessToken: ''
      }
    }
  },
  watch: {
    signinInfo(val) {
      // 登出初始化输入
      if(val.success === true) {
        localStorage.setItem('cnode_access_token', this.form.accessToken)
        localStorage.setItem('cnode_signin_info', JSON.stringify(val))
      } else {
        this.form.accessToken = ''
      }
    }
  },
  computed: {
    // ...mapState(['signinInfo', 'isSignining']),
    ...mapState({
      isSignining: state => state.personal.isSignining,
      signinInfo: state => state.personal.signinInfo,
    })
  },
  methods: {
    ...mapActions(['signin']),
    ...mapMutations({
      toggleSigninInterface: TOGGLE_SIGNIN_INTERFACE,
    }),
    submit() { // 登陆
      this.signin({  
        method: 'post',
        url: '/accesstoken',
        data: {
          accesstoken: this.form.accessToken
        }
      })
    },
    hide() {
      // 取消登陆清除输入
      this.toggleSigninInterface(0)
      this.form.accessToken = ''
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../common/sass/variable.scss';

.rightin-enter, .rightin-leave-to {
  transform: translate3d(100%, 0, 0);
}
.rightin-enter-active, .rightin-leave-active {
  transition: transform 0.5s;
}
#signin {
  position: fixed;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 0;
  align-items: center;
  form {
    width: 100%;
    div {
      padding: 10px;
      font-size: 0.2rem;
      .access_token {
        box-sizing:border-box;
        width: 80%;
        border: 1px solid $border-color;
        padding: 10px;
        border-radius: 5px;
        &:focus {
          outline: none;
        }
      }
      .submit_btn {
        width: 80%;
        height: 45px;
        border-radius: 5px;
        color: #fff;
        border: 1px solid $border-color;
        background: $primary-color;
        font-size: 0.2rem;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>