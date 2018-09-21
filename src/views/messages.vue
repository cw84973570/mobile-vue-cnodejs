<template>
  <div id="message">
    <two-scroll ref="scrollChild" v-show="!loading">
      <!-- 滚动标题 -->
      <span slot="first_title">已读回复</span>
      <span slot="second_title" @click="markAll">未读回复</span>
      <!-- 第一个list -->
      <template slot="first_list">
        <li v-for="message in messages.has_read_messages" :key="message.id">
          <div class="reply_info">
            <div>
              <router-link :to="{ name: 'user', params: { loginname: message.author.loginname }}">
                <img :src="message.author.avatar_url" class="author_avatar">
                <span class="author_name">{{ message.author.loginname }}</span>
              </router-link>
              <span class="reply_date"> {{ message.create_at | formatDate }}</span>
              <span>回复了你的话题</span>
            </div>
            <div>
              <router-link :to="{ name: 'article', params: { id: message.topic.id }}">
                <p class="article_title">{{ message.topic.title }}</p>
              </router-link>
            </div>
          </div>
          <div v-html="message.reply.content" class="markdown-body"></div>
        </li>
      </template>
      <!-- 第二个list -->
      <template slot="second_list">
        <li v-for="message in messages.hasnot_read_messages" :key="message.id">
          <div class="reply_info">
            <div>
              <router-link :to="{ name: 'user', params: { loginname: message.author.loginname }}">
                <img :src="message.author.avatar_url" class="author_avatar">
                <span class="author_name">{{ message.author.loginname }}</span>
              </router-link>
              <span class="reply_date"> {{ message.create_at | formatDate }}</span>
              <span>回复了你的话题</span>
            </div>
            <div>
              <router-link :to="{ name: 'article', params: { id: message.topic.id }}">
                <p class="article_title">{{ message.topic.title }}</p>
              </router-link>
            </div>
          </div>
          <div v-html="message.reply.content" class="markdown-body"></div>
        </li>
      </template>
    </two-scroll>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import twoScroll from "../components/twoScroll"
import { formatDate } from "../common/js/formatDate.js"
import loading from '../components/loading.vue'

export default {
  data() {
    return {
      accessToken: '',
      loading: true
    }
  },
  created() {
    // 应该在登陆的时候请求数据,因为消息会更新所以这里请求数据比较好
    this.getMessages({
      method: "get",
      url: "/messages",
      params: {
        accesstoken: true
      }
    })
  },
  watch: {
    messages(val) {
      this.loading = false
      this.$nextTick(() => {
        // 数据更新刷新第一个滚动对象
        this.$refs.scrollChild.firstScroll.refresh();
      });
    },
    $route (to, from) {
      if(this.accessToken && !localStorage.getItem('cnode_access_token')) {
        // 登出滚动初始化
        this.$refs.scrollChild.firstScroll.scrollTo(0, 0)
        this.$refs.scrollChild.secondScroll.scrollTo(0, 0)
        this.$refs.scrollChild.isFirst = true
        this.accessToken = ''
        this.loading = true
        return
      }
      if(to.name !== 'messages') {
        return
      }
      this.accessToken = this.accessToken || localStorage.getItem('cnode_access_token')
      this.getMessages({
        method: "get",
        url: "/messages",
        params: {
          accesstoken: true
        }
      })
    }
  },
  computed: {
    ...mapState({
      messages: state => state.personal.messages
    })
  },
  filters: {
    formatDate(val) {
      return formatDate(val);
    }
  },
  methods: {
    ...mapActions(["getMessages"]),
    async markAll() {
      if (this.messages.hasnot_read_messages.length == 0) {
        let res = null
        try {
          res = await this.$axios({
            method: "post",
            url: "/message/mark_all"
          })
        } catch (error) {
          res = error.response
        }
        // 标记已读成功后重新请求数据
        if (res.data.success) {
          this.getMessages({
            method: "get",
            url: "/messages",
            params: {
              accesstoken: true
            }
          });
        }
      }
    }
  },
  components: { twoScroll, loading }
};
</script>

<style lang="scss" scoped>
@import "../common/sass/mixin.scss";
@mixin spanStyle($height) {
  // 单行文字样式
  display: inline-block;
  font-size: $height;
  line-height: $height;
  height: $height;
  vertical-align: middle;
  margin: 0 4px;
}

#message {
  flex: 1 1 auto;
  height: 0;
  display: flex;
  flex-direction: column;
  li {
    padding: 20px 10px 0px 20px;
    text-align: left;
    font-size: 0;
    border-bottom: 1px solid $border-color;
    .reply_info {
      span {
        @include spanStyle(0.12rem);
      }
      div {
        margin-bottom: 10px;
      }
      .author_avatar {
        @include avatar(0.2rem);
      }
      .author_name {
        @include spanStyle(0.14rem);
        margin: 0 4px;
        color: $primary-color;
      }
      .reply_date {
        color: #7e8c8d;
      }
      .article_title {
        line-height: 0.16rem;
        font-size: 0.16rem;
        color: $primary-color;
      }
    }
  }
}
</style>