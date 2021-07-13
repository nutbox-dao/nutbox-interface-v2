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
  getProvider
} from './ethers'
import {
  ethers
} from 'ethers'
import {
  getAccounts
} from './account'

export const contractAddress = {
  "RegistryHub": "0xc90a16c1351F955eF13580E3894Eb8432c122121",
  "HomeChainAssetRegistry": "0x20DB6DC3769f5EEF061996251AaAAaBa874B8281",
  "SteemHiveDelegateAssetRegistry": "0x7dF059b35A03Ddc534369f820598877608A7388C",
  "SubstrateCrowdloanAssetRegistry": "0x1F429348aE6230Ab839B6F4833E5029CabFB5225",
  "SubstrateNominateAssetRegistry": "0x20C1AE5152123138789752eD071E174C384B2339",
  "ERC20AssetHandler": "0xB53bf8425797dB097c63a31C9f5bFF66b62A4463",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x314b99bf374422f24530A5ef970AE867C8e1248c",
  "Executor": "0xcfb93c1f4490f38D07a5Cbaa451762d601a1673A",
  "Bridge": "0x673ba450ab607B30c7467e5B61488E4b6e9d7c56",
  "StakingFactory": "0xB907A98b897Df916C2166bAf80D4E76EaE97b1B1"
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
export const getContract = async function (contractName, address) {
  // wheather metamask is locked
  if (await !isUnlocked()) {
    console.log('metamask locked');
    await connectMetamask()
  }
  // wheather get account
  if (!store.state.account) {
    const accounts = await getAccounts()
    if (accounts === []) {
      console.log('Please unlock wallet');
      return
    }
  }
  // Wheather connect to BSC network
  if (!store.getters['web3/isMainChain']) {
    if (!(await setupNetwork())) {
      console.log('Wrong chain Id', store.state.web3.chainId);
      // chainId is wrong
      return;
    }
  }
  const provider = await getProvider()
  const abi = await getAbi(contractName)
  if (!provider || !abi) return;
  // construct contract
  const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
  // inject metamask
  return contract.connect(provider.getSigner())
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