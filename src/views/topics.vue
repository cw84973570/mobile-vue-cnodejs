<template>
  <div id="topics">
    <!-- 主题列表页面 -->
    <!-- 下拉加载动画 -->
    <loading :loading="isloadingTop" :flag="2"></loading>
    <iscroll-view 
      v-show="!loading"
      class="scroll-view" 
      @pullUp="load" 
      @pullDown="refresh" 
      ref="iscroll"
      :options="{ mouseWheel: true, click: true, scrollbars: 'custom', fadeScrollbars: true }"
    >
      <ul>
        <li v-for="topic in topics" :key="topic.id" >
          <router-link :to="{ name: 'article', params: { id: topic.id }}" class="topic">
            <div>
              <tab :topic="topic"></tab>
              <img :src="topic.author.avatar_url" class="avatar">
              <div>
                <!-- 小屏幕适配 -->
                <span class="author scale_fontsize">{{ topic.author.loginname }}</span><br>
                <span class="reply-count">{{ topic.reply_count}}</span>
                <span class="separator">/</span>
                <span class="visit-count">{{ topic.visit_count}}</span>
              </div>
              <div class="post_time">
                <span>发表于</span><br>
                <span>{{ topic.create_at | formatDate }}</span>
              </div>
              <div class="reply_time">
                <span>最后回复</span><br>
                <span>{{ topic.last_reply_at | formatDate }}</span>
              </div>
            </div>
            <p class="topic_title">{{ topic.title }}</p>
          </router-link>
        </li>
      </ul>
    </iscroll-view>
    <!-- 上拉加载动画 -->
    <loading :loading="isloadingBottom" :flag="3"></loading>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import tab from "../components/tab";
import { formatDate } from "../common/js/formatDate";
import loading from "../components/loading";

export default {
  props: {
    tab: {
      type: String,
      default: "all"
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      page: 1, // 加载的页数
      isloadingTop: false, // 是否在下拉加载
      isloadingBottom: false, // 是否在上拉加载
      loading: true // 是否加载
    };
  },
  created() {
    this.getTopics({
      url: "/topics",
      params: {
        page: this.page,
        tab: this.tab,
        limit: 20
      }
    });
  },
  watch: {
    topics(val) {
      if (this.loading == true) {
        // 切换路由加载
        this.loading = false
      } else {
        if (this.page === 1) {
          // 加载完毕隐藏顶部加载动画
          this.isloadingTop = false
          // 切换标签滚动到顶部
        } else {
          // 加载完毕隐藏顶部加载动画
          this.isloadingBottom = false
        }
      }
      const iscroll = this.$refs.iscroll
      iscroll.refresh()
    },
    $route(to, from) {
      // 点击
      if(to.name !== 'home' || from.name !== 'home') {
          // 后退缓存,排除点击到主页的情况
        if(to.redirectedFrom !== '/home') {
          return
        }
      }
      if(from.name == 'home' && to.name == 'home') {
        // 切换标签重新请求数据
        this.$refs.iscroll.scrollTo(0, 0)
      }
      if(to.name == 'home' && to.fullPath == '/') {
        this.$refs.iscroll.scrollTo(0, 0)
      }
      this.loading = true
      this.page = 1
      this.getTopics({
        url: "/topics",
        params: {
          page: this.page,
          tab: this.tab,
          limit: 20
        }
      })
    }
  },
  computed: {
    ...mapState(["topics"])
  },
  methods: {
    ...mapActions(["getTopics", "addTopics"]),
    refresh(iscroll) {
      // 下拉刷新
      this.isloadingTop = true
      this.page = 1;
      this.getTopics({
        url: "/topics",
        params: {
          page: this.page,
          tab: this.tab,
          limit: 20
        }
      });
    },
    load(iscroll) {
      // 上拉加载
      this.isloadingBottom = true
      this.addTopics({
        url: "/topics",
        params: {
          page: ++this.page,
          tab: this.tab,
          limit: 20
        }
      });
    }
  },
  filters: {
    formatDate(val) {
      return formatDate(val);
    }
  },
  components: { tab, loading }
};
</script>

<style lang='scss' scoped type="text/css">
@import "../common/sass/mixin.scss";

#topics {
  position: relative;
  flex: 1 1 auto;
  // flex布局不能阻止父元素的孙子元素将子元素撑开，
  // 如果孙子元素超过子元素的内容，那么必须在子元素上嵌套flex布局让内容依次包含。
  // 如果不给此元素设置flex布局，那么它占据的高度还是剩余的高度，但是自身的高度
  // 为子元素撑开的高度，优先计算高度再计算overflow属性，所以子元素不会隐藏。
  // 还有一种方法是把父元素的高度设置为0，就可以设置滚动容器的高度了
  height: 0;
  .loading {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
    color: $primary-color;
    font-size: 0.2rem;
  }
  .refresh-topics {
    top: 20px;
  }
  .add-topics {
    bottom: 20px;
  }
  .scroll-view {
    /* -- Attention: This line is extremely important in chrome 55+! -- */
    touch-action: none;
    // 占据剩余空间，如果超出则缩放该元素
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #eee;
    ul {
      background: white;
      font-size: 0;
      .topic {
        display: block;
        position: relative;
        text-align: left;
        min-height: 0.8rem;
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        div {
          position: relative;
          .avatar {
            @include avatar(0.3rem);
            margin: 0 4px;
          }
          div {
            display: inline-block;
            vertical-align: middle;
            .author {
              vertical-align: middle;
              display: inline-block;
              margin-bottom: 2px;
            }
            .reply-count {
              font-size: 0.14rem;
              color: $primary-color;
            }
            .separator {
              font-size: 0.14rem;
            }
            .visit-count {
              font-size: 0.12rem;
              color: #b4b4b4;
            }
          }
          .post_time {
            width: 0.6rem;
            line-height: 0.14rem;
            position: absolute;
            top: 0;
            right: 0.6rem;
            span {
              font-size: 0.12rem;
            }
          }
          .reply_time {
            width: 0.6rem;
            line-height: 0.14rem;
            position: absolute;
            top: 0;
            right: 0;
            span {
              font-size: 0.12rem;
            }
          }
        }
        .topic_title {
          display: inline-block;
          margin-top: 10px;
          line-height: 0.28rem;
          font-weight: bold;
          color: #000;
          font-size: 0.16rem;
        }
      }
    }
  }
}
</style>