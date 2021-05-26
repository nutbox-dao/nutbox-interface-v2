
import {
  numberToU8a,
} from "@polkadot/util"

export function NumberTo4BytesU8A(number) {
    let buf = new Uint8Array(4);
    let tmp = numberToU8a(number);
    const tmpLength = tmp.length
    if (tmpLength > 4) throw new Error('Unsupported size of number');
    for (let i = tmpLength; i > 0; i--) {
      buf[4 - i] = tmp[tmpLength - i];
    }
    return buf;
  }
  

export const formatDate = (date) => {
  var dateee = new Date(date).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}