import { sleep } from "@/utils/helper";
import { getWeb3 } from "@/utils/web3/web3";
import store from "@/store";

export const subBlockNum = async () => {
  const web3 = await getWeb3();
  while (true) {
    try {
      const blockNumber = await web3.eth.getBlockNumber();
      store.commit("web3/saveBlockNum", blockNumber);
    } catch (e) {}
    await sleep(1);
  }
};
