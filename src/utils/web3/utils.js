import { getProvider } from './ethers'
import { getWeb3 } from './web3'


/**
 * Sining message
 * @param {*} message 
 * @returns 
 */
export const signMessage = async (message) => {
    const eth = await getProvider()
    const siner = eth.getSigner()
    const signature = await siner.signMessage(
        message
    )
    return signature
}

/**
 * Convert hex to string
 * @param {*} hex 
 */
export const hexToString = (hex) => {
    return getWeb3().utils.hexToUtf8(hex)
}