import { get, post, put } from "./axios";
import {
    WH3_API_URL,
} from "../config";

export const getAccountByAddress = async (ethAddress) =>
    get(WH3_API_URL + '/users/getUserByEth', {ethAddress})

export const getCommunityByEth = async (ethAddress) =>
    get(WH3_API_URL +'/community/getCommunityByEth', {ethAddress})

export const twitterLogin = async (state) =>
    get(WH3_API_URL + '/users/login', {state})

export const twitterAuth = async (params) =>
    post(WH3_API_URL + '/auth/login', params)

export const check = async (params) =>
    post(WH3_API_URL + '/register/check', params)

export const register = async (params) => 
    post(WH3_API_URL + '/register', params)

export const checkDisplayTag = async (tag) => 
    get(WH3_API_URL + '/community/checkDisplayTag', {tag})

export const createCommunity = async (params) =>
    put(WH3_API_URL + '/community/createCommunity', params)

export const updateRewards = async (params) =>
    put(WH3_API_URL + '/community/updateRewards', params);

export const updateCCPoloicy = async (params) =>
    put(WH3_API_URL + '/community/updateCCPolicy', params)

export const updateWh3ComConfig = async (params) =>
    put(WH3_API_URL + '/community/updateWh3ComConfig', params)