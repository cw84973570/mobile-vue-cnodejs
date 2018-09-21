import Vue from 'vue'
import Router from 'vue-router'
import topics from './views/topics.vue'
import article from './views/article.vue'
import titleHeader from './views/titleHeader.vue'
import naviHeader from './views/naviHeader.vue'
import user from './views/user.vue'
// import userRelative from './views/userRelative.vue'
import signin from './views/signin.vue'
import createTopic from './views/createTopic.vue'
import messages from './views/messages.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home', // 点击主页按钮设置成不同的path来区分后退到主页的情况，这样就可以
      redirect: '/' // 实现点击主页按钮更新数据，后退到主页缓存
    },
    {
      name: 'home',
      path: '/',
      components: {
        head: naviHeader,
        main: topics
      },
      props: {
        head: (route) => ({ tab: route.query.tab }),
        main: (route) => ({ tab: route.query.tab })
      },
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'user',
      path: '/user/:loginname',
      components: {
        head: titleHeader,
        main: user
      },
      props: { head: false, main: true },
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'signin',
      path: '/signin',
      components: {
        head: titleHeader,
        main: signin
      }
    },
    {
      name: 'createTopic', // 写在/topic/:id后面会先判断id，会把create路径当作id
      path: '/topic/create',
      components: {
        head: titleHeader,
        main: createTopic
      }
    },
    {
      name: 'article',
      path: '/topic/:id',
      components: {
        head: titleHeader,
        main: article
      },
      props: { head: false, main: true},
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'messages',
      path: '/messages',
      components: {
        head: titleHeader,
        main: messages
      },
      meta: {
        keepAlive: true
      }
    }
  ]
})
