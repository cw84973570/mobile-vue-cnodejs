export function preloadImages (str) {
  // 已加载的图片数量
  let loadedImages = 0
  // 图片数组
  const newImages = []
  // 匹配图片元素
  const regexp1 = /<img\s[^>]*src=("[^"]*")[^>]*>/g
  // 匹配图片地址
  const regexp2 = /src="([^"]*)"/
  // 获取图片元素字符串数组
  const arr = str.match(regexp1) || []
  return new Promise((resolve, reject) => {
    if(arr.length === 0) {
      resolve()
    }
    for (let i = 0; i < arr.length; i++) {
      newImages.push(new Image())
      // 获得图片地址字符串，保存在捕获组中
      newImages[i].src = arr[i].match(regexp2)[1]
      newImages[i].onload = () => {
        loadedImages++
        if (loadedImages === arr.length) {
          resolve()
        }
      }
    }
  })
}