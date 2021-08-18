import axios from 'axios'
import store from '@/store'
import {
  getEthWeb,
  getWeb3,
  setupNetwork,
  isUnlocked,
  connectMetamask
} from './web3'
import {
  getProvider,
  getReadonlyProvider
} from './ethers'
import {
  ethers
} from 'ethers'
import {
  getAccounts
} from './account'
import { errCode, RPC_NODE } from '../../config'

export const contractAddress = {
  "RegistryHub": "0x5804B0b7af33CB29d565F80b9617aF2CACA1ed5f",
  "HomeChainAssetRegistry": "0x546b0e0C9f18FF943F93936baBD5214D513875CD",
  "SteemHiveDelegateAssetRegistry": "0x625A331008A895add77815ad6d75fF3aBbD77DcB",
  "SubstrateCrowdloanAssetRegistry": "0x8A7f2939278419492fDB36AC5A9b63F1FaC92067",
  "SubstrateNominateAssetRegistry": "0xf57A408AD75C5E578d773a1BAaF6cAD3B50Bd7AD",
  "ERC20AssetHandler": "0x7451F9987825978d061f61783A84632095784914",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x4aB30f5A3697336b58bDb8DF9f0A4E370C193d8c",
  "Executor": "0xE8995a2B477990DA769d811FF537b04A3E719dA1",
  "Bridge": "0x4Beb82c5d75d3EE65554F216B1de24338A166D4a",
  "StakingFactory": "0x2dF32A3cd491112a6896b1575D9278164CD335Cd",
  "ERC20Factory": "0xabdcE0BB24e749bAc2A63c4eb85F42A16285D420"
}

// contract file name
const CONTRACT_ABI_FILE_NAME_LIST = {
  RegistryHub: 'RegistryHub.json',
  HomeChainAssetRegistry: 'HomeChainAssetRegistry.json',
  SteemHiveDelegateAssetRegistry: 'SteemHiveDelegateAssetRegistry.json',
  SubstrateCrowdloanAssetRegistry: 'SubstrateCrowdloanAssetRegistry.json',
  SubstrateNominateAssetRegistry: 'SubstrateNominateAssetRegistry.json',
  ERC20AssetHandler: 'ERC20AssetHandler.json',
  TrustlessAssetHandler: 'TrustlessAssetHandler.json',
  Executor: '',
  Bridge: 'Bridge.json',
  StakingFactory: 'StakingFactory.json',
  StakingTemplate: 'StakingTemplate.json',
  ERC20: 'ERC20.json',
  SimpleERC20: 'SimpleERC20.json',
  MintableERC20: 'MintableERC20.json',
  ERC20Factory: 'ERC20Factory.json'
}

// Get contract Abi
export const getAbi = async function (contractName) {
  if (store.state.web3.abis[contractName]) {
    return store.state.web3.abis[contractName]
  }
  const res = await axios.get('/' + CONTRACT_ABI_FILE_NAME_LIST[contractName])
  const abi = res.data
  if (abi) {
    store.commit('web3/saveAbi', {
      name: contractName,
      abi
    })
    return abi
  }
}

// Get contract
export const getContract = async function (contractName, address, onlyRead=true) {
  return new Promise(async (resolve, reject) => {
    await connectMetamask()
      // wheather metamask is locked
    if (await !isUnlocked() && !onlyRead) {
      console.log('metamask locked');
      try{
        await connectMetamask()
      }catch(e){
        reject(errCode.NOT_CONNECT_METAMASK);
        return;
      }
    }
    // wheather get account
    if (!store.state.web3.account && !onlyRead) {
      const accounts = await getAccounts()
      if (accounts === []) {
        console.log('Please unlock wallet');
        reject(errCode.UNLOCK_METAMASK)
        return
      }
    }
    // Wheather connect to BSC network
    if (!store.getters['web3/isMainChain'] && !onlyRead) {
      if (!(await setupNetwork())) {
        console.log('Wrong chain Id', store.state.web3.chainId);
        // chainId is wrong
        // TODO
        // reject(errCode.WRONG_CHAIN_ID);
        // return;
      }
    }

    const abi = await getAbi(contractName)
    if (!onlyRead){
      const provider = await getProvider()
      if (!provider || !abi) {
        reject(500);
        return;
      };
      // construct contract
      const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
      // inject metamask
      resolve(contract.connect(provider.getSigner()))
    }else{
      const provider = getReadonlyProvider()
      const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
      resolve(contract)
    }
  })
}

/**
 * Judge address wheather a contract address
 * @param {*} address 
 */
export const isContractAddress = async (address) => {
  const provider = await getWeb3()
  try{
    const res = await provider.eth.getCode(address)
    return res
  }catch(e){
    return false
  }
}