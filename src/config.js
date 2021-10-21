import { contractAddress } from "./utils/web3/contract";
/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false;

export const LOCALE_KEY = "localeLanguage";
// nutbox backend server
export const BACKEND_API_URL = "https://v2-api-test.nutbox.io"

// export const BACKEND_API_URL = "http://localhost:3000";

export const QN_UPLOAD_URL = BACKEND_API_URL + "/qiNiu/upload";

/**
 * ERROR CODE DEFINE
 */
export const errCode = {
  NO_STAKING_FACTORY: 101,
  ASSET_ID_ERROR: 102,
  WRONG_ETH_ADDRESS: 103,
  NOT_A_TOKEN_CONTRACT: 104,
  TRANSACTION_FAIL: 105,
  ASSET_EXIST: 106,
  TOKEN_DEPLOYING: 107,

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
};

/** ====================================== polkadot ============================================*/
export const POLKADOT_WEB_SOCKET = "wss://rpc.polkadot.io";
export const KUSAMA_WEB_SOCKET = "wss://kusama-rpc.polkadot.io";
export const ROCOCO_WEB_SOCKET = "wss://crowdloan-test.nutbox.io/relaychain/ws";

export const PARA_STATUS = {
  ACTIVE: "Active",
  RETIRED: "Retired",
  COMPLETED: "Completed",
  WINNER: "Winner",
  OTHER: "Other",
};

export const POLKADTO_ADDRESS_FORMAT_CODE = {
  polkadot: 0,
  kusama: 2,
  substrate: 42,
};

// const remark = api.createType('NutboxRemark', {
//   magic: 'nutbox',
//   msgType: 'crowdloan',
//   source: api.createType('Compact<u8>', 2),   // 2: polkadot, 3: kusama
//   dest: api.createType('Compact<u8>', 0),
//   sequence: api.createType('Compact<u64>', Date.now()),
//   paraId: api.createType('Compact<u32>', 2001),
//   trieIndex: api.createType('Compact<u32>', 1),
//   communityAccount: 'DzmAoYXo1ka1xW3CCZajTXqJxG5oQUJLqLBbpqDzCUatHBP',
//   recipient: '0xA29D4E0F035cb50C0d78c8CeBb56Ca292616Ab20'.substr(2),
//   amount: api.createType('Compact<BalanceOf>', new BN('6000000000000')),
//   bindAccount: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F',
//   stakingFeast: '0xef1E390c2108376C45e5e5467Eaf58D454FdE7Ad'.substr(2),
//   pid: api.createType('Compact<u8>', 0)
// });

// 添加到交易batch的remark结构
export const NUTBOX_REMARK_TYPE = {
  magic: "Text", // 默认为nutbox
  msgType: 'Text',  // crowdloan
  source: 'Compact<u8>',  // 2: polkadot, 3: kusama
  dest: 'Compact<u8>',
  sequence: 'Compact<u64>',
  paraId: 'Compact<u32>',
  trieIndex: 'Compact<u32>',
  communityAccount: 'Text',
  recipient: 'Text',
  amount: 'Compact<BalanceOf>',
  bindAccount: 'Text',
  stakingFeast: 'Text',
  pid: 'Compact<u8>'
};

// Phala推荐机制 remark
export const PhalaCrowdloanReferrerRemark = {
  magic: "Bytes",
  paraId: "ParaId",
  referrer: "AccountId",
  referrerHash: "Bytes",
};

/**======================================= steem  ====================================*/

// steem node storage
export const STEEM_CONF_KEY = "steemNodeKey";
// delegate fee
export const STEEM_STAKE_FEE = 0.001;
// official fee account
export const STEEM_GAS_ACCOUNT = "test.walnut.gas";

// Steem Config
export const STEEM_API_URLS = [
  process.env.STEEM_API_URL || "https://api.steemitdev.com",
  "https://api.steemit.com",
  "https://cn.steems.top",
  "https://api.justyy.com",
  "https://aksaiapi.wherein.mobi",
];

/**===================================== hive  =======================================*/
// hive node storage
export const HIVE_CONF_KEY = "hiveNodeKey";
// delegate fee
export const HIVE_STAKE_FEE = 0.001;
// official fee account
export const HIVE_GAS_ACCOUNT = "test.walnut.gas";

// Hive Config
export const HIVE_API_URLS = ["https://api.hive.blog"];

/** ==================================Main chain============================================*/

export const RPC_NODE = process.env.VUE_APP_RPC_NODE;
export const BSC_CHAIN_ID = process.env.VUE_APP_BSC_CHAIN_ID || 1337;
export const CHAIN_NAME = process.env.VUE_APP_CHAIN_NAME;
export const BSC_CHAIN_NAME = process.env.VUE_APP_BSC_CHAIN_NAME;
export const BSC_STRATEGIES_NAME = process.env.VUE_APP_BSC_STRATEGIES_NAME;
export const BSC_STRATEGIES_PARAMS = process.env.VUE_APP_BSC_STRATEGIES_PARAMS;

export const MAIN_COMMUNITY_ID = process.env.VUE_APP_MAIN_COMMUNITY_ID;
/**
 * chainId on blockchain to chain name
 */
export const DELEGATION_CHAINID_TO_NAME = {
  1: "steem",
  2: "hive",
};

/**
 * chainId on blockchain to chain name
 */
export const CROWDLOAN_CHAINID_TO_NAME = {
  0: "polkadot",
  1: "polkadot",
  2: "polkadot",
  3: "kusama",
};

/**
 * chainId on blockchain to chain name
 */
export const VALIDATOR_CHAINID_TO_NAME = {
  0: "polkadot",
  1: "polkadot",
  2: "polkadot",
  3: "kusama",
};

export const GasLimit = 10000000;


// local network
// export const MultiAddress = '0x6cA267098BEcC68Eb6094967f3Fb4bfaAF9ba979'      // on imac
// export const NutAddress = '0x61b053807fBD95d1e187cd3Ed98c9abf2CEED62a'

// export const MultiAddress = '0x0a73FCef08419d68E3f646151B5cFE0D3D4415fB'    // on local mac book
// export const NutAddress = '0x4E42eB91E2A27817cDB8C8094eB495a1322BbA01'      // onlocal mac book

// goerli network
export const MultiAddress = "0x0de95fe541D4017A1a64AAe448BA80F07f96A937";
export const NutAddress = "0xb22adDAF41D4d656B37577E5f2549559B4A8c0ef";

// Register by nutbox
export const OfficialAssets = [
  {
    name: "Nutbox",
    address: NutAddress,
    symbol: "NUT",
    asset: "0xcac6b153e1d2c35b9a4aec10dd2c507f86be7bab807c71bd2f0407626e9132b2",
    contract: contractAddress["HomeChainAssetRegistry"],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    icon: "https://cdn.wherein.mobi/nutbox/v2/1633769085901",
  },
  // {
  //   name: 'WBNB',
  //   address: '0x64f525e92B614bA4f8d332910B11430DD487895b',
  //   symbol: 'WBNB',
  //   asset: '0x5f54be7b77630ac5a539705d38e0ea00bed06f3c6d2fff334855440d18296b7f',
  //   contract: contractAddress['HomeChainAssetRegistry'],
  //   decimal: 18,
  //   type: "HomeChainAssetRegistry",
  //   icon: 'https://cdn.wherein.mobi/nutbox-v2/token/logo/bnb.png'
  // },
  // {
  //   name: 'WETH',
  //   address: '0xa49B1eEC62c669b65D571536E221fB172a62C9F6',
  //   symbol: 'WETH',
  //   contract: contractAddress['HomeChainAssetRegistry'],
  //   decimal: 18,
  //   type: "HomeChainAssetRegistry",
  //   asset: '0x6314ea4ddefe5213313d39e1e3d62c4a399c4df5b47cf3b0613a49f68239eedc',
  //   icon: 'https://cdn.wherein.mobi/nutbox-v2/token/logo/WETH.png'
  // }
];

export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress,
  interval: 3000,
};
