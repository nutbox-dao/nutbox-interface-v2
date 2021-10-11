import axios from 'axios'
import store from '@/store'
import {
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
import { errCode } from '../../config'

export const contractAddress = {
  "RegistryHub": "0x051ad4E33324EB193Ad9e4f56876c4FBE2d38CC9",
  "ERC20Factory": "0x7a57fAB6C10c7D65Af613E86a9e67c55497BEa97",
  "HomeChainAssetRegistry": "0x1B4296c40336F6f4c91E53A9Cf04f076db0cCFFB",
  "SteemHiveDelegateAssetRegistry": "0xC6Aa5d949e6eA2d7C4e10e37AA3CF3A28849c94A",
  "SubstrateCrowdloanAssetRegistry": "0x609b7e0ED70175368b209f640162DA076c2C168C",
  "SubstrateNominateAssetRegistry": "0xFD96F84Ce2de835462c08C8baA40D57CaE1ae7a9",
  "ERC20AssetHandler": "0x97cA655920cd81e66E63eD3aAbD8749CF2A81682",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x0236a8De69E9EE114C86689dCb475E978638618e",
  "Executor": "0x060a1145Ad8E57AaEbed6F3465ce6c51afd73FFe",
  "Bridge": "0x33049748Eae7194277EeaBB1d4aEFC1B6c472240",
  "StakingFactory": "0xCA10E05b0C468cF7B055B2a7124F75EA6A0E843e",
  "LinearCalculator": "0xA1DB44327535cB180027F7558825d5C0afe17e8E"
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
  ERC20Factory: 'ERC20Factory.json',
  LinearCalculator: 'LinearCalculator.json'
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
    const account = await getAccounts();
    if (!account && !onlyRead) {
      console.log('Please unlock wallet');
      reject(errCode.UNLOCK_METAMASK)
      return
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