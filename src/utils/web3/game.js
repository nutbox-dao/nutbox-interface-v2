import store from "@/store";
import {
  insertGame,
  updateGame,
  getGame as gg,
  getAllGame as gag,
} from "@/apis/api";
import { signMessage } from "./utils";
import { errCode } from "../../config";
import { getAccounts } from "@/utils/web3/account";
import { getNonce } from "./community";

/**
 * Create or update completeGame info to backend
 * @param {*} form
 * @param {*} type 'create' / 'edit'
 */
export const completeGame = async (form, type) => {
  return new Promise(async (resolve, reject) => {
    let nonce = await getNonce();
    const userId = await getAccounts();
    nonce = nonce ? nonce + 1 : 1;
    form.userId = userId;
    form.communityId = store.state.web3.stakingFactoryId

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
      res =
        type == "create" ? await insertGame(params) : await updateGame(params);

      resolve(res);
    } catch (e) {
      console.log("edut game info failed", e);
      reject(e);
    }
  });
};
/**
 * get all game infos
 */
export const getAllGame = async (communityId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const games = await gag(communityId);
      store.commit("web3/saveGames", games);
      resolve(games);
    } catch (e) {
      console.log("Get all game fail", e);
      reject(e);
    }
  });
};
/**
 * get all game infos
 */
export const getGame = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const game = await gg(id);

      resolve(game);
    } catch (e) {
      console.log("Get  game fail", e);
      reject(e);
    }
  });
};
