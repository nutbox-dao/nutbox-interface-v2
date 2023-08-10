/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false;

export const LOCALE_KEY = "localeLanguage";
export const BLOCK_SECOND = 12;
// nutbox backend server
export const BACKEND_API_URL = "https://api-linea.nutbox.app"
// export const BACKEND_API_URL = "https://v2-api-test.nutbox.io";
// export const BACKEND_API_URL = "http://localhost:3000";

export const QN_UPLOAD_URL = "https://api-walnut.nutbox.app/qiNiu/upload";

// wheather use the graph sevice or our service
// because of the graph service for BSC network is udpate so slowly, so we build our
// own index service, but we retain the graph service for backup.
export const USE_THE_GRAPH = false;

// np power period to channel
export const PeriodToIdx = {
  1:0,
  2:1,
  4:2,
  8:3,
  16:4,
  32:5,
  64:6
}

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
  INSUFIENT_BALANCE: 108,
  LARGE_IMG: 109,
  OUT_OF_USAGE: 110,
  UPLOAD_FAIL: 111,

  BLOCK_CHAIN_ERR: 351,
  CONTRACT_CREATE_FAIL: 352,
  USER_CANCEL_SIGNING: 353,
  NOT_CONNECT_METAMASK: 354,
  UNLOCK_METAMASK: 355,
  WRONG_CHAIN_ID: 356,
  HAVE_CREATED_COMMUNITY: 357,

  SIGNATURE_FAILED: 451,
  INVALID_NONCE: 452,
  DB_ERROR: 453,
  SERVER_ERR: 500,
  UPDATE_POOL_DEC_FAIL: 454,
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
export const HIVE_STAKE_FEE = 1;
// official fee account
export const HIVE_GAS_ACCOUNT = "walnut.gas";

// Hive Config
export const HIVE_API_URLS = ["https://api.hive.blog"];

/**===================================== cosmos  =======================================*/
export const COSMOS_STAKE_FEE = 0;
export const COSMOS_GAS_ACCOUNT = "cosmos1767jj20jaqh73qxr6ftrxcv6unwlel34crk82u";

export const OSMOSIS_STAKE_FEE = 0;
export const OSMOSIS_GAS_ACCOUNT = 'osmo1khkaslmkk0htu0ug2j7h3geclyxfcfrsn4l477';

export const JUNO_STAKE_FEE = 0;
export const JUNO_GAS_ACCOUNT = 'juno1khkaslmkk0htu0ug2j7h3geclyxfcfrsdu070s';
// gas address
// export const COSMOS_GAS_ACCOUNT = 'cosmos1767jj20jaqh73qxr6ftrxcv6unwlel34crk82u';
export const COSMOS_API_URLS = ["https://anyplace-cors.herokuapp.com/https://api.cosmos.network", "https://api.cosmos.network"];

/** ==================================Main chain============================================*/
// linea
export const RPC_NODE = 'https://rpc.linea.build';
export const BSC_CHAIN_ID = 59144;
export const BLOCK_CHAIN_BROWER = 'https://rpc.linea.build';
export const CHAIN_NAME = 'Linea';
export const BSC_CHAIN_NAME = CHAIN_NAME;
export const NATIVE_CURRENCY = {
  name: 'ETH',
  symbol: 'ETH',
  decimals: 18
}

export const BSC_STRATEGIES_NAME = process.env.VUE_APP_BSC_STRATEGIES_NAME;
export const BSC_STRATEGIES_PARAMS = process.env.VUE_APP_BSC_STRATEGIES_PARAMS;
export const MAIN_COMMUNITY_ID = process.env.VUE_APP_MAIN_COMMUNITY_ID;


export const FEE_TYPES = [
  'COMMUNITY',
  'USER'
]
/**
 * chainId on blockchain to chain name
 */
export const DELEGATION_CHAINID_TO_NAME = {
  1: "steem",
  2: "hive",
};

export const GasTimes = 1.5;

// // linea net
export const MultiAddress = "0xcA11bde05977b3631167028862bE2a173976CA11"
export const NutAddress = "0x2DaE3A44D3C6e9Ab402f6e616ce1d02c1836A6Ac"

export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress,
  interval: 3000,
};
