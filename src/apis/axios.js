import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 5 })

axios.defaults.timeout = 10000

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      if (res.status == 200){
        resolve(res.data)
      }else{
        resolve(res.status)
      }
    }).catch(err => {
      if (err.response){
        reject(err.response.status)
        return;
      }
      reject(err)
    })
  })
}

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      if (res.status == 200){
        resolve(res.data)
      }else{
        resolve(res)
      }
    }).catch(err => {
      if (err.response){
        reject(err.response.status)
        return;
      }
      reject(err)
    })
  })
}

export function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(res => {
      if (res.status == 200){
        resolve(res.data)
      }else{
        resolve(res)
      }
    }).catch(err => {
      if (err.response){
        reject(err.response.status)
        return;
      }
      reject(err)
    })
  })
}