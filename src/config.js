
// Steem Config
export const STEEM_API_URLS = [
  process.env.STEEM_API_URL || 'https://api.steemitdev.com',
  'https://cn.steems.top',
  'https://api.steemit.com',
  'https://api.justyy.com',
  'https://aksaiapi.wherein.mobi'
]

export const STEEM_CONF_KEY = 'steemNodeKey'

export const LOCALE_KEY = 'localeLanguage'

// polkadot
export const POLKADOT_WEB_SOCKET = "wss://rpc.polkadot.io"
// export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.polkadot.io"
export const KUSAMA_WEB_SOCKET = "wss://crowdloan-test.nutbox.io/relaychain/ws"

export const CROWD_STAKING_API_URL = "https://api.crowdstaking.nutbox.io"
export const CROWD_LOAN_API_URL = "https://api.crowdloan-test.nutbox.io"

export const PARA_STATUS = {
  ACTIVE: "Active",
  RETIRED: "Retired",
  COMPLETED: "Completed",
  OTHER: "Other"
}