import store from "@/store";
import { getNonce, getDistributionEras } from "./community";
import { insertVote, getAllVote as gav } from "@/apis/api";
import { signMessage } from "./utils";
import { errCode } from "../../config";
import { getAccounts } from "@/utils/web3/account";

/**
 * Create or update completeProposal info to backend
 * @param {*} form
 * @param {*} type 'create' / 'edit'
 */
export const completeVote = async (form, type) => {
  return new Promise(async (resolve, reject) => {
    let nonce = await getNonce();
    const userId = await getAccounts();
    nonce = nonce ? nonce + 1 : 1;

    form.userId = userId;

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

      res = await insertVote(params);

      // update nonce in storage
      store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Insert vote info failed", e);
      reject(e);
    }
  });
};
/**
 * get all vote infos
 */
export const getAllVote = async proposalId => {
  return new Promise(async (resolve, reject) => {
    try {
      const votes = await gav(proposalId);

      resolve(votes);
    } catch (e) {
      console.log("Get all vote fail", e);
      reject(e);
    }
  });
};
