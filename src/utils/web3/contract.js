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
  "Committee": "0x3931546cA5399ef0e0b0c7d1d78C89F0e7BeB8AF",
  "MintableERC20Factory": "0x7A220C709aC88B39fB0085BB48Bc584eB89A278F",
  "CommunityFactory": "0x6B70dCfA3E14f532C8C9cB113558254464760023",
  "LinearCalculator": "0xf4991e725Fdccf996F3bAdce2fEC3bDaf94EaeAe",
  "ERC20StakingFactory": "0xF46ddB1Cb72e648138bc902d5D0E984444dC83c5",
  "CrowdloanFactory": "0x5F75409D6BB35D382eF11aaD614EE107ec6FE77f",
  "DelegateDappsStaking": "0xD83Fb1383A76BeaBc13Edba6D92358eDa9145AA8",
  "AstarDappStakingFactory": "0xbBAc3A06eB1918EfC33af78e83E9A3b2D9fe81f3",
  "DappsStaking": '0x0000000000000000000000000000000000005001'
}

export const getPoolFactory = (type) => {
  if (type === 'erc20staking') {
    return contractAddress.ERC20StakingFactory
  } else if (type === 'crowdloan') {
    return contractAddress.CrowdloanFactory
  } else if (type === 'dappstaking') {
    return contractAddress.AstarDappStakingFactory
  }
}

export const getPoolTypeName = (type) => {
  if (type === 'erc20staking') {
    return 'ERC20StakingFactory'
  } else if (type === 'crowdloan') {
    return 'CrowdloanFactory'
  } else if (type === 'dappstaking') {
    return 'AstarDappStakingFactory'
  }
}

// contract file name
const CONTRACT_ABI_FILE_NAME_LIST = {
  "Committee": "Committee.json",
  "CommunityFactory": "CommunityFactory.json",
  "Community": "Community.json",
  "LinearCalculator": "LinearCalculator.json",
  "SPStakingFactory": "SPStakingFactory.json",
  "CrowdloanFactory": "CrowdloanFactory.json",
  "Crowdloan": "Crowdloan.json",
  "ERC20StakingFactory": "ERC20StakingFactory.json",
  "ERC20Staking": "ERC20Staking.json",
  "SPStaking":"SPStaking.json",
  "ERC20": "ERC20.json",
  "AstarDappStakingFactory": "AstarDappStakingFactory.json",
  "AstarDappStaking": 'AstarDappStaking.json',
  "DappsStaking": 'DappsStaking.json'
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