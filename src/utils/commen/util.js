export const formatDate = (date) => {
  var dateee = new Date(date).toJSON()
  return new Date(dateee).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

export function isMobile() {
  const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ?
    `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null
}
export const strReplace = (str, frontLength, tailLength, replceChar, replaceLenght) => {
  if (str && str.length > frontLength + tailLength) {
    let frontStr = str.substr(0, frontLength);
    let replaceStr = replceChar.padEnd(replaceLenght, replceChar);
    let tailStr = str.substr(str.length - tailLength);
    return frontStr + replaceStr + tailStr
  }
  return str
}
