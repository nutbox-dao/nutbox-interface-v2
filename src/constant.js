import BN from 'bn.js'

export const BLOCK_SECOND = 3

export const POLKADOT_DECIMAL = 10
export const KUSAMA_DECIMAL = 12
export const ROCOCO_DECIMAL = 12
export const SP_DELEGATE_DECIMAL = 6

export const TIME_PERIOD = {
    MINUTES:60,
    HOUR: 3600,
    DAY: 86400,
    WEEK: 604800,
    MONTH: 2592000,
}

export const MaxBlockNum = 999999999999999

export const POLKADOT_RELAYCHAIN_SYMBOL = {
    polkadot: 'DOT',
    kusama: 'KSM',
    rococo: 'ROC'
}

export const API_CONNECT_STATE = {
    CONNECT_INIT: 'CONNECT_INIT',
    CONNECT: 'CONNECT',
    CONNECT_SUCCESS: 'CONNECT_SUCCESS',
    CONNECT_ERROR:'CONNECT_ERROR'
}

export const DECIMAL = {
    polkadot: new BN(POLKADOT_DECIMAL),
    kusama: new BN(KUSAMA_DECIMAL),
    rococo: new BN(ROCOCO_DECIMAL)
}

// 最大投票数
export const MAX_NOMINATE_VALIDATOR = 16

/**
 * Parachain project logo url
 */
export const ASSET_LOGO_URL = {
    kusama:{
        icon: 'https://cdn.wherein.mobi/polkadot/logo/kusama.png',
        2006: 'https://cdn.wherein.mobi/polkadot/token/logo/crab.png',
        2012: 'https://cdn.wherein.mobi/polkadot/token/logo/crust.png',
        2013: 'https://cdn.wherein.mobi/polkadot/parachain/logo/sherpax.png',
        2004: 'https://cdn.wherein.mobi/polkadot/token/logo/khala.png',
        2001: 'https://cdn.wherein.mobi/polkadot/parachain/logo/bifrost.png',
        2007: 'https://cdn.wherein.mobi/shiden.png',
        2013: 'https://cdn.wherein.mobi/polkadot/parachain/logo/sherpax.png',
        2018: 'https://cdn.wherein.mobi/polkadot/parachain/logo/subgame.png',
        2089: 'https://cdn.wherein.mobi/polkadot/token/logo/gens.png',
    },
    polkadot: {
        icon: 'https://cdn.wherein.mobi/polkadot/logo/polkadot.png',
    },
    steem: 'https://cdn.wherein.mobi/nutbox/token/logo/steem.png',
    hive: 'https://cdn.wherein.mobi/nutbox/token/logo/hive-logo.png'

}