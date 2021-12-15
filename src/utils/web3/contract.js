import axios from 'axios'
import store from '@/store'
import {
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
  "Committee": "0xdcA68eB43d45281Ce48fAfd7b189F641819c3B9a",
  "CommunityFactory": "0x662507a2CBf7e9A6DDdcfC75FE85d9Ed2BE41ccC",
  "LinearCalculator": "0x04C625921cCA87F850590FB835FDC57691a1A808",
  "SPStakingFactory": "0x216fc0FdEE5e40a95a37874C960D65531848194d",
  "ERC20StakingFactory": "0x8B84f7C99619fF5264Eb3BA425efd36307EF225A"
}

export const getPoolFactory = (type) => {
  if (type === 'bsc') {
    return contractAddress.ERC20StakingFactory
  }else if (type === 'steem' || type === 'hive') {
    return contractAddress.SPStakingFactory
  }
}

// contract file name
const CONTRACT_ABI_FILE_NAME_LIST = {
  "Committee": "Committee.json",
  "CommunityFactory": "CommunityFactory.json",
  "Community": "Community.json",
  "LinearCalculator": "LinearCalculator.json",
  "SPStakingFactory": "SPStakingFactory.json",
  "ERC20StakingFactory": "ERC20StakingFactory.json",
  "ERC20Staking": "ERC20Staking.json",
  "ERC20": "ERC20.json"
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
  const provider = await getProvider()
  try{
    const res = await provider.getCode(address)
    return res
  }catch(e){
    return false
  }
}