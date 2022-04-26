import {
    ApiPromise,
    WsProvider
  } from "@polkadot/api"
  import { TypeRegistry } from '@polkadot/types/create';
  import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
  import {
    POLKADOT_WEB_SOCKET,
    NUTBOX_REMARK_TYPE,
    PhalaCrowdloanReferrerRemark,
    KUSAMA_WEB_SOCKET,
    ROCOCO_WEB_SOCKET,
    DEBUG
  } from "@/config"
  import store from "@/store"
  import {
    web3FromSource,
    web3Enable
  } from '@polkadot/extension-dapp'
  import { subscribeAllFundInfo } from './crowdloan'
  
  export async function initApis(relaychain) {
    if (store.state[relaychain].apiState == 'loaded' || store.state[relaychain].apiState == 'loading') return; 
    store.commit(relaychain + '/saveApiState', 'loading')
    initApi(relaychain).then(() => {
      subscribeAllFundInfo(relaychain)
      store.commit(relaychain + '/saveApiState', 'loaded')
      if (relaychain === 'polkadot'){
      }
    }).catch(err => {
      store.commit(relaychain + '/saveApiState', 'error')
    })
  }
  
  async function initApi(chain, changedNode) {
    if (chain === 'rococo' && !DEBUG){
      return;
    }
    const registry = new TypeRegistry();
    const apis = {
      polkadot: store.state.polkadot.api,
      kusama: store.state.kusama.api
    }
    const node = {
      polkadot: POLKADOT_WEB_SOCKET,
      kusama: KUSAMA_WEB_SOCKET
    }
    if (apis[chain]) {
      return apis[chain]
    }
    console.log('connecting to', chain);
    store.commit(chain + '/saveIsConnected', false)
  
    const s = new Date().getTime()
    console.log('start init', chain, s);
    const wsProvider = new WsProvider(changedNode || node[chain])
    const api = await ApiPromise.create({
      provider: wsProvider,
      rpc: jsonrpc,
      types: {
        PalletId: 'Raw',
        NutboxRemark: NUTBOX_REMARK_TYPE,
        registry
      }
    })
    console.log((new Date().getTime() - s) / 1000, chain, 'connected');
  
    // inject async
    web3Enable('nutbox').then(async ()=>{
      const injected = await web3FromSource('polkadot-js')
      api.setSigner(injected.signer)
      store.commit(chain + '/saveIsConnected', true)
      store.commit(chain + '/saveApi', api)
    })
  
    store.commit(chain + '/saveIsConnected', true)
    store.commit(chain + '/saveApi', api)
    subBlock(api, chain)
    return api
  }
  
  const subBlock = async (api, chain) => {
    // console.log('sub block');
    const subBlock = await api.rpc.chain.subscribeNewHeads((header) => {
      try {
        const number = header.number.toNumber()
        store.commit(chain + '/saveCurrentBlockNum', number)
      } catch (e) {
  
      }
    })
  } 
  
  export const waitApi = async (relaychain) => {
    return new Promise(res => {
      const api = store.state[relaychain].api
      if (api && Object.keys(api).length > 0) {
        res(api);
      }
      const interval = setInterval(() => {
        
        const api = store.state[relaychain].api
        if (api && Object.keys(api).length > 0) {
          res(api);
          clearInterval(interval)
        }
      }, 300);
    })
  }