import { getContract, contractAddress } from "./contract";
import { ethers } from "ethers";
import store from "@/store";
import {
  getNonce as gn,
  getMyCommunityInfo as gci,
  insertCommunity,
  updateCommunity,
  getAllCommunities as gac,
  updateSocial
} from "@/apis/api";
import { 
  createCommunity as creCom,
  updateRewards,
  updateCCPoloicy as uccp,
  updateWh3ComConfig
} from '@/apis/wh3Api'
import { signMessage } from "./utils";
import { errCode, Multi_Config, FEE_TYPES, NutAddress, DEFAULT_CLAIM_CURATION_REWARD_SYNGER } from "@/config";
import { waitForTx, getGasPrice } from "./ethers";
import { sleep, utf8ToHex } from "@/utils/helper";
import { createWatcher, aggregate } from "@makerdao/multicall";
import { getCToken } from "./asset";
import { getAccounts } from "@/utils/web3/account";

/**
 * Get community admin's staking factory id
 * @returns
 */
export const getMyCommunityContract = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const id = store.state.web3.stakingFactoryId;
    if (!update && id) {
      resolve(id);
      return;
    }
    while(store.state.web3.loadingCommunity) {
      await sleep(0.3)
      if (!store.state.web3.loadingCommunity){
        await sleep(0.2)
        resolve(store.state.web3.stakingFactoryId)
        return;
      }
    }
    // store.commit('user/saveLoadingUserGraph', false)
    store.commit("web3/saveLoadingCommunity", true);
    const account = await getAccounts();
    if (!account){
      console.log('no account');
      reject(errCode.NO_STAKING_FACTORY);
      return;
    }
    while(true) {
      if (!store.state.user.loadingUserGraph) {
        await sleep(0.1)
        break;
      }
      await sleep(0.2)
    }

    let joinedCommunity = store.state.user.userGraphInfo.inCommunities;
    // The newly created community info
    let cachedCommunity = store.state.cache.myCreatedCommunityInfo;
    try{
      cachedCommunity = JSON.parse(cachedCommunity)
    }catch(e) {
      cachedCommunity = null
    }
    if (!joinedCommunity || joinedCommunity.length === 0) {
      if (cachedCommunity) {
        stakingFactoryId = cachedCommunity.id;
        store.commit("web3/saveLoadingCommunity", false);
        store.commit("web3/saveStakingFactoryId", stakingFactoryId);
        resolve(stakingFactoryId);
        return;
      }
      store.commit("web3/saveStakingFactoryId", null);
      store.commit("web3/saveLoadingCommunity", false);
      reject(errCode.NO_STAKING_FACTORY)
      return;
    }
    let stakingFactoryId = null;
    // search if the new created community are in this list first
    for (let i = 0; i < joinedCommunity.length; i++){
      if (joinedCommunity[i].owner.id.toLowerCase() === account.toLowerCase()){
        stakingFactoryId = joinedCommunity[i].id;
        store.commit("web3/saveLoadingCommunity", false);
        store.commit("web3/saveStakingFactoryId", stakingFactoryId);
        resolve(stakingFactoryId);
        return;
      }
    }
    // if not found, use the local cached community
    if (cachedCommunity) {
      stakingFactoryId = cachedCommunity.id;
      store.commit("web3/saveLoadingCommunity", false);
      store.commit("web3/saveStakingFactoryId", stakingFactoryId);
      resolve(stakingFactoryId);
      return;
    }
    store.commit("web3/saveStakingFactoryId", null);
    store.commit("web3/saveLoadingCommunity", false);
    reject(errCode.NO_STAKING_FACTORY);
    return;
  });
};

/**
 * Get community's infos from backend
 * @param {*} update
 * @returns
 */
export const getMyCommunityInfo = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    let stakingFactoryId = null;
    if(!store.state.community.communityInfo){
      store.commit('community/saveLoadingMyCommunityInfo', true)
    }
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        store.commit('community/saveLoadingMyCommunityInfo', false)
        return;
      }
    } catch (e) {
      console.log("Get my staking factory fail", e);
      store.commit('community/saveLoadingMyCommunityInfo', false)
      reject(e);
      return;
    }

    if (!update && store.state.community.communityInfo) {
      resolve(store.state.community.communityInfo);
      store.commit('community/saveLoadingMyCommunityInfo', false)
      return;
    }
    let communityInfo = null;
    try {
      communityInfo = await gci(stakingFactoryId);
      const cToken = await getCToken(stakingFactoryId);

      if (communityInfo && communityInfo.length > 0) {
        communityInfo[0].cToken = cToken;
        store.commit("community/saveCommunityInfo", communityInfo[0]);
        resolve(communityInfo[0]);
        return;
      } else {
        console.log("first get communityInfo");
        // get first distribution
        const dis = await getDistributionEras();
        store.commit("community/saveCommunityInfo", { id: stakingFactoryId, cToken, firstBlock: dis[0].startHeight });
        resolve({ id: stakingFactoryId, cToken, firstBlock: dis[0].startHeight });
      }
    } catch (e) {
      console.log("Get community info from backend fail", e);
      store.commit("community/saveCommunityInfo", null);
      reject(e);
    } finally{
      store.commit('community/saveLoadingMyCommunityInfo', false)
    }
  });
};

/**
 * get all community infos
 */
export const getAllCommunities = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    while(store.state.community.loadingAllCommunityInfo) {
      await sleep(0.5)
    }
    if (
      !update &&
      store.state.community.allCommunityInfo &&
      store.state.community.allCommunityInfo.length > 0
    ) {
      resolve(store.state.community.allCommunityInfo);
      return;
    }
    store.commit('community/saveLoadingAllCommunityInfo', true)
    try {
      const communities = await gac();
      let comms = {}
      communities.map(c => {
        comms[c.id.toLowerCase()] = c
      })
      store.commit("community/saveAllCommunityInfo", comms);
      resolve(comms);
    } catch (e) {
      console.log("Get all community fail", e);
      reject(e);
    } finally{
      store.commit('community/saveLoadingAllCommunityInfo', false)
    }
  });
};

/**update tokens info from db */
export const updateAllCommunitiesFromBackend = async () => {
  while (true) {
    await getAllCommunities(true);
    await sleep(18);
  }
};

/**
 * get operation fee amount
 */
export const getOperationFee = async () => {
  return new Promise(async (resolve, reject) => {
    try{
      store.commit('web3/saveLoadingFees', true)
      const calls = FEE_TYPES.map(type => ({
        target: contractAddress['Committee'],
        call: [
          'getFee(string)(uint256)',
          type
        ],
        returns: [
          [type, val => val.toString() / 1e18]
        ]
      }))
      const res = await aggregate(calls, Multi_Config);
      store.commit('web3/saveFees', res.results.transformed)
      store.commit('web3/saveLoadingFees', false)
      resolve(res.results.transformed);
    }catch(e){
      console.log('Get operation fees fail', e);
      store.commit('web3/saveLoadingFees', false)
      reject(errCode.BLOCK_CHAIN_ERR);
    }
  })
}

/**
 * Get community token reward per block
 * @param {*} communityId 
 * @returns 
 */
export const getCommunityRewardPerBlock = async (communityId) => {
  return new Promise(async (resolve, reject) => {
    try{
      communityId = communityId.toLowerCase();
      let amount = await aggregate([{
        target: contractAddress["LinearCalculator"],
        call: [
          'getCurrentRewardPerBlock(address)(uint256)',
          communityId
        ],
        returns: [
          ['amount']
        ]
      }], Multi_Config)
      amount = amount.results.transformed['amount']
      const ctoken = await getCToken(communityId)
      const reward = amount.toString() / (10 ** ctoken.decimal)
      let rewardPerBlock = store.state.community.rewardPerBlock;
      rewardPerBlock[communityId] = reward;
      
      store.commit('community/saveRewardPerBlock', rewardPerBlock)
      resolve(reward)
    }catch(e) {
      console.log('Get reward per block fail', e);
    }
  })
}

function makeSimpleMintableERC20Metadata(name, symbol, supply, recipient) {
  const meta = '0x' + ethers.utils.hexZeroPad(ethers.utils.hexlify(name.length), 1).substring(2)
   + utf8ToHex(name)
   + ethers.utils.hexZeroPad(ethers.utils.hexlify(symbol.length), 1).substring(2)
   + utf8ToHex(symbol)
   + ethers.utils.hexZeroPad(ethers.utils.parseUnits(supply.toString(), 18), 32).substring(2)
   + recipient.substring(2)
   return meta
}

/**
 * Create Community Staking Factory Contracts
 * @param {*} form contract params
 */
export const createCommunity = async (cToken, distribution) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comId = await getMyCommunityContract();
      if (comId) {
        console.log("Can only register one community for an account", comId);
        reject(errCode.HAVE_CREATED_COMMUNITY);
        return;
      }
    } catch (e) {
    }

    let contract;
    try {
      contract = await getContract("CommunityFactory", null, false);
    } catch (e) {
      reject(e);
      return;
    }

    try {
      // make params
      const account = await getAccounts();
      const isMintable = cToken.isMintable;
      let distributionStr =
        "0x" +
        ethers.utils
          .hexZeroPad(ethers.utils.hexlify(distribution.length), 1)
          .substring(2);
      for (let dis of distribution) {
        distributionStr +=
          ethers.utils
            .hexZeroPad(
              ethers.BigNumber.from(dis.startHeight).toHexString(),
              32
            )
            .substring(2) +
          ethers.utils
            .hexZeroPad(ethers.BigNumber.from(dis.stopHeight).toHexString(), 32)
            .substring(2) +
          ethers.utils
            .hexZeroPad(
              ethers.utils
                .parseUnits(dis.amount.toString(), 18)
                .toHexString(),
              32
            )
            .substring(2);
      }
      contract.on('CommunityCreated', async (user, community, token) => {
        if (account.toLowerCase() === user.toLowerCase()){
          console.log('Create new staking feast', community, 'ctoken:', token);
          contract.removeAllListeners('CommunityCreated');
          const communityInfo = {
            id: ethers.utils.getAddress(community),
            cToken: {...cToken, address: ethers.utils.getAddress(token)},
            firstBlock: distribution[0].startHeight,
            daofund: user,
            retainedRevenue: 0,
            feeRatio: 0,
            owner: {
              id: user
            },
            pools:[]
          }
          // Created a new community
          store.commit('community/saveCommunityInfo', communityInfo);
          store.commit("community/saveDistributions", distribution);
          store.commit("web3/saveStakingFactoryId", community);
          // add cache
          store.commit('cache/saveMyCreatedCommunityInfo', communityInfo);
          store.commit('cache/saveMyCommunityDistribution', distribution);
          resolve(communityInfo);
        }
      })
      // call contract 
      const preMine = (cToken && cToken.supply) ? cToken.supply : 0
      const res = await contract.createCommunity(
        isMintable,
        // isCustom means use exists token
        cToken.isCustom ? cToken.address : ethers.constants.AddressZero,
        contractAddress['MintableERC20Factory'],
        cToken.isCustom ? '0x' : makeSimpleMintableERC20Metadata(cToken.name, cToken.symbol, preMine, account),
        contractAddress["LinearCalculator"],
        distributionStr);
      await waitForTx(res.hash);
    } catch (e) {
      console.log("Create Staking Feast Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  });
};

/**
 * Create or update community info to backend
 * @param {*} form
 * @param {*} type 'create' / 'edit'
 */
export const completeCommunityInfo = async (form, type) => {
  return new Promise(async (resolve, reject) => {
    let nonce = await getNonce();
    const userId = await getAccounts();
    const communityId = await getMyCommunityContract();
    form.id = communityId;
    nonce = nonce ? nonce + 1 : 1;
    try {
      const distri = await getDistributionEras(true);
      const ctoken = await getCToken(form.id)
      form.tokenAddress = ctoken.address;
      form.firstBlock = distri[0].startHeight;
    } catch (e) {
      reject(e);
      return;
    }
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
      if (type === "edit") {
        res = await updateCommunity(params);
      } else {
        res = await insertCommunity(params);
      }
      // update nonce in storage
      store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Insert community info failed", e);
      reject(e);
    }
  });
};

/**
 * update new dao fund address
 * @param {*} daofund 
 * @returns 
 */
export const setDevAddress = async (daofund) => {
  return new Promise(async (resolve, reject) => {
    let stakingFactoryId = null;
    let contract = null;
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
      contract = await getContract("Community", stakingFactoryId, false);
    } catch (e) {
      reject(e);
      return;
    }
    try {
      const tx = await contract.adminSetDev(daofund);
      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log("Set dao fund Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  })
}

/**
 * withdraw retained revenue
 * @param {*} daofund 
 * @returns 
 */
 export const withdrawRevenue = async () => {
  return new Promise(async (resolve, reject) => {
    let stakingFactoryId = null;
    let contract = null;
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
      contract = await getContract("Community", stakingFactoryId, false);
    } catch (e) {
      reject(e);
      return;
    }
    try {
      const tx = await contract.adminWithdrawRevenue();
      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log("Withdraw revenue Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  })
}

/**
 * Charge community's balance
 * Only non-mintable ctoken need to charge balance
 * @param {*} amount origin data, no need to convert to big int
 */
export const chargeCommunityBalance = async (amount) => {
  return new Promise(async (resolve, reject) => {
    let communityId = null;
    let erc20;
    let ctoken;
    try {
      communityId = await getMyCommunityContract();
      if (!communityId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
      ctoken = await getCToken(communityId);
      erc20 = await getContract('ERC20', ctoken.address, false);
    } catch (e) {
      reject(e);
      return;
    }

    try {
      let account = await getAccounts();
      const balance = await erc20.balanceOf(account);
      if (balance.toString() / (10 ** ctoken.decimal) <= parseFloat(amount)){
        reject(errCode.INSUFIENT_BALANCE);
        return;
      }
      const tx = await erc20.transfer(communityId, ethers.utils.parseUnits(amount.toString(), ctoken.decimal));
      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log("Charging community balance Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  });
}

/**
 * withdraw community balance
 * @param {*} amount 
 * @returns 
 */
export const withdrawCommunityBalance = async (amount) =>  {
  return new Promise(async (resolve, reject) => {
    let stakingFactoryId = null;
    let contract = null;
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
      contract = await getContract("Community", stakingFactoryId, false);
    } catch (e) {
      reject(e);
      return;
    }
    try {
      const tx = await contract.adminWithdrawReward(ethers.utils.parseUnits(amount.toString(), 18));
      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log("Withdraw community balance Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  });
}

/**
 * Update dev ratio
 * @param {int} ratio 0-10000
 * @returns
 */
export const setDevRatio = async (ratio) => {
  return new Promise(async (resolve, reject) => {
    if (ratio < 0 || ratio > 10000) {
      reject(errCode.WRONG_INPUT_DEV_RATIO);
      return;
    }
    let stakingFactoryId = null;
    let contract = null;
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
      contract = await getContract("Community", stakingFactoryId, false);
    } catch (e) {
      reject(e);
      return;
    }

    try {
      const tx = await contract.adminSetFeeRatio(ratio, {
        gasLimit: 10000000,
        gasPrice: await getGasPrice()
      });
      await waitForTx(tx.hash);
      resolve(tx.hash);
    } catch (e) {
      console.log("Set community address Failed", e);
      reject(errCode.BLOCK_CHAIN_ERR);
      return;
    }
  });
};

/**
 * Get cToken distribuitons eras
 * @param {*} update
 */
export const getDistributionEras = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const distribuitons = store.state.community.distributions;
    if (!update && distribuitons) {
      resolve(distribuitons);
      return;
    }

    let stakingFactoryId = null;
    try {
      stakingFactoryId = await getMyCommunityContract();
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
    } catch (e) {
      reject(e);
      return;
    }

    let contract;
    let decimal;
    let rewardCalculator;
    try {
      contract = await getContract("Community", stakingFactoryId);
      const cToken = await getCToken(stakingFactoryId);
      rewardCalculator = await getContract("LinearCalculator");
      decimal = cToken.decimal;
    } catch (e) {
      reject(e);
      return;
    }

    try {
      const rewardCalculatorAddress = await contract.rewardCalculator();
      if (rewardCalculatorAddress == contractAddress["LinearCalculator"]) {
        let count = await rewardCalculator.distributionCountMap(
          stakingFactoryId
        );
        count = parseInt(count)
        let distri = await Promise.all(
          new Array(count)
            .toString()
            .split(",")
            .map((item, i) =>
              rewardCalculator.distributionErasMap(stakingFactoryId, i)
            )
        );
        distri = distri.map((item, i) => ({
          percentage: item.stopHeight - item.startHeight,
          amount: item.amount.toString() / 10 ** decimal,
          startHeight: item.startHeight.toString(),
          stopHeight: item.stopHeight.toString(),
          background: `rgba(255, 149, 0, ${(i + 1) * (1.0 / count)})`,
        }));
        store.commit("community/saveDistributions", distri);
        resolve(distri);
      }
    } catch (e) {
      console.log("getDistributionEras", e);
      reject(e);
      return;
    }
  });
};

/**
 * get child community distribution eras
 * @param {*} communityId 
 */
export const getSpecifyDistributionEras = async (communityId) => {
  return new Promise(async (resolve, reject) => {
    const distribuitons = store.state.currentCommunity.specifyDistributionEras;
    if (distribuitons && distribuitons.length > 0) {
      resolve(distribuitons);
      return;
    }
    let decimal;
    try {
      const cToken = await getCToken(communityId);
      decimal = cToken.decimal;
    } catch (e) {
      reject(e);
      return;
    }

    try {
      const rewardCalculatorAddress = contractAddress["LinearCalculator"]
      if (rewardCalculatorAddress == contractAddress["LinearCalculator"]) {
        let count = await aggregate([{
          target: rewardCalculatorAddress,
          call: [
            'distributionCountMap(address)(uint256)',
            communityId
          ],
          returns: [
            ['count']
          ]
        }], Multi_Config)

        count = parseInt(count.results.transformed['count'])

        const calls = new Array(count).toString().split(',').map((item, i) => ({
          target: rewardCalculatorAddress,
          call: [
            'distributionErasMap(address,uint256)(uint256,uint256,uint256)',
            communityId,
            i
          ],
          returns: [
            ['amount-'+i],
            ['startHeight-'+i],
            ['stopHeight-'+i]
          ]
        }))
        
        let distibution = await aggregate(calls, Multi_Config)
        distibution = distibution.results.transformed
        let distri = []
        for (let dis in distibution) {
          const [type, index] = dis.split('-');
          if (!distri[index]) {
            distri[index] = {}
          }
          distri[index][type] = distibution[dis]
        }

        distri = distri.map((item, i) => ({
          percentage: item.stopHeight - item.startHeight,
          amount: item.amount.toString() / 10 ** decimal,
          startHeight: item.startHeight.toString(),
          stopHeight: item.stopHeight.toString(),
          background: `rgba(255, 149, 0, ${(i + 1) * (1.0 / count)})`,
        }));
        store.commit("currentCommunity/saveSpecifyDistributionEras", distri);
        resolve(distri);
      }
    } catch (e) {
      console.log("getSpecifyDistributionEras", e);
      reject(e);
      return;
    }
  })
}

/**
 * watch current community's users balances
 * Must clear time interval to close this watcher
 * @param {*} callback 
 * @returns 
 */
export const watchMemberBalance = (callback) => {
  return setInterval(async () => {
    try{
      const users = store.state.currentCommunity.communityInfo.users;
      const ctoken = store.state.currentCommunity.communityInfo.cToken;
      if (!users || users.length === 0 || !ctoken) {
        callback({});
        return
      }
      let res = await aggregate(users.map(u => ({
        target: ctoken,
        call: [
          'balanceOf(address)(uint256)',
          u.address
        ],
        returns: [
          [u.address.toLowerCase(), val => val.toString() / (10 ** store.getters['web3/tokenDecimals'](ctoken))]
        ]
      })), Multi_Config)
      callback(res.results.transformed)
    }catch(err) {
      console.log('Watch members balance fail:', err);
    }
  }, 3000)
}

/**
 * update social info
 * @param {*} social
 */
export const udpateSocialInfo = async (social, wh3CommunityId) => {
  return new Promise(async (resolve, reject) => {
    let id;
    try {
      id = await getMyCommunityContract();
      if (!id) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
    } catch (e) {
      reject(e);
      return;
    }
    let nonce = await getNonce();
    const userId = await getAccounts();
    nonce = nonce ? nonce + 1 : 1;
    const infoStr = JSON.stringify({
      id,
      communityId: wh3CommunityId,
      ...social,
    });
    let signature = "";
    try {
      signature = await signMessage(infoStr + nonce);
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING);
        return;
      }
    }
    const params = {
      userId,
      infoStr,
      nonce,
      signature,
      ethAddress: userId
    };
    try {
      let res = await updateSocial(params);
      if (wh3CommunityId) {
        await updateWh3ComConfig(params)
      }
      store.commit("web3/saveNonce", nonce);
      resolve(res);
    } catch (e) {
      console.log("Update community social info failed", e);
      reject(e);
    }
  });
};

/**
 * Get User's nonce
 * @param {*} update
 */
export const getNonce = async (update = false) => {
  let nonce = store.state.web3.nonce;
  const account = await getAccounts();
  if (!update && nonce) {
    return nonce;
  }
  nonce = await gn(account);
  store.commit("web3/saveNonce", nonce);
  return nonce;
};

/**
 * get specify community dao fund ratio
 * @param {*} communityId 
 */
export const getCommunityDaoRatio = async (communityId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getContract("Community", communityId);
      const ratio = await contract.feeRatio();
      resolve(ratio)
    }catch(e) {
      reject(e)
    }
  })
}

/**
 * get Community balance and allowance
 * @param {String} communityId  community address
 * @param {String} ctokenaddress c token address
 */
export const getCommunityBalance = async ({communityId, ctokenAddress}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let balance = await aggregate([{
        target: ctokenAddress,
        call: [
          'balanceOf(address)(uint256)',
          communityId
        ],
        returns: [
          ['balance']
        ]
      }], Multi_Config)
      resolve(balance.results.transformed['balance'])
    } catch (e) {
      
      reject(e);
    } finally {
    }
  });
};

/**
 * Get community's owner
 * @param {*} communityId 
 * @returns 
 */
export const getCommunityOwner = async (communityId) => {
  return new Promise(async (resolve, reject) => {
    try{
      let owner = await aggregate([{
        target: communityId,
        call: [
          'owner()(address)'
        ],
        returns: [
          ['owner']
        ]
      }], Multi_Config)
      resolve(owner.results.transformed['owner'])
    }catch(e) {
      reject(e)
    }
  })
}

/**
 * 
 * @param {*} token 
 * @param {*} target 
 */
export const getApprovement = async (token, target) => {
  return new Promise(async (resolve, reject) => {
    try{
      const account = await getAccounts()
      if (account) {
        const contract = await getContract('ERC20', token)
        const [decimals, allowrance] = await Promise.all([contract.decimals(), contract.allowance(account, target)])

        resolve(allowrance.toString() / (10 ** decimals) > 1e12)
      }else {
        resolve(false)
      }
      
    }catch(e) {
      console.log('get approvement fail', e);
      reject(e)
    }
  })
}

export const approveUseERC20 = async (token, target) => {
  return new Promise(async (resolve, reject) => {
    try{
      const contract = await getContract('ERC20', token, false)
      const tx = await contract.approve(target, ethers.constants.MaxUint256, {
        gasLimit: 854020
      })
      await waitForTx(tx.hash)
      resolve()
    }catch(e) {
      console.log('Approve fail', e);
      reject(e)
    }
  })
}

/**
 * Monitor community dev address and dev ratio
 * @param {*} communityInfo
 * @returns
 */
export const monitorCommunityDevInfo = async (communityInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      store.commit("web3/saveLoadingDevInfo", true);
      let watchers = store.state.web3.watchers;
      let watcher = watchers["devInfo"];
      watcher && watcher.stop();
      watcher = createWatcher(
        [
          {
            target: communityInfo.id,
            call: ["getDev()(address)"],
            returns: [["devAddress"]],
          },
          {
            target: communityInfo.id,
            call: ["getDevRewardRatio()(uint16)"],
            returns: [["devRatio"]],
          },
        ],
        Multi_Config
      );
      watcher.subscribe((update) => {
        const type = update.type;
        const value = update.value;
        if (type === "devAddress") {
          // console.log('update dev address', value);
          store.commit("web3/saveDevAddress", value);
        } else if (type === "devRatio") {
          // console.log('update dev ratio', value);
          store.commit("web3/saveDevRatio", value);
        }
      });
      watcher.start();
      watchers["devInfo"] = watcher;
      store.commit("web3/saveWatchers", { ...watchers });
      resolve();
    } catch (e) {
      reject(e);
    } finally {
      store.commit("web3/saveLoadingDevInfo", false);
    }
  });
};

/************************************ wormhole3 *******************************/

export const getWh3CommunityContract = async (cid) => {
  return new Promise(async (resolve, reject) => {
    try{
      const contract = await getContract('CommunityCuration', null, false)
      cid = ethers.BigNumber.from('0x' + cid);
      const communityInfo = await contract.getCommunityInfo(cid);
      resolve(communityInfo)
    }catch(e) {
      console.log('get wh3 community contract fail:', e);
      reject(e)
    }
  })
}

export const checkCurationPoolStarted = async (pool) => {
  return new Promise(async (resolve, reject) => {
    try {
        const contract = await getContract('CurationGauge', pool, false);
        const deposit = await contract.getTotalStakedAmount();
        if (deposit.toString() / 1 === 0) {
          resolve(false)
          return;
        }
        resolve(true);
        return;
    } catch (e) {
      console.log('checkout curaiton pool start fail:', e);
      reject(e)
    }
  })
}

export const createWh3CommunityContract = async (cid) => {
  return new Promise(async (resolve, reject) => {
    try{
      const communityId = store.state.communityInfo.id;
      const ctoken = await getCToken(communityId);
      console.log(535, ctoken, store.state.communityInfo.ctoken, store.state.communityInfo);
      const contract = await getContract('CommunityCuration', null, false)
      cid = ethers.BigNumber.from('0x' + cid);
      let tx = await contract.createCommunity(cid, DEFAULT_CLAIM_CURATION_REWARD_SYNGER, ctoken.address)
      await waitForTx(tx.hash)
      let communityInfo = await contract.getCommunityInfo(cid);
      if (!communityInfo.storageAddr) {
        await sleep(3)
        communityInfo = await contract.getCommunityInfo(cid);
      }
      if (!communityInfo.storageAddr) {
        await sleep(3)
        communityInfo = await contract.getCommunityInfo(cid);
      }
      resolve(communityInfo)
    }catch(e) {
      console.log('create wh3 community fail', e);
      reject(e)
    }
  })
}

export const createWh3Community = async (cid, twitterId, displayTag, tags) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get nutbox community and token info
      const community = store.state.community.communityInfo;
      console.log('community:', community)
      
      const ctoken = community.cToken;
    
      // set default policy
      let policy = {
        did: {
          ratio: 1
        },
        community: {
          ratio: 0
        },
        topoic: {
          ratio: 0
        }
      }
    
      let wh3Community = {
        communityId: cid,
        name: community.name,
        icon: community.icon,
        banner: community.poster,
        description: community.description,
        hiveTag: community.blogTag,
        twitterId,
        steemId: store.state.user.wh3AccountInfo.steemId,
        tags: tags ? tags.join(','): '',
        displayTag,
        chainId: 42161,
        rewardToken: ethers.utils.getAddress(ctoken.address),
        rewardSymbol: ctoken.symbol,
        rewardName: ctoken.name,
        decimals: ctoken.decimal,
        rewardPerDay: '0',
        settleDay: 3,
        policy: JSON.stringify(policy),
        annPerDay: '0',
        spacePerDay: '0',
        twitter: community.twitter,
        telegram: community.telegram,
        discord: community.discord,
        doc: community.document,
        official: community.website,
        stakeUrl: '',
        swapUrl: '',
        nutboxContract: ethers.utils.getAddress(community.id)
      }
    
      const originMessage = JSON.stringify(wh3Community);
      let signature = "";
      try {
        signature = await signMessage(originMessage);
      } catch (e) {
        if (e.code === 4001) {
          reject(errCode.USER_CANCEL_SIGNING);
          return;
        }
      }
    
      const params = {
        ethAddress: ethers.utils.getAddress(store.state.web3.account),
        infoStr: originMessage,
        signature,
      };
    
      try {
        let res = await creCom(params);
        resolve(res);
      } catch (e) {
        console.log("create community social info failed", e);
        reject(e);
      }  

  }catch(e) {
    console.log(53, e)
    reject(e)
  }
  })
}

export const updateRewardInfo = async (rewardInfo) => {
  return new Promise(async (resolve, reject) => {
    const originMessage = JSON.stringify(rewardInfo);
    let signature = "";
    try {
      signature = await signMessage(originMessage);
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING);
        return;
      }
    }
  
    const params = {
      ethAddress: ethers.utils.getAddress(store.state.web3.account),
      infoStr: originMessage,
      signature,
    };
  
    try {
      let res = await updateRewards(params);
      resolve(res);
    } catch (e) {
      console.log("update community reward info failed", e);
      reject(e);
    }  
  })
}

export const updateCCInfo = async (CCInfo) => {
  return new Promise(async (resolve, reject) => {
    const originMessage = JSON.stringify(CCInfo);
    let signature = "";
    try {
      signature = await signMessage(originMessage);
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING);
        return;
      }
    }
  
    const params = {
      ethAddress: ethers.utils.getAddress(store.state.web3.account),
      infoStr: originMessage,
      signature,
    };
  
    try {
      let res = await uccp(params);
      resolve(res);
    } catch (e) {
      console.log("update community reward info failed", e);
      reject(e);
    }  
  })
}