import Vue from 'vue'
import Vuex from 'vuex'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'
import personal from './modules/personal'

Vue.use(Vuex)

/* eslint-disable-next-line no-unused-vars */ 
const debug = process.env.NODE_ENV !== 'production'

const state = {
  topics: [], // 首页的文章主题
  article: { // 文章信息
    author: {
      avatar_url: '',
      loginname: ''
    }
  },
  user: { // 用户信息
    loginname: '',
    recent_replies: [],
    recent_topics: []
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    personal
  }
})