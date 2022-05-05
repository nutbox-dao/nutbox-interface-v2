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
  "Committee": "0x524d1C459DE80820D8EeeDdbeB891799c5523C85",
  "MintableERC20Factory": "0x42A2D3D7cf116c56f1D47643B3524E78b867aBb7",
  "NutPower": "0x5CD907265f54590c4e035Af3D1Dd731AeED82603",
  "CommunityFactory": "0x113866ac496Bd85A8A8a687d04139bA441d09276",
  "LinearCalculator": "0xa1E0844D21544B2893064fA4e8b0d249872dB44A",
  "SPStakingFactory": "0x9Df9D7412E4462AA863A35B54142d1D35F07b214",
  "ERC20StakingFactory": "0xF897E61D2bd4002B5dE45026f6a9F5b4704Cb8Be",
  "ERC1155StakingFactory": "0x54301D1dc7751B1824cF3020a3f479112caD738c",
  "CosmosStakingFactory": "0xbe1709B3D175aaecA132BEA8630063E99f090D68",
  "Gauge": "0x56c44B51eaCcd283024523dF1268A8E01887C218",
  "TreasuryFactory": "0xF4F07B25d28F963dc3FadE4e75Cfaa3F607770F1"
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
