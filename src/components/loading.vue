<template>
  <div :class="{ common_loading: flag==1, topic_top_loading: flag==2, topic_bottom_loading: flag==3 }" v-show="loading">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    flag: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/sass/variable.scss";

.common_loading {
  flex: 1 1 auto;
  height: 0;
  width: 100%;
  padding: 20px 0;
  .loading {
    margin: 0 auto;
    width: 40px;
    height: 40px;
    border: 6px solid $primary-color;
    border-right-color: transparent;
    border-radius: 50%;
    animation: loading 1s infinite linear;
  }
}
.topic_top_loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  z-index: 100;
  .loading {
    margin: 0 auto;
    width: 30px;
    height: 30px;
    border: 4px solid $primary-color;
    border-right-color: transparent;
    border-radius: 50%;
    animation: loading 1s infinite linear;
  }
}
.topic_bottom_loading {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  z-index: 100;
  .loading {
    margin: 0 auto;
    width: 30px;
    height: 30px;
    border: 4px solid $primary-color;
    border-right-color: transparent;
    border-radius: 50%;
    animation: loading 1s infinite linear;
  }
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>