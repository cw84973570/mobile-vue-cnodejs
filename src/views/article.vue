<template>
  <div id="article_wrapper" ref="scrollContainer">
    <!-- 文章页面 -->
    <div class="article" v-show="!loading">
      <div class="title">{{ article.title }}</div>
      <div class="meta_info">
        <router-link :to="{ name: 'user', params: { loginname: article.author.loginname }}" v-if="article.author.loginname">
          <img :src="article.author.avatar_url" class="avatar">
          <span class="author">{{ article.author.loginname }}</span>
        </router-link>
        <span>发布于</span>
        <span>{{ article.create_at | formatDate }}</span>
        <tab :topic="article"></tab>
      </div>
      <div class="markdown-body" v-html="article.content"></div> 
      <replies :replies="article.replies" :author="article.author.loginname" :article-id="id"></replies>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import tab from '../components/tab.vue'
import replies from '../components/replies.vue'
import loading from '../components/loading.vue'
import IScroll from 'iscroll'
import { mapState, mapActions } from 'vuex'
import { preloadImages }  from '../common/js/preloadImages.js'
import { formatDate } from '../common/js/formatDate.js'
import { promoteScroll } from '../common/js/promoteScroll.js'

export default {
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      title: '文章',
      loading: true, // 是否在初始化加载
      currentId: ''
    }
  },
  mounted() {
    // 初始化数据
    this.getArticle({
      method: 'get',
      url: `/topic/${this.id}`
    })
    this.currentId = this.id
    // 初始化滚动对象
    this.articleScroll = new IScroll('#article_wrapper', {
      click: true, // 设置为true桌面平台会出现双击,false则移动端不能点击
      mouseWheel: true,
      scrollbars: true,
      fadeScrollbars: true,
      preventDefault: false
    })
    // 横向滑动不禁止原生滑动，主要是针对代码块的横向滑动
    this.$refs.scrollContainer.addEventListener('touchmove', promoteScroll)
    this.$refs.scrollContainer.addEventListener('touchstart', promoteScroll)
    this.articleScroll = new IScroll('#article_wrapper', {
      click: true,
      mouseWheel: true,
      scrollbars: 'custom',
      fadeScrollbars: true,
      preventDefault: false
    })
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener('touchmove', promoteScroll)
    this.$refs.scrollContainer.removeEventListener('touchstart', promoteScroll)
  },
  watch: {
    article(val) {
      // dom渲染完毕后刷新
      this.loading = false
      this.$nextTick(() => {
        this.articleScroll.refresh()
      })
      // 获取文章和评论的markdown内容
      const str = this.getText()
      // 加载完markdown内容中的图片后刷新
      preloadImages(str).then(() => {
        this.articleScroll.refresh()
      })
    },
    $route(to, from) {
      if(to.name != 'article') {
        return
      }
      if(this.currentId != this.id) {
        this.articleScroll.scrollTo(0, 0)
        this.loading = true
        this.currentId = this.id
      }
      this.getArticle({
        method: 'get',
        url: `/topic/${this.id}`
      })
    }
  },
  computed: {
    ...mapState(['article'])
  },
  methods: {
    ...mapActions(['getArticle']),
    getText() {
      let str = this.article.content
      const arr = this.article.replies
      arr.forEach(function(element) {
        str = str.concat(element.content)
      })
      return str
    }
  },
  filters: {
    formatDate(val) {
      return formatDate(val)
    }
  },
  components: { tab, replies, loading }
}
</script>

<style lang='scss' scoped>
  @import '../common/sass/mixin.scss';

  #article_wrapper {
    width: 100%;
    position: relative;
    touch-action: none;
    flex: 1 1 auto;
    overflow: hidden;
    .article {
      // 不设置position会导致滚动高度有时会小于页面高度
      position: absolute;
      width: 100%;
      font-size: 0.12rem;
      .title {
        line-height: 0.28rem;
        font-size: 0.24rem;
        font-weight: bold;
        padding: 10px;
      }
      .meta_info {
        a {
          display: inline-block;
          .avatar {
            @include avatar(0.3rem);
            margin: 0 4px;
          }
          .author {
            margin: 0 4px;
            font-size: 0.14rem;
            color: $primary-color;
          }
        }
        span {
          display: inline-block;
          line-height: 0.12rem;
          margin: 0 2px;
          font-size: 0.12rem;
        }
        &:after {
          content: '';
          margin: 10px auto 0;
          width: 80%;
          display: block;
          border: 1px dotted $border-color;
        }
      }
      .markdown-body {
        text-align: left;
        padding: 10px;
        pre {
          overflow: hidden;
        }
      }
    }
  }
</style>