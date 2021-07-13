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
  "RegistryHub": "0x632fc5A0e9b214F6f762801cFA8b6b6bB1448345",
  "HomeChainAssetRegistry": "0xc37d848BC48348ed3F3ede5E5425C87Bf5d98356",
  "SteemHiveDelegateAssetRegistry": "0x436796Eaeb12A568272B1B03C767bE39d21B2061",
  "SubstrateCrowdloanAssetRegistry": "0x66D577002c08b51E18BB0cF95f8D56902AE1ec3C",
  "SubstrateNominateAssetRegistry": "0x1457F920A5374F84A373bc95Cc7aB3Ad1637Cd8a",
  "ERC20AssetHandler": "0xea7D2Fd997F3E6cc53C64Cf0e9Aa7CB4D6913da1",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x309938166BfE37FF1E4a6e542d77D26840e031ab",
  "Executor": "0xB505615D709dD74784dCcD94ce8c786E7A7f5DF6",
  "Bridge": "0x488D3ef38eE843D3100730a7f09Dfd58E64a36Ed",
  "StakingFactory": "0xFdE755Fc2B257312ad19934fB84F017DA107b3dE"
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