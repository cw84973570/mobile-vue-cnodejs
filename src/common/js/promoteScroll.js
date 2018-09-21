export const promoteScroll = {
  pointX: 0, // 接触点离页面左边的距离
  pointY: 0, // 接触点离页面上边的距离
  absDistX: 0, // 水平移动的绝对距离
  absDistY: 0, // 垂直移动的绝对距离
  regexObj: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/, // 不禁止默认行为的元素
  handleNativeScroll: function (e) {
    const point = e.touches ? e.touches[0] : e
    this.absDistX = Math.abs(point.pageX - this.pointX)
    this.absDistY = Math.abs(point.pageY - this.pointY)
    this.pointX = point.pageX
    this.pointY = point.pageY
    if (this.absDistX > this.absDistY) {
      // 判断是否是横向滑动
      // console.log('horizontal')
      return
    }
    // console.log('vertical')
    e.preventDefault()
  },
  handleEvent: function (e) {
    if (this.regexObj.test(e.target.nodeName)) {
      return
    }
    switch (e.type) {
      case 'touchstart':
        if (e.target.nodeName == 'CODE' || e.target.nodeName == 'PRE') {
          return
        }
        e.preventDefault()
        break
      case 'touchmove':
        this.handleNativeScroll(e)
        break
    }
  }
}