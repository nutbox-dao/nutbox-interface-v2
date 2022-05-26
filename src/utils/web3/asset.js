import {
  getContract,
  contractAddress
} from "./contract";
import store from '@/store'
import {
  createWatcher,
  aggregate
} from '@makerdao/multicall'
import { sleep } from '@/utils/helper'
import { getAllCommunities, getMyCommunityContract, getNonce } from '@/utils/web3/community'
import { getAccounts } from '@/utils/web3/account'
import {
  ethers
} from "ethers";
import {
  waitForTx,
  getProvider,
  getReadonlyProvider
} from './ethers'
import {
  getAllTokens,
  updateTokenIcon as uti
} from '@/apis/api'
import { 
  errCode,
  Multi_Config
} from "@/config";

/**
 * Get community ctoken info
 * @param {*} update 
 * @returns 
 */
export const getCToken = async (communityId, update=false) => {
  return new Promise(async (resolve, reject) => {
    communityId = communityId.toLowerCase()
    let cTokens = store.state.web3.cTokens
    if (!update && cTokens[communityId]){
      resolve(cTokens[communityId])
      return;
    }
    let contract;
    try{
      contract = await getContract('Community', communityId)
    }catch(e){
      reject(e)
      return
    }

    try{
      const [tokenAddress, isMintable] = await Promise.all([contract.getCommunityToken(), contract.isMintableCommunityToken()])
      try{
        const cToken = await getERC20Info(tokenAddress);
        cToken['isMintable'] = isMintable;
        cTokens[communityId] = cToken;
        store.commit('web3/saveCTokens', cTokens)
        resolve(cToken)
      }catch(e){
        reject(e);
        return
      }
    }catch(e){
      console.log(8889, e);
      reject(errCode.BLOCK_CHAIN_ERR)
      return;
    }
  })
}

// get ERC20 info from home chain.
export const getERC20Info = async (address) => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try{
      contract = await getContract('ERC20', address);
    }catch (e) {
      console.log(666);
      reject(e);
      return;
    }
    try{
      const tokens = await getAllTokenFromBackend()
      let infos = await aggregate([{
        target: address,
        call: ['name()(string)'],
        returns: [
          ['name']
        ]
      },{
        target: address,
        call: ['symbol()(string)'],
        returns: [
          ['symbol']
        ]
      },{
        target: address,
        call:[
          'decimals()(uint8)'
        ],
        returns: [
          ['decimals']
        ]
      },{
        target: address,
        call: [
          'totalSupply()(uint256)'
        ],
        returns: [
          ['totalSupply']  
        ]
      }], Multi_Config)
      const tokenFromBackend = tokens?.filter(token => token.address.toLowerCase() === address.toLowerCase())
      let icon = null
      let price = null
      if (tokenFromBackend && tokenFromBackend.length > 0) {
        icon = tokenFromBackend[0].icon
        price = tokenFromBackend[0].price
      }
      resolve({
        name: infos?.results?.transformed?.name,
        symbol: infos?.results?.transformed?.symbol,
        decimal: infos?.results?.transformed?.decimals,
        totalSupply: infos?.results?.transformed?.totalSupply,
        price,
        address,
        icon
      })
    }catch(e){
      console.log('Wrong ERC20 address', e);
      reject(e)
    }
  })
}

// judge whether the user has mint admin role
export const hasMintAdmminRole = async (token) => {
  return new Promise(async (resolve, reject) => {
    const abi = [
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            }
          ],
          "name": "getRoleAdmin",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "role",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "hasRole",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
    ]
    try{
      const mintRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
      const contract = new ethers.Contract(token, abi, getReadonlyProvider())
      const mintAdminRole = await contract.getRoleAdmin(mintRole);
      const account = await getAccounts();
      const hasMintRole = await contract.hasRole(mintAdminRole, account);
      resolve(hasMintRole);
    }catch(e) {
      resolve(false);
    }
  })
}

// judge whether the community has the token's mint role
export const hasMintRole = async (token, community) => {
  return new Promise(async (resolve) => {
    try{
    const abi = [
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "hasRole",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getRoleMember",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },]
    const contract = new ethers.Contract(token, abi, getReadonlyProvider());
    const mintRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    const hasMintRole = await contract.hasRole(mintRole, community);

    resolve(hasMintRole);
    }catch(err) {
      console.log(643, err);
      resolve(false)
    }
  })
}

// grant mint role to community
export const grantMintRole = async (token, target) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getContract('ERC20', token, false)
      const mintRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
      const tx = await contract.grantRole(mintRole, target);
      await waitForTx(tx.hash);
      resolve(true);
    }catch(e) {
      reject(e)
    }
  })
}

/**
 * Update token icon {address, icon}
 * @param {*} token 
 * @returns 
 */
export const updateTokenIcon = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await uti(token)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Get all tokens from nutbox backend
 * Will store data to cache
 * @param {*} update  wheather update local cache
 * @returns 
 */
export const getAllTokenFromBackend = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const tokens = store.state.web3.allTokens
    if (!update && tokens) {
      resolve(tokens)
    }
    try {
      const allTokens = await getAllTokens()
      store.commit('web3/saveAllTokens', allTokens)
      resolve(allTokens)
    } catch (e) {
      reject(500)
    }
  })
}

/**update tokens info from db */
export const updateAllTokensFromBackend = async () => {
  while(true){
    await getAllTokenFromBackend(true)
    await sleep(10)
  }
}

/**
 * monitor all ctoken balance of user
 * used in wallet
 */
export const getCtokenBalance = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCommunities = await getAllCommunities()
      const account = await getAccounts();
      const result = await aggregate(Object.values(allCommunities).map(c => ({
        target: c.ctoken,
        call:[
          'balanceOf(address)(uint256)',
          account
        ],
        returns:[
          [c.ctoken, val => val.toString() / (10 ** store.getters['web3/tokenDecimals'](c.ctoken))]
        ]
      })), Multi_Config)
      resolve(result.results.transformed)
    }catch (e) {
      console.log('get ctoken balance fail', e);
      reject(e);
    }
  })
}

/**
 * get home chain balance
 * @returns 
 */
export const getBalance = async () => {
  const provider = await getProvider()
  const account = await getAccounts()
  try{
    const balance = await provider.getBalance(account);
    store.commit('web3/saveBalance', balance)
    return balance;
  }catch(e) {
    console.log(5, e);
  }
}

/**
 * get specil erc20 of user
 * @param {*} erc20 
 * @returns 
 */
export const getERC20Balance = async (erc20) => {
  return new Promise(async (resolve) => {
    try{
      const erc20Contract = await getContract('ERC20', erc20);
      const account = await getAccounts();
      if (!account) return 0
      const balanceBI = await erc20Contract.balanceOf(account);
      resolve(balanceBI);
    }catch(e) {
      resolve(-1);
    }
  })
}