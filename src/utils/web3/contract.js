import axios from 'axios'
import store from '@/store'
import  { getEthWeb, getWeb3, setupNetwork, isUnlocked, connectMetamask } from './web3'
import { getProvider } from './ethers'
import { ethers } from 'ethers'
import { add } from 'lodash'
import { getAccounts } from './account'

const contractAddress = {
    "RegistryHub": "0x59A040E99f62445C52f2f272b5AeEC0FF1b5A133",
    "HomeChainAssetRegistry": "0x5B91d7D24Ec4e1A29B9699e8cf351D1e29c558Bc",
    "SteemHiveDelegateAssetRegistry": "0xD09AE2e3Fe4aA2C82BD1Af8cB8949142b1C680ed",
    "SubstrateCrowdloanAssetRegistry": "0x3a21674E35A289f21C3943341BccD34138EBf822",
    "SubstrateNominateAssetRegistry": "0xf2148de8c870a7dE80C2aC375674d5A4f29a191D",
    "ERC20AssetHandler": "0x3E9fD32A9362Ae6b5f0BF2deE64A5Dc697E6E8c7",
    "ERC721AssetHandler": "Not Deployed",
    "TrustlessAssetHandler": "0xD6f2787a1e3f47f2Af7D3AF7b1234dd867FcCA4D",
    "Executor": "0xA3416425349b8e58224568061B1dE5AdddF24F8b",
    "Bridge": "0x4ED6182c783580DD994BFe3cFaF6347eB78CE49F",
    "StakingFactory": "0xf25E87B994945280C4CA1C3042e8bb465efC3F00"
  }

const erc20Address = '0x0a5101FaB7Ed01F9B6D8bEDd94BC617D7ed6Bad9'


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