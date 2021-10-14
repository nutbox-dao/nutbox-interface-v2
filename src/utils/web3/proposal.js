import store from "@/store";
import { getNonce } from "./community";
import {
  insertProposal,
  getAllProposal as gap,
  getProposalInfo
} from "@/apis/api";
import { signMessage } from "./utils";
import { errCode } from "../../config";
import { getAccounts } from "@/utils/web3/account";

/**
 * Create or update completeProposal info to backend
 * @param {*} form
 * @param {*} type 'create' / 'edit'
 */
export const completeProposal = async (form, type) => {
  return new Promise(async (resolve, reject) => {
    let nonce = await getNonce();
    const userId = await getAccounts();
    nonce = nonce ? nonce + 1 : 1;

    form.userId = userId;

    form.blockNumber = 0;

    const originMessage = JSON.stringify(form);
    let signature = "";
    try {
      signature = await signMessage(originMessage + nonce);
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING);
        return;
      }
    }

    const params = {
      userId,
      infoStr: originMessage,
      nonce,
      signature
    };
    try {
      let res = null;

      res = await insertProposal(params);

      // update nonce in storage
      //store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Insert proposal info failed", e);
      reject(e);
    }
  });
};
/**
 * get all proposal infos
 */
export const getAllProposal = async communityId => {
  return new Promise(async (resolve, reject) => {
    try {
      const proposals = await gap(communityId);
      store.commit('web3/saveProposals', proposals)
      resolve(proposals);
    } catch (e) {
      console.log("Get all proposal fail", e);
      reject(e);
    }
  });
};
/**
 * get all proposal infos
 */
export const getProposal = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      const proposal = await getProposalInfo(id);

      resolve(proposal);
    } catch (e) {
      console.log("Get  proposal fail", e);
      reject(e);
    }
  });
};
