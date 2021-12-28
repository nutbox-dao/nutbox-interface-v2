import {
  getNonce,
} from "./community";
import {
  updateCommunityProposalConfig,
  getScores as gScores,
} from "@/apis/api";
import { signMessage } from "./utils";
import { errCode } from "../../config";
import { getAccounts } from "@/utils/web3/account";

/**
 * Create or update communityProposalConfig info to backend
 * @param {*} form
 */
export const completeCommunityProposalConfigInfo = async (form) => {
  return new Promise(async (resolve, reject) => {
    let nonce = await getNonce();
    const userId = await getAccounts();
    nonce = nonce ? nonce + 1 : 1;

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
      signature,
    };
    try {
      let res = null;
      /*   if (type === 'edit'){ */
      res = await updateCommunityProposalConfig(params);
      /* }else{
                res = await insertCommunityProposalConfig(params)
            } */
      // update nonce in storage
      //store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Insert communityProposalConfig info failed", e);
      reject(e);
    }
  });
};

/**
 * Get all scores from backend
 * @param {*} params
 */
export const getScore = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      params.addresses = [];
      params.addresses.push(await getAccounts());

      if (params.network) {
        const res = await gScores(params);

        const totalScore = res.result.scores[0][params.addresses];

        resolve(totalScore);
      }
    } catch (e) {
      console.log("Get score info failed", e);
      reject(e);
    }
  });
};

/**
 *  Get score from backend
 * @param {*} params
 */
export const getScores = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (params.network) {
        const res = await gScores(params);

        const totalScore = res.result.scores;

        resolve(totalScore);
      }
    } catch (e) {
      console.log("Get all score  failed", e);
      reject(e);
    }
  });
};
