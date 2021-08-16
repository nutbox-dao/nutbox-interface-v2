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
  "RegistryHub": "0xB2051Db5C8882248362f9c0ccf0DE54A23642386",
  "HomeChainAssetRegistry": "0xdFb821e4fB0c7adb136510Dfd4134A9daD24F745",
  "SteemHiveDelegateAssetRegistry": "0x0fBb5b7D47794a41cb6d1CbD8A1FFCc4374Baf85",
  "SubstrateCrowdloanAssetRegistry": "0x1530A74c7d735E622dc8094956AeBBDe2Eb33f62",
  "SubstrateNominateAssetRegistry": "0x0429B4B49e80173bFBFBabbF2feC6Eee85047725",
  "ERC20AssetHandler": "0xBe9984a1776D720599a81c0aD6498427b1303ADF",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0xe5F8923950adD071D9A96A974C826BD707DCFfc3",
  "Executor": "0xbb6c62D226570141f5456a8f50e632691d8A2320",
  "Bridge": "0x00cfaa7aEE20e047fE90EC5c1Ce7269fcaE1531a",
  "StakingFactory": "0x129dF7B722818C5fDF9336B089B1895A67aadc73"
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
  MintableERC20: 'MintableERC20.json'
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