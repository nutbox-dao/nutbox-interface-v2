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
  "RegistryHub": "0x73b25F3d1E4ba1F2a724E825bA4Abf9DBadA9f54",
  "HomeChainAssetRegistry": "0x47f41Af1BbdBF851e1b5761e16800d390D6aA128",
  "SteemHiveDelegateAssetRegistry": "0x1D53734120F2B8a270498E51d792536f2e21FFff",
  "SubstrateCrowdloanAssetRegistry": "0x57C7491Cd83a87848440F71BEf87165aDfFCA427",
  "SubstrateNominateAssetRegistry": "0x8c65FCB32051F5207B85978e1d5B836ac0737e96",
  "ERC20AssetHandler": "0x401f7B95405738b58B46B20b3cFc0cF1ab4Cfd1B",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0xD3Fd472D5bAF852ebe190C5531E06920586cdcb1",
  "Executor": "0x00533421d27DBdDdbA3cE2E5bF03f7387F930BD5",
  "Bridge": "0xec4EF38Aee668eB894CaFEc6f08D3f814AaB07d2",
  "StakingFactory": "0x0Bc4E2415aACab1461a09F6AF3DE9104E98A6EDA"
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