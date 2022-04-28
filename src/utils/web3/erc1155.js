import { getContract } from '@/utils/web3/contract'
import { insertErc1155 } from '@/apis/api'
import { getAccounts } from './account'

export const isErc1155 = async (address) => {
    return new Promise(async (resolve, reject) => {
      let contract;
      try{
        contract = await getContract('ERC1155', address);
      }catch(e) {
        console.log(777);
        reject(e);
        return;
      }
  
      try{
        const res = await contract.supportsInterface(0xd9b67a26);
        resolve(true);
      }catch(e){
        resolve(false);
      }
    })
  }

export const getBalance = async (asset) => {
    return new Promise(async (resolve, reject) => {
        let contract;
        let address;
        let id;
        try {
          address = asset.substring(0, 42);
          id = parseInt(asset.substring(42, asset.length))
          contract = await getContract('ERC1155', address);
        }catch(e) {
          console.log(888);
          reject(e);
          return;
        }

        try{
          const account =await getAccounts();
          const res = await contract.balanceOf(account, id)
          resolve(res.toString() / 1)
        }catch(e) {
            reject(e);
        }
    })
}

export const updateIcon = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await insertErc1155(params)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}