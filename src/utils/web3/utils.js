import { getProvider } from './ethers'


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
