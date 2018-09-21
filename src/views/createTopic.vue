<template>
  <div id="create_topic">
    <form action="">
      <div class="topic_tab">
        <select name="" id="" v-model="tab">
          <option value="">请选择板块</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
          <option value="dev">开发</option>
        </select>
      </div>
      <div class="topic_title">
        <input type="text" placeholder="请输入标题" v-model="title">
      </div>
      <div class="topic_content">
        <textarea name="" id="" placeholder="请输入内容" v-model="content"></textarea>
      </div>
    </form>
  </div>
</template>

<script>
import { UPDATE_FORM } from '../store/mutation-types.js'

export default {
  computed: {
    tab: {
      get () {
        // 模块中的数据要加上模块的名称
        return this.$store.state.personal.topicForm.tab
      },
      set (value) {
        // commit和dispatch和根模块一样
        this.$store.commit(UPDATE_FORM, { key: 'tab', value: value })
      }
    },
    title: {
      get () {
        return this.$store.state.personal.topicForm.title
      },
      set (value) {
        this.$store.commit(UPDATE_FORM, { key: 'title', value: value})
      }
    },
    content: {
      get () {
        return this.$store.state.personal.topicForm.content
      },
      set (value) {
        this.$store.commit(UPDATE_FORM, { key: 'content', value: value})
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../common/sass/mixin.scss';

#create_topic {
  flex: 1 1 auto;
  display: flex;
  font-size: 20px;
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    .topic_tab {
      padding: 5px 10px;
      border-bottom: 1px solid $border-color;
      select {
        width: 100%;
        height: 30px;
        font-size: 0.16rem;
        border: 0;
        background: none; // 取消选择框的默认背景样式
        &:focus {
          outline: none;
        }
      }
    }
    .topic_title {
      padding: 5px 10px;
      border-bottom: 1px solid $border-color;
      input {
        width: 100%;
        height: 30px;
        padding-left: 5px;
        font-size: 0.16rem;
        &:focus {
          outline: none;
        }
      }
    }
    .topic_content {
      flex: 1 1 auto;
      height: 0;
      padding: 5px 10px;
      textarea {
        width: 100%;
        height: 100%;
        padding-left: 5px;
        border: 0;
        font-size: 0.16rem;
        line-height: 0.24rem;
        resize: none;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>