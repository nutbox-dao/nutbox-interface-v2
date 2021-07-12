
// 调试模式
export const DEBUG = false

export const LOCALE_KEY = 'localeLanguage'

// polkadot
export const POLKADOT_WEB_SOCKET = "wss://rpc.polkadot.io"
export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.polkadot.io"
// export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.nutbox.io"
export const ROCOCO_WEB_SOCKET = "wss://crowdloan-test.nutbox.io/relaychain/ws"

export const CROWD_STAKING_API_URL = "https://crowdstaking-api.nutbox.io"
// export const CROWD_STAKING_API_URL = "http://localhost:3200"
export const CROWD_LOAN_API_URL = "https://crowdloan-api.nutbox.io"
// export const CROWD_LOAN_API_URL = "http://localhost:3000"

// nutbox backend server
// export const BACKEND_API_URL = "https://v2-api-test.nutbox.io"
export const BACKEND_API_URL = "http://localhost:3000"

export const QN_UPLOAD_URL = "http://v2-api-test.nutbox.io/qiNiu/upload"

export const PARA_STATUS = {
  ACTIVE: "Active",
  RETIRED: "Retired",
  COMPLETED: "Completed",
  OTHER: "Other"
}

export const POLKADTO_ADDRESS_FORMAT_CODE = {
  polkadot: 0,
  kusama: 2,
  substrate: 42
}

// 添加到交易batch的remark结构
export const NUTBOX_REMARK_TYPE = {
  magic: 'Text',      // 默认为nutbox
  op: 'u8',           // 0为crowdloan， 1为crowdstaking
  trieIndex: 'Option<u8>', // crowdloan 才有该字段
  communityId: 'Text',      // 通过哪个社区操作的
  projectId: 'Option<Text>', // 平行链项目方管理id，crowdloan时该字段为空
  nominatorId: 'Option<Text>' // 推荐人id
}

// Phala推荐机制 remark
export const PhalaCrowdloanReferrerRemark = {
  "magic": "Bytes",
  "paraId": "ParaId",
  "referrer": "AccountId",
  "referrerHash": "Bytes"
}
/** ==========================================================================================================*/

export const RPC_NODE = process.env.VUE_APP_RPC_NODE
export const BSC_CHAIN_ID = process.env.VUE_APP_BSC_CHAIN_ID || 1337

/**
 * chainId on blockchain to chain name
 */
export const DELEGATION_CHAINID_TO_NAME = {
  1: 'steem',
  2: 'hive'
}

/**
 * chainId on blockchain to chain name
 */
export const CROWDLOAN_CHAINID_TO_NAME = {
  0: 'polkadot',
  1: 'polkadot',
  2: 'polkadot',
  3: 'kusama'
}

/**
 * chainId on blockchain to chain name
 */
 export const VALIDATOR_CHAINID_TO_NAME = {
  0: 'polkadot',
  1: 'polkadot',
  2: 'polkadot',
  3: 'kusama'
}

// Nutbox official registried assets IDs
export const NUTBOX_REGISTRY_ASSETS = [

]

// sended transaction configs
export const Transaction_config = {
  gasPrice: 50000000,
  gasLimit: 1000000000
}

/**
 * ERROR CODE DEFINE
 */
 export const errCode = {
  NO_STAKING_FACTORY: 101,
  BLOCK_CHAIN_ERR: 351,
  CONTRACT_CREATE_FAIL: 352,
  SIGNATURE_FAILED: 451,
  INVALID_NONCE: 452,
  DB_ERROR: 453,
  SERVER_ERR: 500,
}
