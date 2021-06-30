import store from '@/store'
import { getWeb3 } from './web3'
import { getProvider } from './ethers'


export const sign = async () => {
    const address = store.state.web3.account
    console.log(432, address);
    const eth = await getProvider()
    const siner = eth.getSigner()
    const si = await siner.signMessage(
        'gew3443sag'
    )

    const web3 = getWeb3()
    const r = web3.eth.accounts.recover('gew3443sag', si)

    console.log(5432, si, r);
}
