import { sleep } from "../helper"
import { BSC_CHAIN_ID, RPC_NODE } from '@/config'
import Web3 from "web3"
import { getContract } from './contract'
import { getAccounts } from './account'
import store from '@/store'

/**
 * Add bsc to metamask
 * @returns 
 */
export const setupNetwork =async () => {
    const eth = await getEthWeb()
    const chainId = parseInt(BSC_CHAIN_ID)
    try{
        await eth.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: 'Binance Smart Chain Mainnet',
                    nativeCurrency: {
                      name: 'BNB',
                      symbol: 'bnb',
                      decimals: 18,
                    },
                    rpcUrls: [RPC_NODE],
                    blockExplorerUrls: ['https://bscscan.com/'],
                }
            ],
        })
        store.commit('web3/saveChainId', chainId)
        return true
    } catch( error) {
        // console.log(333, error);
        store.commit('web3/saveChainId', chainId)
        return false
    }
}

/**
 * Get metamask eth
 */
export const getEthWeb = async () => {
    if (typeof window.ethereum !== 'undefined'){
        if (!window.ethereum.isMetaMask){
            console.log('Not metamask wallet');
        }
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
        console.log('Changed to new chain', parseInt(chainId));
        store.commit('web3/saveChainId', parseInt(chainId))
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


/**************************************web3*****************************************************/

export const getWeb3 = async () => {
    const web3 = new Web3(RPC_NODE || Web3.givenProvider)
    return web3
}

export const test = async () => {
    const ethw = await getWeb3()
    
    const contract = await getContract('REGISTRYHUB', '0xF6149F38bEA7bB07a779AF30Ee1983566e5E1218')
    if (!contract) return 
    try{
        const tx = await contract.setWhiteList(
            '0xD8930d33FCb22e9c96D35d7466B86f5801047D4c'
        )
    }catch (e) {
        console.log(222, e);
        if (e.code === 4001){
            // User cancel transaction
            console.log('User cancel the transaction');
        }
    }

}