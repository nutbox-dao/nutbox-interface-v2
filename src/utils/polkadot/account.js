import {
    isHex,
    hexToU8a,
    u8aToHex
  } from "@polkadot/util"
  import {
    encodeAddress,
    decodeAddress,
  } from "@polkadot/util-crypto"
  import { waitApi } from "./api";
  
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

  export const loadAccounts = async () => {
    try {
      await web3Enable('nutbox')
      let allAccounts = await web3Accounts()
      await cryptoWaitReady();
      keyring.loadAll({
        isDevelopment: false
      }, allAccounts)
      allAccounts = allAccounts.map(({
        address,
        meta
      }) => ({
        address: stanfiAddress(address),
        meta
      }))
      store.commit('polkadot/saveAllAccounts', allAccounts)
      let account = store.state.polkadot.account !== 'undefined' && store.state.polkadot.account ? store.state.polkadot.account : allAccounts[0]
      store.commit('polkadot/saveAccount', account)
      getBalance(account, 'polkadot')
      getBalance(account, 'kusama')
      DEBUG && getRococoBalance(account, 'rococo')
    } catch (e) {
      // console.error('get all accounts fail:', e);
    }
  }

  export const getBalance = async (account, relaychain) => {
    const api = await waitApi(relaychain)
    // cancel last
    let subBalance = store.state[relaychain].subBalance
    let subLocked = store.state[relaychain].subLocked
    try {
      subBalance()
    } catch (e) {}
    try {
      subLocked()
    } catch (e) {}
  
    subBalance = await api.query.system.account(account, ({
      data: {
        free: currentFree
      },
      nonce: currentNonce
    }) => {
      store.commit(relaychain + '/saveBalance', new BN(currentFree))
    })
  
    // available balance = balance - total staked 
    // total staked = locked + unloacking
    // subLocked = await api.query.staking.ledger(store.state.polkadot.account.address, (locked) => {
    //   if (!locked.toJSON() || locked.toJSON().length === 0) {
    //     store.commit('polkadot/saveLocked', new BN(0))
    //     store.commit('polkadot/saveTotalStaked', new BN(0))
    //     store.commit('polkadot/saveUnlocking', new BN(0))
    //     store.commit('polkadot/saveRedeemable', new BN(0))
    //     return
    //   }
    //   locked = locked.toJSON()
    //   const total = new BN(locked.total)
    //   const active = new BN(locked.active)
    //   const unlocking = new BN(locked.unlocking.reduce((t,u) => t.add(new BN(u.value)), new BN(0)))
    //   store.commit('polkadot/saveTotalStaked', total)
    //   store.commit('polkadot/saveLocked',  active)
    //   store.commit('polkadot/saveUnlocking', unlocking)
    //   store.commit('polkadot/saveRedeemable', total.sub(active).sub(unlocking))
    // })
  
    store.commit('polkadot/saveSubLocked', subLocked)
    store.commit('polkadot/saveSubBalance', subBalance)
  }