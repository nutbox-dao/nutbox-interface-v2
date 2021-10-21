import { get, post, put } from "./axios";
import {
  CROWD_STAKING_API_URL,
  CROWD_LOAN_API_URL,
  BACKEND_API_URL,
} from "../config";

// ============================================ NPS ============================================
const API_URL = "https://service.nutbox.io";

export const getProposal = async (params) =>
  get(API_URL + "/nps/getProposal", params);

// ============================================ backend v2 ============================================

export const getMyCommunityInfo = async (communityId) =>
  get(BACKEND_API_URL + "/community/get", { id: communityId });

export const insertCommunity = async (params) =>
  post(BACKEND_API_URL + "/community/insert", params);

export const updateCommunity = async (params) =>
  put(BACKEND_API_URL + "/community/update", params);

export const getAllTokens = async () => get(BACKEND_API_URL + "/token/get");

export const getCommunityToken = async (address) =>
  get(BACKEND_API_URL + "/token/get", { address: address });

export const getNonce = async (accountId) =>
  get(BACKEND_API_URL + "/user/getnonce", { id: accountId });

export const updatePoolInfo = async (params) =>
  put(BACKEND_API_URL + "/pool/update", params);

export const getAllParachain = async () =>
  get(BACKEND_API_URL + "/parachain/getall");

export const getMyCommunityProposalConfigInfo = async (communityId) =>
  get(BACKEND_API_URL + "/communityProposalConfig/get", { id: communityId });

export const insertCommunityProposalConfig = async (params) =>
  post(BACKEND_API_URL + "/communityProposalConfig/insert", params);

export const updateCommunityProposalConfig = async (params) =>
  put(BACKEND_API_URL + "/communityProposalConfig/update", params);

export const insertProposal = async (params) =>
  post(BACKEND_API_URL + "/proposal/insert", params);

export const updateProposal = async (params) =>
  post(BACKEND_API_URL + "/proposal/update", params);
export const getAllCommunities = async (communityId = null) =>
  get(BACKEND_API_URL + "/community/get", { id: communityId });

export const getAllProposal = async (communityId) =>
  get(BACKEND_API_URL + "/proposal/get", { communityId: communityId });

export const getProposalInfo = async (id) =>
  get(BACKEND_API_URL + "/proposal/get", { id: id });

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

export const updateTokenIcon = async (params) =>
  put(BACKEND_API_URL + "/token/update", params);

// ============================================ strategies ============================================

export const getStrategies = async () =>
  get(BACKEND_API_URL + "/scores/strategies");

export const getScores = async (params) =>
  post(BACKEND_API_URL + "/scores/get", { params });

export const getAllPools = async (communityId = null) =>
  get(BACKEND_API_URL + "/pool/getAll", { id: communityId });

export const getPricesOnCEX = async () =>
  get("https://api.binance.com/api/v3/ticker/price");

export const getGame = async (gameId) =>
  get(BACKEND_API_URL + "/game/get", { id: gameId });

export const insertGame = async (params) =>
  post(BACKEND_API_URL + "/game/insert", params);

export const updateGame = async (params) =>
  put(BACKEND_API_URL + "/game/update", params);

export const getAllGame = async (communityId) => get(BACKEND_API_URL + "/game/get", {communityId});
