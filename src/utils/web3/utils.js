import { getProvider } from './ethers'
import utf8 from 'utf8';


/**
 * Sining message
 * @param {*} message 
 * @returns 
 */
export const signMessage = async (message) => {
    const eth = await getProvider()
    const siner = eth.getSigner()
    const signature = await siner.signMessage(
        message
    )
    return signature
}


/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
 var isHexStrict = function (hex) {
    return ((typeof hex === 'string' || typeof hex === 'number') && /^(-)?0x[0-9a-f]*$/i.test(hex));
};

/**
 * Should be called to get utf8 from it's hex representation
 *
 * @method hexToUtf8
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
 var hexToUtf8 = function (hex) {
    if (!isHexStrict(hex))
        throw new Error('The parameter "' + hex + '" must be a valid HEX string.');
    var str = "";
    var code = 0;
    hex = hex.replace(/^0x/i, '');
    // remove 00 padding from either side
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex.split("").reverse().join("");
    hex = hex.replace(/^(?:00)*/, '');
    hex = hex.split("").reverse().join("");
    var l = hex.length;
    for (var i = 0; i < l; i += 2) {
        code = parseInt(hex.substr(i, 2), 16);
        // if (code !== 0) {
        str += String.fromCharCode(code);
        // }
    }
    return utf8.decode(str);
};


/**
 * Convert hex to string
 * @param {*} hex 
 */
 export const hexToString = (hex) => {
    return hexToUtf8(hex)
}