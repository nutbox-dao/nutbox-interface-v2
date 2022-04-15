import { getContract } from '@/utils/web3/contract'

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
        const res = await contract.supportsInterface("0x00000000");
        resolve(true);
      }catch(e){
        resolve(false);
      }
    })
  }

export const getBalance = async (address, id) => {
    return new Promise(async (resolve, reject) => {
        let contract;
        try {
            contract = await getContract('ERC1155', address);
        }catch(e) {
            console.log(888);
            reject(e);
            return;
        }

        try{
            const res = await contract.balanceOf(address, id)
            resolve(res.toString() / 1)
        }catch(e) {
            reject(e);
        }
    })
}