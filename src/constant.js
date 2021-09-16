import BN from 'bn.js'

export const BLOCK_SECOND = 3

export const POLKADOT_DECIMAL = 10
export const KUSAMA_DECIMAL = 12
export const ROCOCO_DECIMAL = 12
export const SP_DELEGATE_DECIMAL = 6
export const MAX_DISTRIBUTION_COUNT = 6

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

export const PRICES_SYMBOL = [
    'BNBUSDT','DOTUSDT','ETHUSDT', 'HIVEUSDT', 'STEEMUSDT', 'STEEMETH'
]

// 最大投票数
export const MAX_NOMINATE_VALIDATOR = 16

/**
 * Parachain project logo url
 */
export const ASSET_LOGO_URL = {
    kusama:{
        icon: 'https://cdn.wherein.mobi/polkadot/logo/kusama.png',
        2006: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2006.png',
        2012: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2012.png',
        2004: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2004.png',
        2001: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2001.png',
        2007: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2007.png',
        2008: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2008.png',
        2009: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2009.png',
        2013: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2013.png',
        2015: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2015.png',
        2016: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2016.png',
        2018: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2018.png',
        2077: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2077.png',
        2084: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2084.png',
        2085: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2085.png',
        2086: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2086.png',
        2087: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2087.png',
        2088: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2088.png',
        2089: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2089.png',
        2090: 'https://cdn.wherein.mobi/polkadot/paralogo/k/2090.png'
    },
    polkadot: {
        icon: 'https://cdn.wherein.mobi/polkadot/logo/polkadot.png',
    },
    steem: 'https://cdn.wherein.mobi/nutbox/token/logo/steem.png',
    hive: 'https://cdn.wherein.mobi/nutbox/token/logo/hive-logo.png'

}