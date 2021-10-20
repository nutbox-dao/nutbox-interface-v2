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
  "RegistryHub": "0xc2E112Bc45f35777f0C174704d9f9ea37E1368AF",
  "ERC20Factory": "0xe435Ae65CebA0455c30892cAb527572b52797cdB",
  "HomeChainAssetRegistry": "0x2C905AeB93C5770102A865794ca7A2A6B6fbDf81",
  "SteemHiveDelegateAssetRegistry": "0x1A0EB7c3f3A4B28dd5C8B1A2dFC4B1f48356D08A",
  "SubstrateCrowdloanAssetRegistry": "0x23e157ED8579F3C48475Bd2b09eF01cc65aE475E",
  "SubstrateNominateAssetRegistry": "0xef137897e84399Da61DC73b289f525Df86C9E24c",
  "ERC20AssetHandler": "0x77eACC29fd0835004fDBF356062e9BDA9e0D5Afe",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x0fa0fF241EcD91fE2F313Bcc255890ab70606F68",
  "Executor": "0x672C0f4D62A068C56c05fA8a2e73d1BE35A536BE",
  "Bridge": "0x972A43985a306955BdE673acb1DbD52af799A0C2",
  "StakingFactory": "0x1fc50dFF29605EF39c120074212F0E2a88dece96",
  "LinearCalculator": "0x1F15fE6e4350dBf39c87924b0eb7Da4b3D4C2B13"
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