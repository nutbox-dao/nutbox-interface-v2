import { createWsEndpoints, namedLogos } from '@polkadot/apps-config';

export const formatDate = (date) => {
  var dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

export function isMobile () {
  const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag
}

export function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null
}

export function getParaIcon (paraId) {
  let endpoints = createWsEndpoints((key, value) => value || key);
  for (let e of endpoints) {
    if (e.paraId === parseInt(paraId)) {
      let logo = namedLogos[e.info]
      if (logo.indexOf('data:image') === -1) {
        logo = logo.replaceAll('/img', 'https://polkadot.js.org/apps/static')
        logo = logo.slice(0, -4) + '.' + logo.slice(-4)
      }
      return logo
    }
  }
}