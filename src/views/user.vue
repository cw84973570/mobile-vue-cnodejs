<template>
  <div id="user">
    <!-- 用户页面 -->
    <!-- 用户信息 -->
    <div class="user_info" ref="test" v-show="!loading">
      <img :src="user.avatar_url" class="user_avatar">
      <div class="user_name">{{ user.loginname }}</div>
      <div class="user_detail">
        <div class="register_date">
          <span>注册时间：</span>
          <span>{{ user.create_at | formatDate }}</span>
        </div>
        <div class="user_score">
          <span>积分：</span>
          <span>{{ user.score }}</span>
        </div>
      </div>
    </div>
    <!-- 用户回复和主题 -->
    <div class="user_action" v-show="!loading">
      <div class="action_title">
        <div @click="isReply = true" :class="{ active_action: isReply }">最近回复</div>
        <div @click="isReply = false" :class="{ active_action: !isReply }">最近主题</div>
      </div>
        <transition name="reply" @enter="transition" @leave="transition"> 
          <div class="action_list reply_list" v-show="isReply" ref="replyList">
            <ul v-if="user.recent_replies.length">
              <li v-for="reply in user.recent_replies" :key="reply.id" class="topic_detail">
                <router-link :to="{ name: 'article', params: { id: reply.id }}">
                  <div>
                    <div>
                      <img :src="reply.author.avatar_url" class="author_avatar">
                      <span class="author_name">{{ reply.author.loginname }}</span>
                    </div>
                    <span class="reply_date">{{ reply.last_reply_at | formatDate }}</span>
                  </div>
                  <div>
                    <p class="topic_title">{{ reply.title }}</p>
                  </div>
                </router-link>
              </li>
            </ul>
            <ul v-else>
              <li class="no_list">暂无回复</li>
            </ul>
          </div>
        </transition>
        <transition 
          name="topic"
          @enter="transition"
          @leave="transition"
        >
          <div class="action_list topic_list" v-show="!isReply" ref="topicList">
            <ul v-if="user.recent_topics.length">
              <li v-for="topic in user.recent_topics" :key="topic.id">
                <router-link :to="{ name: 'article', params: { id: topic.id }}">
                  <div>
                    <div>
                      <img :src="topic.author.avatar_url" class="author_avatar">
                      <span class="author_name">{{ topic.author.loginname }}</span>
                    </div>
                    <span class="reply_date">{{ topic.last_reply_at | formatDate }}</span>
                  </div>
                  <div>
                    <p class="topic_title">{{ topic.title }}</p>
                  </div>
                </router-link>
              </li>
            </ul>
            <ul v-else>
              <li class="no_list">暂无主题</li>
            </ul>
          </div>
        </transition>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import loading from '../components/loading.vue'
import { mapActions, mapState } from 'vuex'
import { formatDate } from '../common/js/formatDate.js'
import IScroll from 'iscroll'

export default {
  props: {
    loginname: {
      type: String
    }
  },
  data() {
    return {
      isReply: true, // 是否是回复列表
      scrollHeight: 0, // 滚动容器元素高度
      toggleCount: 0, // 主题滚动区域切换次数
      loading: true
    }
  },
  mounted() {
    this.getUser({
      url: `/user/${this.loginname}`
    })
    // 初始化回复滚动
    // 想要添加滚动条，但是发现有时滑动不消失，滚动条超出滚动区域的bug
    this.replyScroll = new IScroll('.reply_list', {
      mouseWheel: true,
      click: true
    })
    // 初始化主题滚动
    this.topicScroll = new IScroll('.topic_list', {
      mouseWheel: true,
      click: true
    })
  },
  watch: {
    user(val) {
      // 数据成功返回，切换组件
      this.loading = false     
      this.$nextTick(() => {
        // 重新获取用户数据刷新滚动对象
        this.replyScroll.refresh()
        this.topicScroll.refresh()
        // 不设置最小高度的话根据flex: 1 1 auto,两个滚动区域会按比例压缩，
        // 而设置高度的话因为是flex布局，设置高度后滚动区域会按设置后的高度按比例压缩
        // 只有设置最小高度高度才会以最小高度为准
        if (!this.$refs.replyList.style.minHeight) {
          this.$refs.replyList.style.minHeight = `${this.$refs.replyList.offsetHeight}px`
          this.$refs.topicList.style.minHeight = `${this.$refs.replyList.offsetHeight}px`
          // 将第二个list与第一个list对齐
          this.$refs.topicList.style.top = `${-this.$refs.replyList.offsetHeight}px`
        }
      })
    },
    $route (to, from) {
      // 进入不同的用户页面的时候重新请求数据并初始化滚动条
      if(to.name !== 'user') {
        return
      }
      if (this.loginname !== this.user.loginname) {
        this.isReply = true
        this.replyScroll.scrollTo(0, 0)
        this.topicScroll.scrollTo(0, 0)
        this.loading = true
        this.getUser({
          url: `user/${this.loginname}`
        })
      } else {
        this.getUser({
          url: `user/${this.loginname}`
        })
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  filters: {
    formatDate(val) {
      return formatDate(val);
    }
  },
  methods: {
    ...mapActions(['getUser']),
    transition(el, done) {
      if (this.loginname !== this.user.loginname) {
        // 重新加载数据时立即完成过渡
        el.style.transition = 'transform'
      } else {
        if (el.style.transition && el.style.transition.search(/0.5s/) == -1) {
          el.style.transition = 'transform .5s'
        }
      }
      if (!this.isReply && this.toggleCount < 2) {
        // 刷新第二个滚动区域,因为一开始的时候第二个滚动区域的display是none
        // 所以第一次切换后需要刷新一下。
        this.toggleCount ++
        if (this.toggleCount === 2) {
          this.topicScroll.refresh()
        }
      }    
      // 仅用js过渡时必须使用done回调，否则它们会被同步调用
      // 不使用done回调display 不会变为none，after钩子也不会被调用
      // done()
    }
  },
  components: { loading }
};
</script>

<style lang='scss' scoped>
@import '../common/sass/mixin.scss';

#user {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 0;
  font-size: 0;
  .user_info {
    padding: 10px;
    .user_avatar {
      @include avatar(0.6rem);
      margin: 10px;
    }
    .user_name {
      // 不设置高度的话在数据渲染后flex布局的其他元素高度会发生变化，不能正确获得滚动区域的高度
      font-size: 0.16rem;
      line-height: 0.16rem;
      height: 0.16rem;
      font-weight: 500;
    }
    .user_detail {
      position: relative;
      height: 0.14rem;
      margin: 10px 10px 0;
      div {
        display: inline-block;
        position: absolute;
        height: 0.14rem;
        line-height: 0.14rem;
        font-size: 0.12rem;
      }
      .register_date {
        left: 0;
        top: 0;
      }
      .user_score {
        right: 0;
        top: 0;
      }
    }
  }
  .user_action {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow: hidden; // 不设置会在点击时停顿一下
    height: 0;
    .action_title {
      div {
        display: inline-block;
        width: 50%;
        height: 40px;
        line-height: 40px;
        border-top: 1px solid $border-color;
        border-bottom: 1px solid $border-color;
        color: #fff;
        font-size: 0.16rem;
        font-weight: 600;
        background: rgba(144, 209, 3, 0.6);
      }
      .active_action {
        color: $primary-color;
      }
    }
    .action_list {
      display: inline-block;
      flex: 1 1 auto;
      overflow: hidden;
      touch-action: none;
      position: relative;
      ul {
        .no_list {
          font-size: 0.2rem;
          padding: 10px;
        }
        a {
          display: block;
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid $border-color;
          div {
            position: relative;
            margin-bottom: 10px;
            .author_avatar {
              @include avatar(0.3rem);
            }
            .author_name {
              display: inline-block;
              vertical-align: middle;
              font-size: 0.14rem;
              margin-left: 4px;
            }
            .reply_date {
              vertical-align: middle;
              display: inline-block;
              position: absolute;
              right: 0;
              bottom: 0;
              top: 0;
              height: 32px;
              line-height: 32px;
              font-size: 0.14rem;
            }
          }
          .topic_title {
            line-height: 0.28rem;
            color: #000;
            font-size: 0.16rem;
            font-weight: 600;
          }
        }
      }
    }
    .topic_list {
      position: relative;
    }
    .reply-enter-active, .reply-leave-active {
      transition: transform .5s;
    }
    .reply-enter, .reply-leave-to {
      transform: translate3d(-100%, 0, 0);
    }
    .topic-enter-active, .topic-leave-active {
      transition: transform .5s;
    }
    .topic-enter, .topic-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
}
</style>