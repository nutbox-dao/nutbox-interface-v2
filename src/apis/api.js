import { get, post, put } from "./axios";
import {
  BACKEND_API_URL,
} from "../config";

// ============================================ commen ============================================
export const getDataCounts = async () => 
  get(BACKEND_API_URL + '/getdatacounts')


export const getCommonPrice = async () => 
  get(BACKEND_API_URL + '/common/prices')


export const getHoleTvl = async () => 
  get(BACKEND_API_URL + '/common/tvl')


export const getCommon = async () => 
  get(BACKEND_API_URL + '/common')

export const faucet = async (account) => 
  post(BACKEND_API_URL + '/faucet', {account})

export const getTestNFT = async (params) =>
  post(BACKEND_API_URL + '/faucet/getnft', params)

// ============================================ backend v2 ============================================

export const getMyCommunityInfo = async (communityId) =>
  get(BACKEND_API_URL + "/community/get", { id: communityId });

export const insertCommunity = async (params) =>
  post(BACKEND_API_URL + "/community/insert", params);

export const updateCommunity = async (params) =>
  put(BACKEND_API_URL + "/community/update", params);

export const getAllTokens = async () => get(BACKEND_API_URL + "/token/get");

export const getAllErc1155 = async () => get(BACKEND_API_URL + "/erc1155/get")

export const insertProposal = async (params) =>
  post(BACKEND_API_URL + "/proposal/insert", params);

export const updateProposal = async (params) =>
  post(BACKEND_API_URL + "/proposal/update", params);
  
export const getAllCommunities = async (communityId = null) =>
  get(BACKEND_API_URL + "/community/get", { id: communityId });

export const insertVote = async (params) =>
  post(BACKEND_API_URL + "/vote/insert", params);

export const getAllVote = async (proposalId) =>
  get(BACKEND_API_URL + "/vote/get", { proposalId: proposalId });

export const updateBlogTag = async (params) =>
  put(BACKEND_API_URL + "/community/updateBlogTag", params);

export const updateSocial = async (params) =>
  put(BACKEND_API_URL + "/community/updateSocial", params);

export const insertToken = async (params) =>
  post(BACKEND_API_URL + "/token/insert", params);

  export const insertErc1155 = async (params) =>
    post(BACKEND_API_URL + "/erc1155/insert", params);

export const updateTokenIcon = async (params) =>
  put(BACKEND_API_URL + "/token/update", params);

// ============================================ user ============================================
export const getNonce = async (accountId) =>
  get(BACKEND_API_URL + "/user/getnonce", { id: accountId });

export const updateUserInfo = async (params) => post(BACKEND_API_URL + "/user/updateUser", params)

export const getAllUsers = async () => get(BACKEND_API_URL + "/user/users");

export const getSomeUsers = async (ids) => post(BACKEND_API_URL + "/user/getsomeusers", {ids})

// ============================================ nps ============================================

export const getScores = async (params) =>
  post(BACKEND_API_URL + "/scores/get", { params });

export const insertCommunityProposalConfig = async (params) =>
  post(BACKEND_API_URL + "/communityProposalConfig/insert", params);

export const updateCommunityProposalConfig = async (params) =>
  put(BACKEND_API_URL + "/communityProposalConfig/update", params);

export const getAllProposal = async (communityId) =>
get(BACKEND_API_URL + "/proposal/get", { communityId: communityId });

export const getProposalInfo = async (id) =>
get(BACKEND_API_URL + "/proposal/get", { id: id });

// ============================================ game ============================================
export const getGame = async (gameId) =>
  get(BACKEND_API_URL + "/game/get", { id: gameId });

export const insertGame = async (params) =>
  post(BACKEND_API_URL + "/game/insert", params);

export const updateGame = async (params) =>
  put(BACKEND_API_URL + "/game/update", params);

export const getAllGame = async (communityId) => get(BACKEND_API_URL + "/game/get", {communityId});
