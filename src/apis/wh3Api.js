import { get, post, put } from "./axios";
import {
    BACKEND_API_URL,
    WH3_API_URL,
} from "../config";

export const getAccountByAddress = async (ethAddress) =>
    get(WH3_API_URL + '/users/getUserByEth', {ethAddress})

export const getCommunityByEth = async (ethAddress) =>
    get(WH3_API_URL +'/community/getCommunityByEth', {ethAddress})

export const twitterLogin = async (state) =>
    get(BACKEND_API_URL + '/users/login', {state})

export const twitterAuth = async () =>
    get(BACKEND_API_URL + '/auth/login', params)