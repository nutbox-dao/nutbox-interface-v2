import axios from 'axios'
import store from '@/store'
import  { getEthWeb, getWeb3, setupNetwork, isUnlocked, connectMetamask } from './web3'
import { getProvider } from './ethers'
import { ethers } from 'ethers'
import { add } from 'lodash'
import { getAccounts } from './account'

/** 
 Contract Addresses
================================================================
RegistryHub:                        0xF6149F38bEA7bB07a779AF30Ee1983566e5E1218
----------------------------------------------------------------
HomeChainAssetRegistry:             0xD8930d33FCb22e9c96D35d7466B86f5801047D4c
----------------------------------------------------------------
SteemHiveDelegateAssetRegistry:     0x594931B680872b924bc66bBf21369Cde46D1d235
----------------------------------------------------------------
SubstrateCrowdloanAssetRegistry:    0x0EA245d9e163f8E112C4B7a5434e58201c4c36b4
----------------------------------------------------------------
SubstrateNominateAssetRegistry:     0x65Ea6C8299cDc716d19eB7Bd575EFeB9aCa58c1D
----------------------------------------------------------------
ERC20AssetHandler:                  0x5aE09cDE2955872be4E2346ce012e8263c6E8406
----------------------------------------------------------------
ERC721AssetHandler:                 Not Deployed
----------------------------------------------------------------
TrustlessAssetHandler:              0x6dec5623Ceb1e790316832B44a4560F4ee85576f
----------------------------------------------------------------
Executor:                           0xbce61B30395f82bB60171f5362c4010427509088
----------------------------------------------------------------
Bridge:                             0x0Bdda4f918839fc223faE4769979b8f67F62DF15
----------------------------------------------------------------
StakingFactory:                     0x129E6A65c96E5585263AB09d42baF96644F2028D
================================================================
*/


// contract file name
const CONTRACT_ABI_FILE_NAME_LIST = {
    REGISTRYHUB: 'RegistryHub.json',
    HOMECHAINASSETREGISTRY:'HomeChainAssetRegistry.json',
    STEEMHIVEDELEGATEASSETREGISTRY:'SteemHiveDelegateAssetRegistry.json',
    SUBSTRATECROWDLOANASSETREGISTRY:'SubstrateCrowdloanAssetRegistry.json',
    SUBSTRATENOMINATEASSETREGISTRY:'SubstrateNominateAssetRegistry.json',
    ERC20ASSETHANDLER:'ERC20AssetHandler.json',
    TRUSTLESSASSETHANDLER:'TrustlessAssetHandler.json',
    EXECUTOR:'',
    BRIDGE:'Bridge.json',
    STAKINGFACTORY:'StakingFactory.json'
}

// Get contract Abi
export const getAbi = async function (contractName) {
    contractName = contractName.toUpperCase()
    if (store.state.web3.abis[contractName]){
        return store.state.web3.abis[contractName]
    }
    const res = await axios.get('/'+CONTRACT_ABI_FILE_NAME_LIST[contractName])
    const abi = res.data.abi
    if (abi){
        store.commit('web3/saveAbi', {name: contractName, abi})
        return abi
    }
}

// Get contract
export const getContract = async function (contractName, address) {
    // const abi = await getAbi(contractName)
    // if (!abi) return;
    // const eth = await getWeb3()
    // const contract = new eth.eth.Contract(abi, address);
    // return contract
    if (await isUnlocked()){
        console.log('metamask locked');
        await connectMetamask()
    }
    if (!store.state.account){
        const accounts = await getAccounts()
        if (accounts === []){
            console.log('Please unlock wallet');
            return
        }
    }
    if (!store.getters['web3/isMainChain']){
        console.log(44);
        if(!(await setupNetwork())){
            console.log('Wrong chain Id', store.state.web3.chainId);
            // chainId is wrong
            return;
        }
    }
    const provider = await getProvider()
    const abi = await getAbi(contractName)
    if (!provider || !abi) return;
    const contract = new ethers.Contract(address, abi, provider)
    return contract.connect(provider.getSigner())
}