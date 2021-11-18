import BN from 'bn.js'

export const BLOCK_SECOND = 3

export const POLKADOT_DECIMAL = 10
export const KUSAMA_DECIMAL = 12
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
    kusama: 'KSM'
}

export const API_CONNECT_STATE = {
    CONNECT_INIT: 'CONNECT_INIT',
    CONNECT: 'CONNECT',
    CONNECT_SUCCESS: 'CONNECT_SUCCESS',
    CONNECT_ERROR:'CONNECT_ERROR'
}

export const DECIMAL = {
    polkadot: new BN(POLKADOT_DECIMAL),
    kusama: new BN(KUSAMA_DECIMAL)
}

export const PRICES_SYMBOL = [
    'BNBETH','DOTUSDT', 'KSMUSDT','ETHUSDT', 'HIVEUSDT', 'STEEMETH'
]

// 最大投票数
export const MAX_NOMINATE_VALIDATOR = 16

/**
 * Parachain project logo url
 */
export const ASSET_LOGO_URL = {
    kusama:{
        icon: 'https://cdn.wherein.mobi/polkadot/logo/kusama.png',
    },
    polkadot: {
        icon: 'https://cdn.wherein.mobi/polkadot/logo/polkadot.png',
    },
    steem: 'https://cdn.wherein.mobi/nutbox/token/logo/steem.png',
    hive: 'https://cdn.wherein.mobi/nutbox/token/logo/hive-logo.png'

}

export const constantKsmCrowdloan = [
    {
        isConstant: true,
        chainId: 3,
        contract: "0xa970A3D076Bb05dDF62d2bE8d464701435827C35",
        firstBlock: 399,
        icon: "https://cdn.wherein.mobi/polkadot/paralogo/k/2004.png",
        paraId: 2004,
        poolName: 'Khala Network',
        statusIndex: 2,
        statusStr: 'Completed',
        totalStakedAmount: '2695040099990000',
        trieIndex: 6,
        type: 'SubstrateCrowdloanAssetRegistry',
        communityIcon: "https://cdn.wherein.mobi/nutbox/v2/1636516942582",
        communityName: "Kusama × Nutbox Crowdloan",
        tokenSymbol: "NUT"
    },
    {
        isConstant: true,
        chainId: 3,
        contract: "0xa970A3D076Bb05dDF62d2bE8d464701435827C35",
        firstBlock: 399,
        icon: "https://cdn.wherein.mobi/polkadot/paralogo/k/2001.png",
        paraId: 2001,
        poolName: 'Bifrost',
        statusIndex: 2,
        statusStr: 'Completed',
        totalStakedAmount: '5028000000000000',
        trieIndex: 9,
        type: 'SubstrateCrowdloanAssetRegistry',
        communityIcon: "https://cdn.wherein.mobi/nutbox/v2/1636516942582",
        communityName: "Kusama × Nutbox Crowdloan",
        tokenSymbol: "NUT"
    },
    {
        isConstant: true,
        chainId: 3,
        contract: "0xa970A3D076Bb05dDF62d2bE8d464701435827C35",
        firstBlock: 399,
        icon: "https://cdn.wherein.mobi/polkadot/paralogo/k/2084.png",
        paraId: 2084,
        poolName: 'Calamari',
        statusIndex: 2,
        statusStr: 'Completed',
        totalStakedAmount: '37100000000000',
        trieIndex: 3,
        type: 'SubstrateCrowdloanAssetRegistry',
        communityIcon: "https://cdn.wherein.mobi/nutbox/v2/1636516942582",
        communityName: "Kusama × Nutbox Crowdloan",
        tokenSymbol: "NUT"
    }
]