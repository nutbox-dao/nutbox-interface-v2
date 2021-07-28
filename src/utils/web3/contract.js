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
  "RegistryHub": "0xd2Ea5be039c3E312FD573544fE7890C952Df9E9C",
  "HomeChainAssetRegistry": "0x4ee6Fa0A061554798f47c37fb41F8728E9312bfD",
  "SteemHiveDelegateAssetRegistry": "0xBfdd9061F3544F75040c0Dd2e3c3c8E4ac6B2B2D",
  "SubstrateCrowdloanAssetRegistry": "0x07531d37745c49e5dd242E78566BDb78E9a725Bf",
  "SubstrateNominateAssetRegistry": "0xfb11149037d965D0E8349e7724817Da68B006404",
  "ERC20AssetHandler": "0xBA7579E58C35332F550BA29114DeEabe3EBaB542",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0xcb60A84C71302D5f9e84F01F02B1815EC8a0f979",
  "Executor": "0xE1Ecc921eeD5E6cd0c6f8970041e63488d283989",
  "Bridge": "0xf1c0c690df1E48fC13D025F45e1feb23B4979B62",
  "StakingFactory": "0xA0DdF87530eD3C8da4Bd4Df6359ee61023ee87d5"
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
export const getContract = async function (contractName, address, onlyRead=true) {
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