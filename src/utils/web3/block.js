import { sleep } from "@/utils/helper";
import { getReadonlyProvider } from '@/utils/web3/ethers'
import store from "@/store";
import { BLOCK_SECOND } from '@/constant'
import { RPC_NODE } from '@/config'
import { ethers } from 'ethers'

export const subBlockNum = async () => {
  try {
    // 创建 WebSocket 提供者
    const wsProvider = new ethers.providers.WebSocketProvider(
      'wss://bnb.api.onfinality.io/public-ws'
    );

    // 监听新区块
    wsProvider.on('block', (blockNumber) => {
      // console.log('New block:', blockNumber);
      store.commit("web3/saveBlockNum", blockNumber);
    });

    // 监听连接状态
    wsProvider.on('error', (error) => {
      console.error('WebSocket error:', error);
      // 如果 WebSocket 连接失败，回退到轮询方式
      fallbackToPolling();
    });

    // 监听连接关闭
    wsProvider.on('close', () => {
      console.log('WebSocket connection closed');
      // 如果连接关闭，回退到轮询方式
      fallbackToPolling();
    });

    // 获取当前区块高度
    const currentBlock = await wsProvider.getBlockNumber();
    store.commit("web3/saveBlockNum", currentBlock);

  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
    // 如果 WebSocket 连接失败，回退到轮询方式
    fallbackToPolling();
  }
};

// 回退到轮询方式
const fallbackToPolling = async () => {
  console.log('Falling back to polling mode');
  const provider = await getReadonlyProvider();
  while (true) {
    try {
      const blockNumber = await provider.getBlockNumber();
      store.commit("web3/saveBlockNum", blockNumber);
    } catch (e) {
      console.error('get block fail', e)
    }
    await sleep(3);
  }
};
