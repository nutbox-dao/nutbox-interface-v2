import { BLOCK_SECOND as sec } from '@/config'
export const BLOCK_SECOND = sec

export const YEAR_BLOCKS = 31536000 / BLOCK_SECOND

export const SP_DELEGATE_DECIMAL = 6

export const TIME_PERIOD = {
  MINUTES: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
}

export const MaxBlockNum = 999999999999999

export const API_CONNECT_STATE = {
  CONNECT_INIT: 'CONNECT_INIT',
  CONNECT: 'CONNECT',
  CONNECT_SUCCESS: 'CONNECT_SUCCESS',
  CONNECT_ERROR: 'CONNECT_ERROR'
}

/**
 * Parachain project logo url
 */
export const ASSET_LOGO_URL = {
  steem: 'https://cdn.wherein.mobi/nutbox/token/logo/steem.png',
  hive: 'https://cdn.wherein.mobi/nutbox/token/logo/hive-logo.png',
  cosmos: 'https://cdn.wherein.mobi/nutbox/token/logo/atom.png',
  nut: "https://cdn.wherein.mobi/nutbox/v2/1633769085901"
}
