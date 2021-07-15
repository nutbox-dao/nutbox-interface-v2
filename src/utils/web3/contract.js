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
  "RegistryHub": "0x9737115919987D5e567B7B2A1cef45Fd2dF7ACA8",
  "HomeChainAssetRegistry": "0x2EF4AA2d75EEBdF620b071a11BeFDB405F0E9d8a",
  "SteemHiveDelegateAssetRegistry": "0xa6E4b951753fa77f9BfB46B28F064F9F2E56BFFC",
  "SubstrateCrowdloanAssetRegistry": "0x7C1F455c04a035501C955B910221c7e4BbF2f663",
  "SubstrateNominateAssetRegistry": "0x06e418f5136c3f080a164dB398ef2844A9dA8928",
  "ERC20AssetHandler": "0x2C2eefCA512325DA8100f99BdDCed1F123AAa52D",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0xD077488eB7532e5E281Ed2EC23eA8A62638f5bc4",
  "Executor": "0x4d036C9B79C9f0747034120c04FB79aDBaABFc75",
  "Bridge": "0x085B5524a7dB2Bc5652121EA95F2013eb5298A41",
  "StakingFactory": "0xFE8AAE1093E1Af2DbFdF3395320DBA741bb43F99"
}

export const erc20Address = '0x31DB9e2c1276356874c94C7648990a898DC3FA8B'

export const multiAddress = '0x823b1eaceF85E3ab6509062810B551C1A80760d9'


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
  SimpleERC20: 'SimpleERC20.json'
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
export const getContract = async function (contractName, address, onlyRead=false) {
  return new Promise(async (resolve, reject) => {
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
  const res = await provider.eth.getCode(address)
  return res
}