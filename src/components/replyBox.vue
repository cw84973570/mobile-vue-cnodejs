<template>
  <div class="reply_box">
      <form @submit.prevent="reply" >
        <div class="control_wrapper">
          <textarea name="" id="" cols="30" rows="5" v-model="content" ref="content"></textarea>
        </div>
        <div class="control_wrapper">
          <button type="submit" class="reply_btn">回复</button>
        </div>
      </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { TOGGLE_SIGNIN_INTERFACE } from '../store/mutation-types.js'
import { toast } from '../common/js/toast.js'

export default {
  props: {
    articleId: {
      type: String
    },
    replyId: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      content: ''
    }
  },
  mounted() {
    if(this.replyId) {
      this.content = `@${this.author} `
      this.$refs.content.focus()
    }
  },
  computed: {
    ...mapState({
      signinInfo: state => state.personal.signinInfo
    })
  },
  methods: {
    ...mapMutations({
      toggleSigninInterface: TOGGLE_SIGNIN_INTERFACE
    }),
    ...mapActions(['getArticle']),
    async reply() {
      if(!this.signinInfo.success) {
        this.toggleSigninInterface(2)
        return
      }
      let data = {
        content: this.content
      }
      if(this.replyId) {
        data.reply_id = this.replyId
      }
      try {
        await this.$axios({
          method: 'post',
          url: `/topic/${this.articleId}/replies`,
          data: data
        })
        toast('回复成功')
        this.content = ''
        this.getArticle({
          method: 'get',
          url: `/topic/${this.articleId}`
        })
      } catch (error) {
        let msg = error.response.data.error_msg
        toast(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

@import  '../common/sass/variable.scss';
.reply_box {
  height: 150px;
  box-sizing: border-box;
  padding: 20px 0;
  background: #fff;
  .control_wrapper {
    position: relative;
    width: 100%;
    min-height: 30px;
    &:first-child {
        padding-bottom: 10px;
      }
    textarea {
      box-sizing: border-box;
      width: 100%;
      padding: 4px;
      resize: none; // 禁止拉伸
      border: 1px solid $border-color;
      border-radius: 8px;
      -webkit-appearance: none; // 去除输入边框阴影
      &:focus { // 去除焦点轮廓线
          outline: none;
      }
    }
    .reply_btn {
      position: absolute;
      right: 0;
      height: 32px;
      width: 70px;
      background-color: $primary-color;
      border: 1px solid $border-color;
      color: #fff;
      border-radius: 4px;
      &:focus {
          outline: none;
        }
    }
  }
}
</style>