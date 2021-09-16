import {
  get,
  post,
  put
} from './axios'
import {
  CROWD_STAKING_API_URL,
  CROWD_LOAN_API_URL,
  BACKEND_API_URL
} from '../config'

// ============================================ NPS ============================================
const API_URL ='https://service.nutbox.io'

export const getProposal = async (params) => get(API_URL + '/nps/getProposal', params)

// ============================================ crowdstaking ============================================ 
/**
 * 获取所有的投票的卡片
 * @returns 
 */
export const getCrowdstacking = async () => post(CROWD_STAKING_API_URL + '/crowdstaking/find/all')

/**
 * 获取要导出的投票数据
 * @param {*} param {relaychain, communityId, projectId}
 * @returns 
 */
export const getNominationSummary = async (param) => post(CROWD_STAKING_API_URL + '/crowdstaking/find/nominations', param)


// ============================================ crowdloan ============================================ 

// 获取所有注册的社区信息
export const getCommunitys = async () => post(CROWD_LOAN_API_URL + '/community/all')
/**
 * 上传contribution数据
 * params：
 * relaychain: 'rococo,
 * blockHash:'sdfsfasdf',
 * communityId:'',
 * nominatorId:'',
 */
export const postContribution = async (params) => post(CROWD_LOAN_API_URL + '/contrib/submit', params)

/**
 * 获取要展示的卡片信息
 * relaychain： ‘rococo'
 */
export const getOnshowingCrowdloanCard = async (relaychain) => post(CROWD_LOAN_API_URL + '/crowdloan/live', {relaychain})

/**
 * 获取个人界面的contribution记录
 * relaychain:'rococo',
 * contributor:'address',
 * offset:0
 * limit:7
 */
export const getUserContributions = async (params) => post(CROWD_LOAN_API_URL + '/contrib/find/contributor', params)

/**
 * 获取社区的某个众贷导出数据
 * relaychain:'rococo',
 * communityId:'',
 * paraId:'',
 * limit: null,
 * offset: null,
 * 
 */
export const getExportContributionInfo = async (params) => post(CROWD_LOAN_API_URL + '/contrib/find/crowdloan', params)

/**
 * 获取dashboard需要显示的数据
 * relaychain: 'rococo'
 */
export const getDashboardSummary = async (params) => post(CROWD_LOAN_API_URL + '/crowdloan/summary', params)

// ============================================ backend v2 ============================================ 

export const getAllCommunities = async () => get(BACKEND_API_URL + '/community/get')

export const getMyCommunityInfo = async (communityId) => get(BACKEND_API_URL + '/community/get', {id: communityId})

export const insertCommunity = async (params) => post(BACKEND_API_URL + '/community/insert', params)

export const updateCommunity = async (params) => put(BACKEND_API_URL + '/community/update', params)

export const updateBlogTag = async (params) => put(BACKEND_API_URL + '/community/updateBlogTag', params)

export const insertToken = async (params) => post(BACKEND_API_URL + '/token/insert', params)

export const getAllTokens = async () => get(BACKEND_API_URL + '/token/get')

export const getNonce = async (accountId) => get(BACKEND_API_URL + '/user/getnonce', {id: accountId})

export const updatePoolInfo = async (params) => put(BACKEND_API_URL + '/pool/update', params)

export const getAllPools = async () => get(BACKEND_API_URL + '/pool/getAll')

export const getAllParachain = async () => get(BACKEND_API_URL + '/parachain/getall')

export const getPricesOnCEX = async () => get('https://api.binance.com/api/v3/ticker/price')