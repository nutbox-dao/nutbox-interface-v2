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
import {
  errCode
} from '../../config'

export const contractAddress = {
  "Committee": "0x4801C5D106445446a10011b8b06CcC35d8b895C6",
  "MintableERC20Factory": "0xCebC421C209D1c4E7F3061e9ea3384bca14C5761",
  "NutPower": "0x673CD0a416E544DBdEBec9004FFe4d8D26c1CB6c",
  "CommunityFactory": "0xb54c72f79677a3bb6A9Cd50319EE56C8B1828753",
  "LinearCalculator": "0xb035C2bD1F0D2f36d78B9161Ca8F04aA81DCD20E",
  "SPStakingFactory": "0xAEF7648Dac07CD8Fe997F9740d3ac2e2983154cc",
  "ERC20StakingFactory": "0xb71A12De824B837eCD30D41384e80C8CDFb5D694",
  "ERC1155StakingFactory": "0xC4f7E12435a9760D5470e7c059Cd997A56636e6a",
  "CosmosStakingFactory": "0xECB3d70B557609C9F86295A167601aCBfBFA4C70",
  "Gauge": "0x01a686E3B17C97E6209a1A7B25D49F9D36ad6Ab1",
  "TreasuryFactory": "0x4a9ADE2cbC664a93A71283332b739308d7a3E887"
}

export const getPoolFactory = (type) => {
  if (type === 'erc20staking') {
    return contractAddress.ERC20StakingFactory
  } else if (type === 'steem' || type === 'hive' || type === 'steem-witness') {
    return contractAddress.SPStakingFactory
  } else if (type === 'cosmos' || type === 'atom' || type === 'osmo' || type === 'juno') {
    return contractAddress.CosmosStakingFactory
  } else if (type === 'erc1155') {
    return contractAddress.ERC1155StakingFactory
  }
}

export const getPoolTypeName = (type) => {
  if (type === 'erc20staking') {
    return 'ERC20StakingFactory'
  } else if (type === 'steem' || type === 'hive' || type === 'steem-witness') {
    return 'SPStakingFactory'
  } else if (type === 'atom' || type === 'osmo' || type === 'cosmos' || type === 'juno') {
    return 'CosmosStakingFactory'
  } else if (type === 'erc1155') {
    return 'ERC1155StakingFactory'
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
  "SPStaking":"SPStaking.json",
  "ERC20": "ERC20.json",
  "ERC1155": "ERC1155.json",
  "ERC1155Staking": "ERC1155Staking.json",
  "ERC1155StakingFactory": "ERC1155StakingFactory.json",
  "NutPower": "NutPower.json",
  "Gauge": "Gauge.json",
  "CosmosStaking": "CosmosStaking.json",
  "CosmosStakingFactory": "CosmosStakingFactory.json",
  "TreasuryFactory": "TreasuryFactory.json",
  "Treasury": "Treasury.json"
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
export const getContract = async function (contractName, address, onlyRead = true) {
  return new Promise(async (resolve, reject) => {
    // await connectMetamask()
    // wheather metamask is locked
    if (await !isUnlocked() && !onlyRead) {
      console.log('metamask locked');
      try {
        await connectMetamask()
      } catch (e) {
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
    if (!onlyRead) {
      const provider = await getProvider()
      if (!provider || !abi) {
        reject(500);
        return;
      };
      // construct contract
      const contract = new ethers.Contract(contractAddress[contractName] || address, abi.abi, provider)
      // inject metamask
      resolve(contract.connect(provider.getSigner()))
    } else {
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
  try {
    const res = await provider.getCode(address)
    console.log(643, res);
    return res
  } catch (e) {
    return false
  }
}
