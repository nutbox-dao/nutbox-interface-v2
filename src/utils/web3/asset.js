import {
  getContract,
  getAbi
} from "./contract";
import store from '@/store'
import {
  Contract,
  ethers,
  utils
} from "ethers";
import {
  getProvider
} from './ethers'
import {
  Transaction_config
} from '@/config'

export const getRegitryAssets = async () => {
  const account = store.state.web3.account
  const contract = await getContract('RegistryHub');
  if (!contract) return;
  const assetCount = await contract.registryCounter(account);
  let assets = await Promise.all((new Array(assetCount).toString().split(',').map((item, i) => contract.registryHub(account, i))))
  const isTrustless = await Promise.all(assets.map(asset => contract.isTrustless(asset)))
  assets = assets.map((asset, index) => ({
    asset,
    isTrustless: isTrustless[index]
  }));
  const homechainasset = assets.filter(a => !a.isTrustless)[0].asset
  const homechaintokenaddress = await contract.getHomeLocation(homechainasset)
  console.log(await getERC20Info(homechaintokenaddress));

  return assets
}
// "0xa4cdab0282b3b084c1cf26eb76a7bf0d56101b9b4332d63d5b964ee507e7d2c3"

// get ERC20 info from chain.
// TODO:  Change to get info from our server
export const getERC20Info = async (address) => {
  const contract = await getContract('ERC20', address);
  if (!contract) return;
  const infos = await Promise.all([contract.name(), contract.symbol()])
  return infos;
}

/**
 * registry homechain asset
 * @param {*} assetAddress
 */
export const registryHomeChainAsset = async (assetAddress) => {
  const contract = await getContract('HomeChainAssetRegistry');
  await contract.registerAsset(
    '0x', assetAddress, '0x',
    Transaction_config
  )
}

/**
 * Depoly ERC20 token
 * @param {*} param0
 * @param {Bool} isMintalbel  
 * @returns
 */
export const deployERC20 = async ({
  name,
  symbol,
  decimal,
  totalSupply
}, isMintalbel) => {
  try {
    const abi = await getAbi(isMintalbel ? 'MintableERC20' : "SimpleERC20")
    const eth = await getProvider()
    const factory = new ethers.ContractFactory(abi.abi, abi.bytecode, eth.getSigner())
    const contract = await factory.deploy(name, symbol, ethers.utils.parseUnits(totalSupply, decimal), store.state.web3.account,
      Transaction_config)
    await contract.deployed()
    return contract.address
  } catch (e) {
    console.log(`Deploy mintable token ${name} failed`, e);
    return null
  }
}
