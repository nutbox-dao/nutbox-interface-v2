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
  "RegistryHub": "0x617ac2adB645DF95687A4a068b0768232cB241dc",
  "HomeChainAssetRegistry": "0x816A7b084d9E0F3eCB55Fe9E6dB2F2278278f74a",
  "SteemHiveDelegateAssetRegistry": "0xC236dCfF0D850B37CF38057dB804c948bDc19E05",
  "SubstrateCrowdloanAssetRegistry": "0xe02E43C61fA9989B35264a18BD8F646f6666a069",
  "SubstrateNominateAssetRegistry": "0xA862B53C667Da851A8b993099Dd70629522CDF73",
  "ERC20AssetHandler": "0x1F82964E3CB9BAE6784985059D7dD4A2187FEaef",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0xB6bfBbe38d4C2588FeAD83B4Cb0F6bdD71422A2A",
  "Executor": "0xe8f3Fe11D129BC2Dd54eA0Eb694FFf71E8569372",
  "Bridge": "0xB859927898edFe522F0aAd165615bEFFA2933031",
  "StakingFactory": "0x1510683E9E7a661Dfd35F7983c5c0462b88Ad323"
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