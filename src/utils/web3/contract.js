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
  "RegistryHub": "0x1546eFd6D99CC4A0Ba988Ef91969223a13aFF3ba",
  "HomeChainAssetRegistry": "0x11Ce252eC53B17eea8142B35cB7655abE1135729",
  "SteemHiveDelegateAssetRegistry": "0xC862490F789668813eea90D0569C334C7B38b71d",
  "SubstrateCrowdloanAssetRegistry": "0xB245818dEf1d4dcd72822A597FE8f33ef34423b1",
  "SubstrateNominateAssetRegistry": "0x3Db391dd8206EB6E06f376dD42d78EC0bca42Af6",
  "ERC20AssetHandler": "0xf64F83914C6d97f67DCfc3831d6e8EF1e4691cA3",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x8a2fD6Cb053e5D7362b1e497f2e40a0102B7f90D",
  "Executor": "0xC84CF47859Bf8DA0C6d5B39e213B558396F018Df",
  "Bridge": "0xE229902E77A24A231cDD79B2F845d82f6a105054",
  "StakingFactory": "0xb5bF9a3Adce4042241126d7A43B6bA4EEf40Da20",
  "ERC20Factory": "0x28c7e709378Dd308aC87119A7D7AA42677EF923B"
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