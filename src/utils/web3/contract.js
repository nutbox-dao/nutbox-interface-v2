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
  "RegistryHub": "0x9be33C22543a0572235c9487Ac79341669ee1595",
  "HomeChainAssetRegistry": "0xAbF3859c5A0420a086683E35EDDE2c427facd561",
  "SteemHiveDelegateAssetRegistry": "0xd1D030e521A60186f67CB8D3f88913FcC55CBE5c",
  "SubstrateCrowdloanAssetRegistry": "0xaD7b465483e78A08347Bab8549249249d2137121",
  "SubstrateNominateAssetRegistry": "0x1e2B071b96CF4ce071469dc0677652b4fecCcB5a",
  "ERC20AssetHandler": "0x69bF340bD56C469b203A00506483F13dA0Ea597F",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x21B2756B398D58Ee85E104Cd9aF7D734c600F2Dc",
  "Executor": "0x9B5cC55401Bb5f5a8653Ed3B1D2B4126f12f68Ef",
  "Bridge": "0x2D2795082dC9C1cf18778f0cAb53A93E93f6067C",
  "StakingFactory": "0xe867b7F73DAC70EEd843CcC469e896690772f852",
  "ERC20Factory": "0x76a67a43BDc2396Af1202F45066bB2e4aCD9813B"
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