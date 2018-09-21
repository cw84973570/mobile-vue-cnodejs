import * as types from './mutation-types'

export const mutations = {
  [types.GET_TOPICS] (state, response) { // 获取主题
    state.topics = response.data.data
  },
  [types.ADD_TOPICS] (state, response) { // 增加主题
    state.topics.push(...response.data.data) // 数组扩展运算符
  },
  [types.GET_ARTICLE] (state, response) { // 获取文章
    state.article = response.data.data
  },
  [types.GET_USER] (state, response) { // 获取用户
    state.user = response.data.data
  }
}