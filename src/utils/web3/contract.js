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
  "RegistryHub": "0x44bEdacc3B1DE060768499ea8EA5951A72333B38",
  "ERC20Factory": "0xAFCa880882b95A5d32245DF032ce8146e87a9B7a",
  "HomeChainAssetRegistry": "0x4Fe7Ae9a90Ea123754fAF83dc0D7a78EF6841a1d",
  "SteemHiveDelegateAssetRegistry": "0xFb1Da36E48D3D8fE020388F90E89D9C739eaE5fC",
  "SubstrateCrowdloanAssetRegistry": "0x4CBE1Bf676e290e29f76f1Ee7BE0415c9792508A",
  "SubstrateNominateAssetRegistry": "0x0e3E9e86f3c0080859363898b86179312E42A838",
  "ERC20AssetHandler": "0x475D6E3B52cAf62Db7b75eFE268ec17d707cF552",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x2Eb7E7de6db39E633629F328355445024e33781d",
  "Executor": "0x879b26a1007653b3be59c5B06ac59264f6bB9047",
  "Bridge": "0x2F004DC2D197BF052dafE4d4E0e274077687E111",
  "StakingFactory": "0x0581B890D690BC748A39a643F1dAA95B5911cc08",
  "LinearCalculator": "0x8f203dd5F056d826EC072fBe7D4a0190e94A8d85"
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