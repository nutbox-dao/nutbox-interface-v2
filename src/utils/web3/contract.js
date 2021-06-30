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
  "RegistryHub": "0x8c14CBc1adC2AFec0368da30F448396eF638c794",
  "HomeChainAssetRegistry": "0x0de95fe541D4017A1a64AAe448BA80F07f96A937",
  "SteemHiveDelegateAssetRegistry": "0x2ae3F794c242Baa12E3E96C002b726dDbEdbF396",
  "SubstrateCrowdloanAssetRegistry": "0x9ceC9408d6F82ffEB4255208eaF1e28ACd377f7F",
  "SubstrateNominateAssetRegistry": "0x0FFd1335333B469eC83Dc4555c7C53B8658F5b8e",
  "ERC20AssetHandler": "0xF98b36e8d08A4f87aa078bd8664F8e83b375658B",
  "ERC721AssetHandler": "Not Deployed",
  "TrustlessAssetHandler": "0x8296cb2Eba2B098BE084AcF2AfDe8617589E04Ba",
  "Executor": "0x0163FC86796EdeB4099C083c18929691589cD28c",
  "Bridge": "0x94AF51B6b03AD129c385323FC7500120f389d759",
  "StakingFactory": "0x0E61fA2d0F11370847c4DEF2c4222c7e71487D43"
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
