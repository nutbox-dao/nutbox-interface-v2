import nacl from 'tweetnacl'
import { u8arryToHex, hexTou8array } from './helper'
import { ParseKeyNonce, SendPwdServerPubKey } from '@/config'

export async function createKeypair() {
    return new Promise((resolve) => {
        const pair = nacl.box.keyPair()
        resolve({ publicKey: u8arryToHex(pair.publicKey), privateKey: u8arryToHex(pair.secretKey) })
    })
}

export function box(data, publicKey, secretKey) {
    data = hexTou8array(data)
    publicKey = hexTou8array(publicKey)
    secretKey = hexTou8array(secretKey)
    const res = nacl.box(data, hexTou8array(ParseKeyNonce), publicKey, secretKey)
    return u8arryToHex(res)
}

export function openBox(box, mySecretKey) {
    box = hexTou8array(box)
    const nonce = hexTou8array(ParseKeyNonce)
    const theirPubKey = hexTou8array(SendPwdServerPubKey)
    mySecretKey = hexTou8array(mySecretKey)
    const res = nacl.box.open(box, nonce, theirPubKey, mySecretKey)
    return u8arryToHex(res)
}