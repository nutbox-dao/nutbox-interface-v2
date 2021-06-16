import { ListGroupPlugin } from "bootstrap-vue"
import { sleep } from "../helper"



/**
 * Get metamask eth
 */
export const getEthWeb = async () => {
    if (typeof window.ethereum !== 'undefined'){
        return window.ethereum
    }
    var metamask = window.ethereum
    for (let i = 0; i< 10; i++){
        if (typeof metamask !== 'undefined'){
            return metamask
        }
        metamask = window.ethereum
        await sleep(0.5)
    }
    return metamask
}

/**
 * Connect to Metamask
 */
export const connectMetamask = async () => {
    const metamask = await getEthWeb()
    metamask.request({ method: 'eth_requestAccounts' });
}

/**
 * User changed chain
 */
export const chainChanged = async () => {
    const metamask = await getEthWeb()
    metamask.on('chainChanged', (chainId) => {
        console.log('Changed to new chain', chainId);
        // window.location.reload()
    })
}

/**
 * Is metamask unlocked
 * @returns bool
 */
export const isUnlocked = async () => {
    const metamask = await getEthWeb()
    return metamask._metamask.isUnlocked()
}

/**
 * Add asset to metamask
 */
export const addAssetToWallet = async (address, symbol, decimals, image) => {
    const metamask = await getEthWeb()
    metamask.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address,
                symbol,
                decimals,
                image
            }
        }
    }).then((success) => {
        if (success) {
            console.log(symbol, 'successfully added to wallet!');
        }else {
            console.log('Add asset faild');
        }
    }).catch(console.log)
}