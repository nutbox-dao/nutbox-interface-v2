import { sleep } from "@/utils/helper";
import { getProvider, getReadonlyProvider } from '@/utils/web3/ethers'
import store from "@/store";

export const subBlockNum = async () => {
  const provider = await getReadonlyProvider();
  while (true) {
    try {
      const blockNumber = await provider.getBlockNumber();
      store.commit("web3/saveBlockNum", blockNumber);
    } catch (e) {}
    await sleep(1);
  }
};
