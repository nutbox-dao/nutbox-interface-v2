import { TIME_PERIOD, BLOCK_SECOND } from "@/constant";
import CryptoJS from "crypto";
import { $t } from "@/i18n";
import axios from "axios";
import { QN_UPLOAD_URL, errCode } from "@/config";
import store from "@/store";

var cryptoOptions = {
  key: process.env.VUE_APP_CRYPTO_KEY,
  iv: process.env.VUE_APP_CRYPTO_IV,
  method: process.env.VUE_APP_CRYPTO_METHOD,
};

export const firstToUpper = function (str) {
  if (!str) {
    return;
  }
  if (str.trim().length === 0) {
    return str;
  }
  return str.trim().replace(str[0], str[0].toUpperCase());
};

export const sleep = async function (interval = 6) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval * 1000); // 6秒
  });
};

export const retryMethod = async function (func, retries = 5, interval = 1) {
  return new Promise((resolve, reject) => {
    const exc = async (retries) => {
      try {
        const res = await func();
        resolve(res);
      } catch (e) {
        setTimeout(async () => {
          if (retries > 0) {
            // console.log('retry method', retries)
            await exc(retries - 1);
          } else {
            reject(e);
          }
        }, interval * 1000);
      }
    };
    exc(retries);
  });
};

export const formatBalance = function (value, digit = 3) {
  if (!value) return "0";
  const str =
    digit != null && digit >= 0
      ? Number(value).toFixed(digit).toString()
      : value.toString();
  let integer = str;
  let fraction = "";
  if (str.includes(".")) {
    integer = str.split(".")[0];
    fraction = "." + str.split(".")[1];
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction;
};

export const formatPrice = function (value) {
  if (!value) return "--";
  const ethPrice = store.state.ethPrice;
  value = value * ethPrice;
  const str = Number(value).toFixed(3).toString();
  let integer = str;
  let fraction = "";
  if (str.includes(".")) {
    integer = str.split(".")[0];
    fraction = "." + str.split(".")[1];
  }
  return "$" + integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction;
};

export const formatUserAddress = (address, long = true) => {
  if (!address) return "Loading Account";
  if (long) {
    if (address.length < 16) return address;
    const start = address.slice(0, 28);
    const end = address.slice(-5);
    return `${start}...`;
  } else {
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  }
};

export function getDateString(now, timezone, extra = 0) {
  now = now || new Date();
  const offset = timezone != null ? timezone * 60 : 0;
  now = new Date(now.getTime() + (offset + extra) * 1000);

  return now.toISOString().replace("T", " ").substring(0, 19);
}

// block time
export function blockTime(start, end) {
  start = parseInt(start);
  end = parseInt(end);
  if (!start || !end) return "";
  if (start > end) return "";
  if (start === end) return $t("commen.now");
  if (end - start > 9999999999) return "";
  const diff = (end - start) * BLOCK_SECOND;
  return getDateString(null, null, diff);
}

// 倒计时
export function formatCountdown(end, currentBlockNum, blockInterval) {
  try {
    if (!end || !currentBlockNum) return null;
    const diff = parseInt(end) - parseInt(currentBlockNum);
    if (diff > 0) {
      const secs = diff * blockInterval;
      const month = Math.floor(secs / TIME_PERIOD["MONTH"]);
      const day = Math.floor(
        (secs % TIME_PERIOD["MONTH"]) / TIME_PERIOD["DAY"]
      );
      const hour = Math.floor(
        (secs % TIME_PERIOD["DAY"]) / TIME_PERIOD["HOUR"]
      );
      const min = Math.floor(
        (secs % TIME_PERIOD["HOUR"]) / TIME_PERIOD["MINUTES"]
      );
      const sec = Math.floor(secs % TIME_PERIOD["MINUTES"]);

      let res = "";
      if (secs >= TIME_PERIOD["MONTH"]) {
        res =
          month +
          $t("date.month") +
          day +
          $t("date.day") +
          hour +
          $t("date.hour");
      } else if (secs >= TIME_PERIOD["DAY"]) {
        res =
          day + $t("date.day") + hour + $t("date.hour") + min + $t("date.min");
      } else if (secs >= TIME_PERIOD["HOUR"]) {
        res = hour + $t("date.hour") + min + $t("date.min");
      } else {
        res = min + $t("date.min") + sec + $t("date.sec");
      }
      return res.trim();
    }
  } catch (e) {
    console.error("err", e);
    return "Loading";
  }
}

/**
 * 上传图片到七牛云，返回图片url
 * @param {*} img
 * @returns
 */
export const uploadImage = async (img) => {
  return new Promise((resolve, reject) => {
    let param = new FormData();
    param.append("file", img);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post(QN_UPLOAD_URL, param, config)
      .then((res) => {
        resolve(res?.data?.url);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Handle API err code
 * @param {*} code
 * @param {*} toast
 * @returns
 */
export const handleApiErrCode = (code, toast) => {
  let tipStr = "";
  console.log("error code", code);
  if (code === 200) {
    return true;
  } else if (code === errCode.NO_STAKING_FACTORY) {
    tipStr = $t("error.noStakingFactory");
  } else if (code === errCode.BLOCK_CHAIN_ERR) {
    tipStr = $t("error.blockChainError");
  } else if (code === errCode.CONTRACT_CREATE_FAIL) {
    tipStr = $t("error.blockChainError");
  } else if (code === errCode.USER_CANCEL_SIGNING) {
    tipStr = $t("error.cancelSigning");
  } else if (code === errCode.TRANSACTION_FAIL) {
    tipStr = $t("error.transactionFail");
  } else if (code === errCode.ASSET_EXIST) {
    tipStr = $t("error.assetHasRegisterd");
  } else if (code == errCode.NOT_CONNECT_METAMASK) {
    tipStr = $t("error.notConnectWallet");
  } else if (code == errCode.UNLOCK_METAMASK) {
    tipStr = $t("error.unlockWallet");
  } else if (code == errCode.WRONG_CHAIN_ID) {
    tipStr = $t("error.wrongChainId");
  } else if (code == errCode.WRONG_ETH_ADDRESS) {
    tipStr = $t("error.wrongETHAddress");
  } else if (code == errCode.WRONG_INPUT_DEV_RATIO) {
    tipStr = $t("error.wrongInputDevRatio");
  } else if (code == errCode.NOT_A_TOKEN_CONTRACT) {
    tipStr = $t("error.notTokenContract");
  } else if (code === errCode.TOKEN_DEPLOYING) {
    tipStr = $t("error.tokenDeploying");
  } else if (code === errCode.SIGNATURE_FAILED) {
    tipStr = $t("error.signatureFailed");
  } else if (code === errCode.INVALID_NONCE) {
    tipStr = $t("error.signatureFailed");
  } else if (code === errCode.DB_ERROR || code == errCode.SERVER_ERR) {
    tipStr = $t("error.serveError");
  } else {
    tipStr = $t("error.unknow");
  }
  toast(tipStr, {
    title: $t("tip.error"),
    variant: "danger",
  });
  return false;
};

/**
 * judge a str wheather a positive integer
 * @param {*} str
 */
export const isPositiveInt = (str) => {
  const r = /^\d+$/;
  return r.test(str);
};

export function encrpty(string) {
  let encrypted = "";
  const cipheriv = CryptoJS.createCipheriv(
    cryptoOptions.method,
    cryptoOptions.key,
    cryptoOptions.iv
  );
  encrypted += cipheriv.update(string, "utf8", "hex");
  return encrypted + cipheriv.final("hex");
}

export function decrypt(encryptedString) {
  let encrypted = "";
  const cipheriv = CryptoJS.createDecipheriv(
    cryptoOptions.method,
    cryptoOptions.key,
    cryptoOptions.iv
  );
  encrypted += cipheriv.update(encryptedString, "hex", "utf8");
  return encrypted + cipheriv.final("utf8");
}

// block time
export function blockTimeWithoutUTC(start, end) {
  start = parseInt(start);
  end = parseInt(end);
  if (!start || !end) return "";

  if (end - start > 9999999999) return "";
  const diff = (end - start) * BLOCK_SECOND;
  return getDateString(null, null, diff);
}
