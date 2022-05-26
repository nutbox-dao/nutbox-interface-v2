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
  "Committee": "0xffb309E0A5FFF217D2Db1214CBF50807eF9b67eC",
  "MintableERC20Factory": "0x8BE8659519e382E92C0b903f82Cc5c391fFa4220",
  "CommunityFactory": "0x1D9A3352246c586E0f9EFf3B15F53664bFcaFC98",
  "LinearCalculator": "0x1f43ABc3AE5e33C84b80efA837a0303d913B4dAC",
  "ERC20StakingFactory": "0x0FfDac1a59f417fB9f0EC0beb0B583ecF06fC899",
  "CrowdloanFactory": "0xC20Ed1aae3B8318336104bbF3BD2D2c2026dB463",
  "DelegateDappsStaking": "0x79d7F6B690fC92918696B775d849bb4ca757C2fd",
  "AstarDappStakingFactory": "0x0F78eE9b58B850B0E13025c03a2E2D94D87072C7",
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