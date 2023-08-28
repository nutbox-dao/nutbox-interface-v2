import { get, post, put } from "./axios";
import {
    WH3_API_URL,
} from "../config";

export const getAccountByAddress = async (ethAddress) =>
    get(WH3_API_URL + '/users/getUserByEth', {ethAddress})

export const getCommunityByEth = async (ethAddress) =>
    get(WH3_API_URL +'/community/getCommunityByEth', {ethAddress})