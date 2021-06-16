import {
    isHex,
    hexToU8a,
  } from "@polkadot/util"
  import {
    encodeAddress,
    decodeAddress,
  } from "@polkadot/util-crypto"

// 将地址统一成polkadot的格式
export const stanfiAddress = (address, type=0) => {
    try {
      return encodeAddress(
        isHex(address) ?
        hexToU8a(address) :
        decodeAddress(address),
        type
      );
    } catch (e) {
      return false
    }
  }