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
  "Committee": "0xa965a23fF72805576002a0971a38A22a0c715A86",
  "MintableERC20Factory": "0x24B2c677575286993Be95147B4896d83cE02Dc4e",
  "NutPower": "0x183434ba0726b244521cB1C46AE5C90538146db8",
  "CommunityFactory": "0xFe992EF5f73Ac289052F1742B918278a62686fD1",
  "LinearCalculator": "0xf6DDd65295Ca7A672C34043aa62f32C01FBfb29D",
  "SPStakingFactory": "0x420E3b63F2587702B0BCdc50aF948cF387515593",
  "ERC20StakingFactory": "0x5A95D35579C3aaF7F1df86540286A9DD90506F00",
  "ERC1155StakingFactory": "0x8d7F753D3b3862169d9eee500de3F7220103eAAd",
  "CosmosStakingFactory": "0x20ABc409b7dc7a6DC8cC1309A5A7DBb5B1c0D014",
  "Gauge": "0xF21649D901A082772Bd7B5d5eD5039C7a43A5789",
  "TreasuryFactory": "0x97e9ca88Eb99bAA07d15B8aB846c53886FDB2f74",
  "CommunityCuration": "0x3686218f11c58ca46479acc5DdEE7e41374dF73A",
  "TaxedERC20StakingFactory": "0x9C2804015b55D02F0cBeDa1ee8a9c24Ee7aF00d7"
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
  } else if (type === 'curation') {
    return contractAddress.CurationGaugeFactory
  } else if (type === 'taxederc20staking') {
    return contractAddress.TaxedERC20StakingFactory
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
  } else if (type === 'curation') {
    return 'CurationGaugeFactory'
  } else if (type === 'taxederc20staking') {
    return "TaxedERC20StakingFactory"
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
  "CurationGauge": "CurationGauge.json",
  "CurationGaugeFactory": "CurationGaugeFactory.json",
  "NutPower": "NutPower.json",
  "Gauge": "Gauge.json",
  "CosmosStaking": "CosmosStaking.json",
  "CosmosStakingFactory": "CosmosStakingFactory.json",
  "TreasuryFactory": "TreasuryFactory.json",
  "Treasury": "Treasury.json",
  "CommunityCuration": "CommunityCuration.json",
  "TaxedERC20StakingFactory": "TaxedERC20StakingFactory.json"
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
