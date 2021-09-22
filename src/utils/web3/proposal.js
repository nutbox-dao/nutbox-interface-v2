import store from "@/store";
import { getNonce, getDistributionEras } from "./community";
import { insertProposal, getAllProposal as gap } from "@/apis/api";
import { signMessage } from "./utils";
import { errCode, Multi_Config, GasLimit } from "../../config";
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

    try {
      const distri = await getDistributionEras(true);
      form.firstBlock = distri[0].startHeight;
    } catch (e) {
      reject(e);
      return;
    }
    form.userId = userId;

    form.blockNumber = 0;

    let startTimestamp = new Date(form.start);
    startTimestamp = new Date(startTimestamp).getTime() / (1e3).toFixed();
    form.start = startTimestamp;
    let endTimestamp = new Date(form.end);
    endTimestamp = new Date(endTimestamp).getTime() / (1e3).toFixed();
    form.end = endTimestamp;
    let createdTimestamp = new Date();
    createdTimestamp = new Date(createdTimestamp).getTime() / (1e3).toFixed();
    form.created = createdTimestamp;

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
      /*   if (type === 'edit'){ */
      res = await insertProposal(params);

      /* }else{
                res = await insertCommunityProposalConfig(params)
            } */
      // update nonce in storage
      store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Insert communityProposalConfig info failed", e);
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

      resolve(proposals);
    } catch (e) {
      console.log("Get all proposal fail", e);
      reject(e);
    }
  });
};
