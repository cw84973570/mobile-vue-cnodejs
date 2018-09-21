<template>
  <headerContainer>
    <ul @click="moveStick" ref="naviList">
      <li v-for="item in tabs" :key="item.id">
        <router-link 
          :to="{ name: 'home', query: { tab: item.tab }}" 
          exact
          :class="{ active_tab: tab === item.tab }"
        >{{ item.title }}</router-link>
      </li>    
    </ul>
    <!-- 底部横杠过渡 -->
    <div class="stick" ref="stick"></div>
  </headerContainer>
</template>

<script>
import headerContainer from "../components/headerContainer.vue"
export default {
  props: {
    tab: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {
      tabs: [
        {
          title: "全部",
          tab: "all",
          id: 0
        },
        {
          title: "精华",
          tab: "good",
          id: 1
        },
        {
          title: "分享",
          tab: "share",
          id: 2
        },
        {
          title: "问答",
          tab: "ask",
          id: 3
        },
        {
          title: "招聘",
          tab: "job",
          id: 4
        }
      ],
      marginLeft: 0
    };
  },
  mounted() {
    // 初始化横杠
    this.$refs.stick.style.width = `${this.$refs.naviList.offsetWidth / 5}px`
    this.moveStick()
  },
  watch: {
    marginLeft(val) {
      // 横杠动画
      this.$refs.stick.style.transform = `translateX(${val}px)`
      this.$refs.stick.style.transition = "all .5s"
    },
    $route(to, from) {
      this.$nextTick(() => {
        this.moveStick()
      });
    }
  },
  methods: {
    moveStick() {
      // 获取活动链接元素离左侧窗口的距离
      let activeElement = document.querySelector(".active_tab")
      this.marginLeft = activeElement ? activeElement.offsetLeft : 0;
    }
  },
  components: { headerContainer }
}
</script>

<style lang='scss' scoped>
@import '../common/sass/variable.scss';

ul {
  width: 80%;
  height: 0.5rem;
  display: inline-block;
  flex: 1 1 auto;
  .active_tab { // 活动标签显示为绿色
    color: $primary-color;
  }
  li {
    display: inline-block;
    width: 20%;
    height: 100%;
    a {
      display: inline-block;
      height: 100%;
      width: 100%;
      line-height: 0.5rem;
      font-size: 0.16rem;
      color: #ddd;
    }
  }
}
.stick {
  position: absolute;
  left: 0px;
  bottom: 0px;
  border-bottom: 3px solid $primary-color;
}
</style>