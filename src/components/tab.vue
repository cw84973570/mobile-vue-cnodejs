<template>
    <span class="tab advanced" v-if="topic.top || topic.good">{{ topic.top?'置顶':'精华' }}</span>
    <span class="tab normal" v-else>{{ translateTab(topic.tab) }}</span>
</template>

<script>
export default {
  props: {
    topic: {
      Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    translateTab(tab) {
      switch (tab) {
        case "ask":
          return "问答";
        case "share":
          return "分享";
        case "good":
          return "精华";
        case "job":
          return "招聘";
        case "dev":
          return "测试";
        default:
          return "未知";
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../common/sass/variable.scss';

.tab {
  display: inline-block;
  vertical-align: middle;
  padding: 3px 4px;
  border-radius: 3px;
  background: $primary-color;
  font-size: 0.12rem;
}
.advanced {
  background: $primary-color;
  color: white;
}
.normal {
  background: $border-color;
  color: #999;
}
</style>
