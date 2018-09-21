export function formatDate(rawDate) {
  let time = (Date.parse(new Date) - Date.parse(rawDate))/1000/60
  switch(true) {
    case time < 1:
      return '刚刚'
    case time < 60:
      return `${parseInt(time)}分钟前`
    case time < 1440:
      return `${parseInt(time/60)}小时前`
    case time < 43200:
      return `${parseInt(time/1440)}天前`
    case time < 518400:
      return `${parseInt(time/43200)}个月前`
    default:
      return `${parseInt(time/518400)}年前`
  }
}