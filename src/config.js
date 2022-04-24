/** =================================== Normal =======================================*/
// 调试模式
export const DEBUG = false;

export const LOCALE_KEY = "localeLanguage";
// nutbox backend server
// export const BACKEND_API_URL = "https://api-astar.nutbox.app"
// export const BACKEND_API_URL = "https://v2-api-test.nutbox.io";
export const BACKEND_API_URL = "http://localhost:3000";

export const QN_UPLOAD_URL = 'https://api-walnut.nutbox.app' + "/qiNiu/upload";

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
};

/** ================================== Polkadot ============================================*/
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

// shibuya
export const RPC_NODE = 'https://rpc.shibuya.astar.network:8545';
export const BSC_CHAIN_ID = 81;
export const BLOCK_CHAIN_BROWER = 'https://shibuya.subscan.io';
export const CHAIN_NAME = 'Shibuya';
export const BSC_CHAIN_NAME = CHAIN_NAME;
export const NATIVE_CURRENCY = {
  name: 'SBY',
  symbol: 'SBY',
  decimals: 18
}

// bsc
// export const RPC_NODE = 'https://bsc-dataseed.binance.org';
// // export const RPC_NODE = 'https://still-red-snowflake.bsc.quiknode.pro/da03ce3f2590abcd5e1dbde82f87db93065c0237/';
// export const BSC_CHAIN_ID = 56;
// export const BLOCK_CHAIN_BROWER = 'https://bscscan.com/';
// export const CHAIN_NAME = 'BSC-Mainnet';
// export const BSC_CHAIN_NAME = CHAIN_NAME;
// export const NATIVE_CURRENCY = {
//   name: 'BNB',
//   symbol: 'BNB',
//   decimals: 18
// }

// Astar
// export const RPC_NODE = 'https://rpc.astar.network:8545';
// // export const RPC_NODE = 'https://still-red-snowflake.bsc.quiknode.pro/da03ce3f2590abcd5e1dbde82f87db93065c0237/';
// export const BSC_CHAIN_ID = 592;
// export const BLOCK_CHAIN_BROWER = 'https://blockscout.com/astar/';
// export const CHAIN_NAME = 'Astar Network';
// export const BSC_CHAIN_NAME = CHAIN_NAME;
// export const NATIVE_CURRENCY = {
//   name: 'ASTR',
//   symbol: 'ASTR',
//   decimals: 18
// }

export const BSC_STRATEGIES_NAME = process.env.VUE_APP_BSC_STRATEGIES_NAME;
export const BSC_STRATEGIES_PARAMS = process.env.VUE_APP_BSC_STRATEGIES_PARAMS;
export const MAIN_COMMUNITY_ID = process.env.VUE_APP_MAIN_COMMUNITY_ID;


export const FEE_TYPES = [
  'COMMUNITY',
  'USER'
]

export const GasTimes = 1.5;


// local network
// export const MultiAddress = '0x6cA267098BEcC68Eb6094967f3Fb4bfaAF9ba979'      // on imac
// export const NutAddress = '0x8F45066eE7B4a09355A43bC689188a46b33797eB'

// export const MultiAddress = '0x0a73FCef08419d68E3f646151B5cFE0D3D4415fB'    // on local mac book
// export const NutAddress = '0x4E42eB91E2A27817cDB8C8094eB495a1322BbA01'      // onlocal mac book

// shibuya network
export const MultiAddress = "0xc56342456c26fa5553c1A308A7B96fC23713a0C8";
export const NutAddress = "0xDb761E1506dCEedA6A0F5130d33BE7fB8d671c24";

// bsc test
// export const MultiAddress = "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C";
// export const NutAddress = "0x871AD5aAA75C297EB22A6349871ce4588E3c0306";

// moonbase alpha
// export const MultiAddress = '0xBf27B3a22A76cA18E6dbb0F10190af78346da732'
// export const NutAddress = '0x871AD5aAA75C297EB22A6349871ce4588E3c0306'

// bsc net
// export const MultiAddress = "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
// export const NutAddress = "0x4429FcdD4eC4EA4756B493e9c0525cBe747c2745"

// astar
// export const MultiAddress = '0x79D106b1af3C3cb712B49e405825905e4ee0Db32'
// export const NutAddress = "0xd10e4C1e301A13A9B874bd1757c135Eda075769D"


export const Multi_Config = {
  rpcUrl: RPC_NODE,
  multicallAddress: MultiAddress,
  interval: 3000,
};
