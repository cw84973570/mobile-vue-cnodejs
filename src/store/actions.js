import * as types from './mutation-types'
import { _axios } from '../plugins/axios.js'
import { toast } from '../common/js/toast.js'

export const actions = {
  async getTopics (context, config) {
    try {
      context.commit (types.GET_TOPICS, await _axios(config))
    } catch (error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  },
  async addTopics (context, config) {
    try {
      context.commit (types.ADD_TOPICS, await _axios(config))
    } catch (error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  },
  async getArticle (context, config) {
    try {
      context.commit (types.GET_ARTICLE, await _axios(config))
    } catch(error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  },
  async getUser (context, config) {
    try {
      context.commit (types.GET_USER, await _axios(config))
    } catch(error) {
      let msg = error.response.data.error_msg
      toast(msg)
    }
  }
}