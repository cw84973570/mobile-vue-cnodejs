<template>
  <div class="user_action" ref="userAction">
    <div class="action_title">
      <div @click="isFirst = true" :class="{ active_action: isFirst }">
        <slot name="first_title"></slot>
      </div>
      <div 
        @click="toggleScroll(false)" 
        :class="{ active_action: !isFirst }"
      >
        <slot name="second_title"></slot>
      </div>
    </div>
      <transition name="first" @enter="transition" @leave="transition"> 
        <div class="action_list first_list" v-show="isFirst" ref="firstList">
          <ul>
            <slot name="first_list"><li>暂无内容</li></slot>
          </ul>
        </div>
      </transition>
      <transition 
        name="second"
        @enter="transition"
        @leave="transition"
      >
        <div class="action_list second_list" v-show="!isFirst" ref="secondList">
          <ul>
            <slot name="second_list"><li>暂无内容</li></slot>
          </ul>
        </div>
      </transition>
  </div>
</template>

<script>
import IScroll from 'iscroll'

export default {
  props: {
    info: {
      type: Object
    },
    scrollHeight: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      isFirst: true,
      toggleCount: 0
    }
  },
  mounted() {
    this.firstScroll = new IScroll('.first_list', {
      mouseWheel: true,
      click: true

    })
    this.secondScroll = new IScroll('.second_list', {
      mouseWheel: true,
      click: true
    })
  },
  methods: {
    transition(el, done) {
        // 虽然第一个list不需要钩子，但是纯CSS过渡完成后会将display设置为none，
        // 所以要给它设置一个不执行任何代码的过渡中钩子
        if (!this.isFirst && this.toggleCount < 2) {
        // 刷新第二个滚动区域,因为一开始的时候第二个滚动区域的display是none
        // 所以第一次切换后需要刷新一下。
        this.toggleCount ++
        if (this.toggleCount === 2) {
          this.secondScroll.refresh()
        }
      }  
    },
    toggleScroll(isFirst) {
      // 不设置最小高度的话根据flex: 1 1 auto,两个滚动区域会按比例压缩，
      // 而设置高度的话因为是flex布局，设置高度后滚动区域会按设置后的高度按比例压缩
      // 只有设置最小高度高度才会以最小高度为准
      // 在第一次切换设置最小高度
      if(!isFirst && this.toggleCount === 0) {
        this.$refs.firstList.style.minHeight = `${this.$refs.firstList.offsetHeight}px`
        this.$refs.secondList.style.minHeight = `${this.$refs.firstList.offsetHeight}px`
        // 将第二个list与第一个list对齐
        this.$refs.secondList.style.top = `${-this.$refs.firstList.offsetHeight}px`
      }
      this.isFirst = isFirst
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../common/sass/mixin.scss';
.user_action {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 0;
  overflow: hidden; // 不设置会在点击时停顿一下
  .action_title {
    font-size: 0;
    div {
      display: inline-block;
      width: 50%;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 0.16rem;
      font-weight: 600;
      background: rgba(144, 209, 3, 0.6);
    }
     .active_action {
      color: $primary-color;
    }
  }
  .action_list {
    display: inline-block;
    flex: 1 1 auto;
    overflow: hidden;
    touch-action: none;
    ul {
      li {
        padding: 10px;
        font-size: 0.2rem;
      }
    }
  }
  .second_list {
    position: relative;
  }
  .first-enter-active, .first-leave-active {
    transition: transform .5s;
  }
  .first-enter, .first-leave-to {
    transform: translate3d(-100%, 0, 0);
  }
  .second-enter-active, .second-leave-active {
    transition: transform .5s;
  }
  .second-enter, .second-leave-to {
    transform: translate3d(100%, 0, 0);
  }
}
</style>