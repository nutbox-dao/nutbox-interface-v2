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
  "Committee": "0x5288DA783695DAb739ab5e1d7BF0d4920667809B",
  "MintableERC20Factory": "0x95a3119660ed199d36cCfdE29E07af1afDDa1B7c",
  "NutPower": "0x9C5493ea3a6414f83A0d867329A67f7741071669",
  "CommunityFactory": "0x6c999d6C30B2016611eBBbFA53793d2522A66250",
  "LinearCalculator": "0x604a7CADDFf6Cc87cf3cB74Adb0580c53E91B6d8",
  "SPStakingFactory": "0x6383b535e7EC5f24aC1e9cf32fca6cbFa8fD251B",
  "ERC20StakingFactory": "0x1AC355145e523C1295D5AB8cC6f37087E286B94E",
  "ERC1155StakingFactory": "0xE3E39F2C35C52330D3462Ce961C3d177153D1352",
  "CosmosStakingFactory": "0x1E2f12267D587c571ba147193DB94ED64C7e269f",
  "Gauge": "0x306fb5447FCE4960E74cD28C22a1A7627cae678F"
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
