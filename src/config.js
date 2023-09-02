/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false;

export const LOCALE_KEY = "localeLanguage";
export const BLOCK_SECOND = 0.3;
// nutbox backend server
export const BACKEND_API_URL = "https://arbi-api.nutbox.app"
// export const BACKEND_API_URL = "https://v2-api-test.nutbox.io";
// export const BACKEND_API_URL = "http://localhost:3000";

// wormhole3 api
export const WH3_API_URL = "https://alpha-api.wormhole3.io"
// export const WH3_API_URL = "http://localhost:3100"

export const QN_UPLOAD_URL = "https://api-walnut.nutbox.app/qiNiu/upload";

// wheather use the graph sevice or our service
// because of the graph service for BSC network is udpate so slowly, so we build our
// own index service, but we retain the graph service for backup.
export const USE_THE_GRAPH = true;

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
  DISPLAY_TAG_USED: 112,
  DISPLAY_TAG_INVALID: 113,
  USER_NOT_REGISTERED_WH3: 114,

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

//  moonbase alpha
// export const RPC_NODE = 'https://rpc.api.moonbase.moonbeam.network';
// export const BSC_CHAIN_ID = 1287;
// export const BLOCK_CHAIN_BROWER = 'https://moonbase.moonscan.io/';
// export const CHAIN_NAME = 'Moonbase-alpha';
// export const BSC_CHAIN_NAME = CHAIN_NAME;
// export const NATIVE_CURRENCY = {
//   name: 'DEV',
//   symbol: 'DEV',
//   decimals: 18
// }

// chapel
// export const RPC_NODE = 'https://data-seed-prebsc-1-s1.binance.org:8545';
// export const BSC_CHAIN_ID = 97;
// export const BLOCK_CHAIN_BROWER = 'https://testnet.bscscan.com//';
// export const CHAIN_NAME = 'BSC-Test';
// export const BSC_CHAIN_NAME = CHAIN_NAME;
// export const NATIVE_CURRENCY = {
//   name: 'BNB',
//   symbol: 'BNB',
//   decimals: 18
// }

// goerli
// export const RPC_NODE = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
// export const BSC_CHAIN_ID = 5;
// export const BLOCK_CHAIN_BROWER = 'https://goerli.etherscan.io/';
// export const CHAIN_NAME = 'Goerli';

// export const BSC_CHAIN_NAME = CHAIN_NAME;
// export const NATIVE_CURRENCY = {
//   name: 'ETH',
//   symbol: 'ETH',
//   decimals: 18
// }

// arbitrum
export const RPC_NODE = 'https://arb1.arbitrum.io/rpc';
export const BSC_CHAIN_ID = 42161;
export const BLOCK_CHAIN_BROWER = 'https://arbiscan.io/';
export const CHAIN_NAME = 'Arbitrum-one';
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


// local network
// export const MultiAddress = '0x6cA267098BEcC68Eb6094967f3Fb4bfaAF9ba979'      // on imac
// export const NutAddress = '0x8F45066eE7B4a09355A43bC689188a46b33797eB'

// export const MultiAddress = '0x0a73FCef08419d68E3f646151B5cFE0D3D4415fB'    // on local mac book
// export const NutAddress = '0x4E42eB91E2A27817cDB8C8094eB495a1322BbA01'      // onlocal mac book

// goerli network
// export const MultiAddress = "0x0de95fe541D4017A1a64AAe448BA80F07f96A937";
// export const NutAddress = "0xc821eC39fd35E6c8414A6C7B32674D51aD0c2468";

// bsc test
// export const MultiAddress = "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C";
// export const NutAddress = "0x871AD5aAA75C297EB22A6349871ce4588E3c0306";

// moonbase alpha
// export const MultiAddress = '0xBf27B3a22A76cA18E6dbb0F10190af78346da732'
// export const NutAddress = '0x871AD5aAA75C297EB22A6349871ce4588E3c0306'

// // arbitrum net
export const MultiAddress = "0x4B6EF997DbF23D320a6616ADf6499f4cdC00AB7c"
export const NutAddress = "0xED4D88303973615cC3D61D5F4D06A809055a07b8"

export const DEFAULT_CLAIM_CURATION_REWARD_SYNGER = "0x4A584E33Dec216a124E36Aceb0B06Bc37642027B"

export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress,
  interval: 3000,
};

/**===================================== wormhole3  =======================================*/
export const SendPwdServerPubKey = '215ae8d490ddbf62242a3cca9849a73df847997f91982d77b9708411e17c647f'
export const ParseKeyNonce = '111111111111111111111111111111111111111111111111'