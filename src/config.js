import { contractAddress } from "./utils/web3/contract"
/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false

export const LOCALE_KEY = 'localeLanguage'
// nutbox backend server
export const BACKEND_API_URL = "https://v2-api-test.nutbox.io"
// export const BACKEND_API_URL = "http://localhost:3000"

export const QN_UPLOAD_URL = BACKEND_API_URL + "/qiNiu/upload"

/**
 * ERROR CODE DEFINE
 */
 export const errCode = {
  NO_STAKING_FACTORY: 101,
  ASSET_ID_ERROR: 102,
  WRONG_ETH_ADDRESS: 103,
  NOT_A_TOKEN_CONTRACT: 104,
  TRANSACTION_FAIL: 105,
  ASSET_EXIST:106,

  BLOCK_CHAIN_ERR: 351,
  CONTRACT_CREATE_FAIL: 352,
  USER_CANCEL_SIGNING: 353,
  NOT_CONNECT_METAMASK: 354,
  UNLOCK_METAMASK: 355,
  WRONG_CHAIN_ID: 356,

  SIGNATURE_FAILED: 451,
  INVALID_NONCE: 452,
  DB_ERROR: 453,
  SERVER_ERR: 500,
}


/** ====================================== polkadot ============================================*/
export const POLKADOT_WEB_SOCKET = "wss://rpc.polkadot.io"
export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.polkadot.io"
// export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.nutbox.io"
export const ROCOCO_WEB_SOCKET = "wss://crowdloan-test.nutbox.io/relaychain/ws"

export const CROWD_STAKING_API_URL = "https://crowdstaking-api.nutbox.io"
// export const CROWD_STAKING_API_URL = "http://localhost:3200"
export const CROWD_LOAN_API_URL = "https://crowdloan-api.nutbox.io"
// export const CROWD_LOAN_API_URL = "http://localhost:3000"

export const PARA_STATUS = {
  ACTIVE: "Active",
  RETIRED: "Retired",
  COMPLETED: "Completed",
  WINNER: "Winner",
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
  stakingAddress: 'Text',  // address on bsc
  trieIndex: 'Option<u8>', // crowdloan 才有该字段
  communityId: "AccountId",      // 通过哪个社区操作的
}

// Phala推荐机制 remark
export const PhalaCrowdloanReferrerRemark = {
  "magic": "Bytes",
  "paraId": "ParaId",
  "referrer": "AccountId",
  "referrerHash": "Bytes"
}

/**======================================= steem  ====================================*/

// steem node storage
export const STEEM_CONF_KEY = 'steemNodeKey'
// delegate fee
export const STEEM_STAKE_FEE = 1
// official fee account
export const STEEM_GAS_ACCOUNT = 'walnut.gas'

// Steem Config
export const STEEM_API_URLS = [
  process.env.STEEM_API_URL ||
  'https://api.steemitdev.com',
  'https://api.steemit.com',
  'https://cn.steems.top',
  'https://api.justyy.com',
  'https://aksaiapi.wherein.mobi'
]

/**===================================== hive  =======================================*/
// hive node storage
export const HIVE_CONF_KEY = 'hiveNodeKey'
// delegate fee
export const HIVE_STAKE_FEE = 1
// official fee account
export const HIVE_GAS_ACCOUNT = 'walnut.gas'

// Hive Config
export const HIVE_API_URLS = [
  'https://api.hive.blog'
]

/** ==================================Main chain============================================*/

export const RPC_NODE = process.env.VUE_APP_RPC_NODE
export const BSC_CHAIN_ID = process.env.VUE_APP_BSC_CHAIN_ID || 1337
export const CHAIN_NAME = process.env.VUE_APP_CHAIN_NAME 

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
  gasPrice: 100000000,
  gasLimit: GasLimit
}

export const GasTimes = 1000;
export const GasLimit = 5000000

// Register by nutbox 
export const OfficialAssets = [
  {
    name: 'NUT',
    address: '0xf1D97c74ACce7DA7554e27D373265E6EFe21bd0a',
    symbol: 'NUT',
    asset: '0xec9f2c163346c3eeb6e14a718ad780a6b75ea9afb1b0a18c0d5a94cffde8e366',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    icon: 'https://cdn.wherein.mobi/nutbox-v2/token/logo/nut.png'
  },
  {
    name: 'WBNB',
    address: '0x64f525e92B614bA4f8d332910B11430DD487895b',
    symbol: 'WBNB',
    asset: '0x5f54be7b77630ac5a539705d38e0ea00bed06f3c6d2fff334855440d18296b7f',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    icon: 'https://cdn.wherein.mobi/nutbox-v2/token/logo/bnb.png'
  },
  {
    name: 'WETH',
    address: '0xa49B1eEC62c669b65D571536E221fB172a62C9F6',
    symbol: 'WETH',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    asset: '0x6314ea4ddefe5213313d39e1e3d62c4a399c4df5b47cf3b0613a49f68239eedc',
    icon: 'https://cdn.wherein.mobi/nutbox-v2/token/logo/WETH.png'
  }
]

// test network
// export const MultiAddress = '0x823b1eaceF85E3ab6509062810B551C1A80760d9'
// export const NUTAddress = '0x7D4c68c01923DCac056ee4274D6d4E7b7975D299'

// goerli network
export const MultiAddress = '0x0de95fe541D4017A1a64AAe448BA80F07f96A937'
export const NUTAddress = '0x94AF51B6b03AD129c385323FC7500120f389d759'

export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress
}
