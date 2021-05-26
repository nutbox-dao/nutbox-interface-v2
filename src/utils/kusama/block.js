
  import store from "../../store"
  import { getApi } from './kusama'

// subscribe new block
export const subBlock = async () => {
    // console.log('sub block');
    const api = await getApi()
    const subBlock = await api.rpc.chain.subscribeNewHeads((header) => {
      try {
        const number = header.number.toNumber()
        store.commit('kusama/saveCurrentBlockNum', number)
      } catch (e) {
  
      }
    })
  }