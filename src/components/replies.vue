<template>
  <div class="replies">
    <div class="replies_count">
      <span v-if="replies.length">共有{{ replies.length }}条回复</span>
      <span v-else>暂无回复</span>
    </div>
    <ul>
      <li v-for="(reply, index) in replies" :key="reply.id" class="reply_wrapper">
        <div class="author_info">
          <router-link :to="{ name: 'user', params: { loginname: reply.author.loginname }}">
            <span class="reply_author">{{ reply.author.loginname }}</span>
          </router-link>
          <span class="reply_date">12天前</span>
          <span class="isauthor" v-if="author===reply.author.loginname">作者</span>
          <span class="reply_index">{{ index + 1 }}楼</span>
        </div>
        <p v-html="reply.content" class="reply_content markdown-body"></p>
        <div class="reply_action">
          <div class="thumbs_up">
            <span 
              @click="thumbsup(reply.ups, reply.id)" 
              :class="{ icon_uped: isUped(reply.ups) }"
              class="thumbs_up_icon"
            >
            </span>
            <span 
              v-if="reply.ups.length" 
              class="thumbs_up_count"
              :class="{ count_uped: isUped(reply.ups) }"
            >{{ reply.ups.length }}</span>
          </div>
          <span class="reply_btn" @click="replying(reply.id)"></span>
        </div>
        <reply-box
          :article-id="articleId"
          :reply-id="reply.id" 
          :author = reply.author.loginname
          v-if="reply.id==currentId"
    ></reply-box>    
      </li>
    </ul>
    <div class="bottom-reply">
      <reply-box :article-id="articleId"></reply-box>
    </div>
  </div>
</template>

<script>
import replyBox from './replyBox.vue'
import { mapState, mapMutations } from 'vuex'
import { TOGGLE_SIGNIN_INTERFACE } from '../store/mutation-types.js'
import { toast } from '../common/js/toast.js'

export default {
  props: {
    replies: {
      type: Array,
      default: function() {
        return []
      }
    },
    author: { // 作者名称
      type: String
    },
    articleId: { // 文章id
      type: String
    }
  },
  data () {
    return {
      replyId: '', // 评论的ID
      currentId: '' // 正在回复的评论ID
    }
  },
  watch: {
    replies() {
      this.currentId = ''
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
    isUped(ups) { // 判断是否点过赞（用户ID是否在点赞数组中）
      return ups.includes(this.signinInfo.id)
    },
    async thumbsup(ups, id) { // 点赞
      if(!this.signinInfo.success) { // 未登陆则弹出登陆页面
        this.toggleSigninInterface(2)
      } else {
        let res = null
        try {
          res = await this.$axios({
            method: 'post',
            url: `/reply/${id}/ups`
          })
        } catch (error) {
          let msg = error.response.data.error_msg
          toast(msg)
          return
        }
        if (res.data.success === true) {
          if(res.data.action === 'up') { // 点赞成功将用户ID加入到点赞数组中 
            ups.push(this.signinInfo.id)
          } else if (res.data.action === 'down') { // 取消点赞将用户ID从点赞数组中移除
            ups.splice(ups.indexOf(this.signinInfo.id), 1)
          }
        }
      }
    },
    replying(id) {
      if(!this.signinInfo.success) { // 未登陆则弹出登陆页面
        this.toggleSigninInterface(2)
      } else {
        if (!this.currentId) {
          this.currentId = id
          this.$nextTick(() => {
            this.$parent.articleScroll.refresh()
          })
        } else {
          if(this.currentId === id) {
            this.currentId = ''
            this.$nextTick(() => {
              this.$parent.articleScroll.refresh()
            })
          } else {
            this.currentId = id
          }
        }
      }
    }
  },
  components: { replyBox }
}
</script>

<style lang='scss'>
@import '../common/sass/variable.scss';

.replies {
  text-align: left;
  .replies_count {
    padding: 10px;   
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
  }
  .reply_wrapper {
    span {
      display: inline-block;
    }
    padding: 10px 10px;
    border-bottom: 1px solid $border-color;
    .author_info {
      position: relative;
      .reply_author {
        font-size: 0.14rem;
        color: $primary-color;
      }
      .reply_date {
        margin: 0 5px;
      }
      .isauthor {
        color: #08c;
      }
      .reply_index {
        position: absolute;
        right: 10px;
      }
    }
    .reply_content {
      padding: 20px 0 30px;
      line-height: 0.16rem;
      font-size: 0.14rem;
      .markdown-text img {
        max-width: 100%;
      }
    }
    .reply_action {
      position: relative;
      text-align: right;
      font-size: 0px;
      .thumbs_up {
        display: inline-block;
        position: absolute;
        text-align: right;
        right: 30px;
        .thumbs_up_icon {
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          background-repeat: no-repeat;
          background-image: url("../static/icon/thumbsUp.svg");//引入svg文件
          background-size: 100% 100%;
        }
        .icon_uped {
          background-image:url("../static/icon/thumbsUped.svg");
        }
        .thumbs_up_count {
          display: inline-block;
          vertical-align: middle;
          font-size: 0.14rem;
          line-height: 0.14rem;
          height: 0.14rem;
          margin: 0 5px;
        }
        .count_uped {
          color: $primary-color;
        }
      }
      .reply_btn {
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          background-repeat: no-repeat;
          background-image: url("../static/icon/reply.svg");
          background-size: 100% 100%;
      }
    }
  }
  .bottom-reply {
    padding: 0px 10px 10px;
  }
}
</style>