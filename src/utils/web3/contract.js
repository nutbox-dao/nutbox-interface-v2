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

/* export const contractAddress = {
  "Committee": "0xd10e4C1e301A13A9B874bd1757c135Eda075769D",
  "MintableERC20Factory": "0xa183D96a7e84BF77Fb7825026fA8b9BF6894cfa8",
  "CommunityFactory": "0x1A4EeE210Bc54a75D25989546F648474EdF1C0A3",
  "LinearCalculator": "0x6ab448C1C6e1870602d3FB867F167029bbFb3181",
  "SPStakingFactory": "0xF7Fa41BF814eDC767691DDB1864a334D83f4acf7",
  "ERC20StakingFactory": "0xf870724476912057C807056b29c1161f5Fe0199a"
} */

export const contractAddress = {
  "nut": "0xc821eC39fd35E6c8414A6C7B32674D51aD0c2468",
  "Committee": "0x116C1F8c11c041F5e095B35593cD28C438410096",
  "NutPower": "0xD34E7904a1676aF14266321d07fcFA585Ddc08aF",
  "MintableERC20Factory": "0xD8dd76efe29bA2f38b24b8D2EAF23F500b8c95d6",
  "CommunityFactory": "0x15a0055165Fa2d2b64758380FbF8FaF8f016F422",
  "LinearCalculator": "0xA287ef9a4AEFf4A30A173F93B90cc98766B0251c",
  "SPStakingFactory": "0x0C1B497295925F2a8985B5834554C87B5BB5D9C1",
  "ERC20StakingFactory": "0x1BcAf6B35521ac89259d5625B1BfBc157fbd034E",
  "CosmosStakingFactory": "0xf6ecAAd3F991C911253FB887f9d68B9DD41429B0",
  "Gauge": "0xF6d5aB09c6899191712859ff113013E6976842EF"
}

export const getPoolFactory = (type) => {
  if (type === 'erc20staking') {
    return contractAddress.ERC20StakingFactory
  } else if (type === 'steem' || type === 'hive') {
    return contractAddress.SPStakingFactory
  } else if (type === 'cosmos') {
    return contractAddress.CosmosStakingFactory
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
  "SPStaking": "SPStaking.json",
  "ERC20": "ERC20.json",
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
    await connectMetamask()
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
    return res
  } catch (e) {
    return false
  }
}
