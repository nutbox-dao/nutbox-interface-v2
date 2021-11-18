import { contractAddress } from "./utils/web3/contract";
/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false;

export const LOCALE_KEY = "localeLanguage";
// nutbox backend server
export const BACKEND_API_URL = "https://api-walnut.nutbox.app"
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
  source: 'u8',  // 2: polkadot, 3: kusama
  dest: 'u8',
  sequence: 'u64',
  paraId: 'u32',
  trieIndex: 'u32',
  communityAccount: 'Text',
  recipient: 'Text',
  amount: 'u128',
  bindAccount: 'Text',
  stakingFeast: 'Text',
  pid: 'u8'
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
export const STEEM_STAKE_FEE = 3;
// official fee account
export const STEEM_GAS_ACCOUNT = "walnut.gas";

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
export const HIVE_STAKE_FEE = 3;
// official fee account
export const HIVE_GAS_ACCOUNT = "walnut.gas";

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

export const GasTimes = 1.5;


// local network
// export const MultiAddress = '0x6cA267098BEcC68Eb6094967f3Fb4bfaAF9ba979'      // on imac
// export const NutAddress = '0x8F45066eE7B4a09355A43bC689188a46b33797eB'

// export const MultiAddress = '0x0a73FCef08419d68E3f646151B5cFE0D3D4415fB'    // on local mac book
// export const NutAddress = '0x4E42eB91E2A27817cDB8C8094eB495a1322BbA01'      // onlocal mac book

// goerli network
// export const MultiAddress = "0x0de95fe541D4017A1a64AAe448BA80F07f96A937";
// export const NutAddress = "0xb22adDAF41D4d656B37577E5f2549559B4A8c0ef";

// bsc net
export const MultiAddress = "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
export const NutAddress = "0x4429FcdD4eC4EA4756B493e9c0525cBe747c2745"

// Register by nutbox
export const OfficialAssets = [
  {
    name: "Nutbox",
    address: NutAddress,
    symbol: "NUT",
    asset: "0x60c0b04ec025fa4158044f22dc3590f6c64baf13a4f9ca4a280982ee3d8e2bed",
    contract: contractAddress["HomeChainAssetRegistry"],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    icon: "https://cdn.wherein.mobi/nutbox/v2/1633769085901",
  },
  {
    name: 'Wrapped BNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    asset: '0xb90fe532b37240954353f38fe729360f365263ffb3674bab1d07fe43d92573c0',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    icon: 'https://cdn.wherein.mobi/nutbox/v2/bnb.png'
  },
  {
    name: 'Ethereum Token',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    symbol: 'ETH',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    asset: '0x4c606d65f6a51160a91ba185988f4cc6749e6422c79bdb2f63b1b36bfa44b515',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/eth.png'
  },
  {
    name: 'PancakeSwap Token',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    symbol: 'CAKE',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    asset: '0xcb3d2d4130630a838634786f5fe28f13b8b061ebc9987587a9099e487c9c0cdf',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/cake.png'
  },
  {
    name: 'BTCB Token',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    symbol: 'BTCB',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: "HomeChainAssetRegistry",
    asset: '0x36be4d0a728a4a0ad58ffcf89f440e13f4db370fd7d0ab22528b929ec955f237',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/btc.png'
  },
  {
    name: 'Mint Club',
    address: '0x1f3Af095CDa17d63cad238358837321e95FC5915',
    symbol: 'MINT',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: 'HomeChainAssetRegistry',
    asset: '0xcd7d1928ba1ec24587cc3904f5fbfef77489c68f0369ec29813dfbec4a3cf216',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/mint-logo.png'
  },
  {
    name: 'Mint Club Grant',
    address: '0x58764cE77f0140F9678bA6dED9D9697c979F4E0f',
    symbol: 'GRANT',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: 'HomeChainAssetRegistry',
    asset: '0xfba9ce2c26f6f71630e94ec0e0363f3d8bf2cf4399e01a3c4570567d37e00e7a',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/mint-grant.png'
  },
  {
    name: 'Mint Club DAO',
    address: '0x558810B46101DE82b579DD1950E9C717dCc28338',
    symbol: 'MINTDAO',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: 'HomeChainAssetRegistry',
    asset: '0x57fb04387de5155f968d37e9574b0ffb2dc47865f17fa71d31cc1296e8fd24e2',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/mint-dao.png'
  },
  {
    name: 'Mint Club Creator',
    address: '0x9f3C60dC06f66b3e0ea1Eb05866F9c1A74d43D67',
    symbol: 'CREATOR',
    contract: contractAddress['HomeChainAssetRegistry'],
    decimal: 18,
    type: 'HomeChainAssetRegistry',
    asset: '0xc10a83b0bf2cd12664afd0a3a884a571e5df17b12b41a9d2c9f3bf1ad5fe47a5',
    icon: 'https://cdn.wherein.mobi/nutbox/v2/mint-creator.png'
  }
];

export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress,
  interval: 5000,
};
