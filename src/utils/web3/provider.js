import { StaticJsonRpcProvider } from "@ethersproject/providers";
import networks from "../../assets/networks/networks.json";

const providers = {};

export async function getProvider(network) {
  const url = networks[network].rpc[0];
  if (!providers[network]) providers[network] = new StaticJsonRpcProvider(url);
  return providers[network];
}

export async function getBlockNumber(network) {
  try {
    const blockNumber = await getProvider(network).getBlockNumber();
    return parseInt(blockNumber);
  } catch (e) {
    return Promise.reject();
  }
}
