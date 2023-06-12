import { sleep } from "@/utils/helper";
import { getProvider, getReadonlyProvider } from '@/utils/web3/ethers'
import store from "@/store";
import { BLOCK_SECOND } from '@/constant'

export const subBlockNum = async () => {
  const provider = await getProvider();
  while (true) {
    try {
      const blockNumber = await provider.getBlockNumber();
      store.commit("web3/saveBlockNum", blockNumber);
    } catch (e) {}
    await sleep(BLOCK_SECOND);
  }
};