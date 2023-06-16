import { sleep } from "@/utils/helper";
import { getProvider, getReadonlyProvider } from '@/utils/web3/ethers'
import store from "@/store";
import { ethers } from 'ethers'
import { RPC_NODE } from '@/config'

export const subBlockNum = async () => {
  const provider = getReadonlyProvider();
  while (true) {
    try {
      const blockNumber = await provider.getBlockNumber();
      store.commit("web3/saveBlockNum", blockNumber);
    } catch (e) {}
    await sleep(2);
  }
};