import * as types from '../mutation-types'
import { _axios } from '../../plugins/axios.js'
import { toast } from '../../common/js/toast.js'

const state = {
  messages: { // 用户的消息
    has_read_messages: [],
    hasnot_read_message: []
  }, 
  signinInfo: JSON.parse(localStorage.getItem('cnode_signin_info')) || { // 登陆的用户信息
    avatar_url: '',
    id: '',
    loginname: 'test',
    success: false
  },
  newTopic: { // 发帖成功后返回的新主题信息
    success: false,
    topic_id: ''
  },
  topicForm: { // 发帖表单
    tab: '',
    title: '',
    content: ''
  },
  isSignining: false, // 是否正在登陆
}

const mutations = {
  [types.SIGNIN] (state, response) { // 登陆
    state.signinInfo = response.data
    if(response.data.success) {
      state.isSignining = false
    }
  },
  [types.GET_MESSAGES] (state, response) { // 获取消息
    state.messages = response.data.data
  },
  [types.TOGGLE_SIGNIN_INTERFACE] (state, flag) { // 显示登陆界面
    if(flag == 0) {
      state.isSignining = false
    } else if (flag == 1) {
      state.isSignining = true
    } else if (flag ==2) {
      state.isSignining = true
      toast('请先登陆')
    }
  },
  [types.SIGNOUT] (state) { // 登出
    state.signinInfo = { 
      avatar_url: '',
      id: '',
      loginname: '',
      success: false
    }
    // state.accessToken = ''
    localStorage.removeItem('cnode_access_token')
    localStorage.removeItem('cnode_signin_info')
  },
  [types.CREATE_TOPIC] (state, response) { // 保存新主题信息
    state.newTopic = response.data
  },
  [types.UPDATE_FORM] (state, payload) { // 保存主题表单
    state.topicForm[payload.key] = payload.value
  }
}

const actions = {
  async signin (context, config) {
    if(!config.data.accesstoken) {
      toast('token不能为空')
      return
    }
    try {
      context.commit (types.SIGNIN, await _axios(config))
      toast('登陆成功！')
    } catch (error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  },
  async getMessages (context, config) {
    try {
      context.commit (types.GET_MESSAGES, await _axios(config))
    } catch (error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  },
  async createTopic (context) {
    if(!context.state.topicForm.tab) {
      toast('请选择板块')
      return
    } else if (!context.state.topicForm.title) {
      toast('标题不能为空')
      return
    } else if (!context.state.topicForm.content) {
      toast('内容不能为空')
      return
    }
    try {
      context.commit (types.CREATE_TOPIC, await _axios({
        method: 'post',
        url: '/topics',
        data: context.state.topicForm
      }))
      toast('发帖成功！')
    } catch (error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  }
}

export default {
  state,
  actions,
  mutations
}