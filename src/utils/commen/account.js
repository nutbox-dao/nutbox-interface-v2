import {
  isHex,
  hexToU8a,
  u8aToHex
} from "@polkadot/util"
import {
  encodeAddress,
  decodeAddress,
} from "@polkadot/util-crypto"

/**
 * Stanfi address
 * @param {} address 
 * @param {*} type 0:polkadot; 2: kusama; 42: substrate
 * @returns 
 */
export const stanfiAddress = (address, type = 0) => {
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

/**
 * Change address to hex format
 * @param {*} address 
 * @returns 
 */
export const addressToHex = (address) => {
  try{
    return isHex(address) ? address : u8aToHex(decodeAddress(address))
  }catch(e) {
    return false
  }
}