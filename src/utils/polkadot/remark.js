import { BSC_CHAIN_ID } from '@/config'
// 创建nutbox推荐人remark
/**
 * 
 *const remark = api.createType('NutboxRemark', {
  magic: 'nutbox',
  msgType: 'crowdloan',
  source: api.createType('Compact<u8>', 2),   // 2: polkadot, 3: kusama
  dest: api.createType('Compact<u8>', 0),
  sequence: api.createType('Compact<u64>', Date.now()),
  paraId: api.createType('Compact<u32>', 2001),
  trieIndex: api.createType('Compact<u32>', 1),
  communityAccount: 'DzmAoYXo1ka1xW3CCZajTXqJxG5oQUJLqLBbpqDzCUatHBP',
  recipient: '0xA29D4E0F035cb50C0d78c8CeBb56Ca292616Ab20'.substr(2),
  amount: api.createType('Compact<BalanceOf>', new BN('6000000000000')),
  bindAccount: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F',
  stakingFeast: '0xef1E390c2108376C45e5e5467Eaf58D454FdE7Ad'.substr(2),
  pid: api.createType('Compact<u8>', 0)
});
 * @returns 
 */
export const createCrowdloanRemark = (api, chainId, paraId, trieIndex, communityAccount, recipient,amount,bindAccount,stakingFeast, pid) => {
  const remark = api.createType('NutboxRemark', {
    magic: 'nutbox',
    msgType: 'crowdloan',
    source: api.createType('Compact<u8>', chainId),
    dest: api.createType('Compact<u8>', 0),
    sequence: api.createType('Compact<u64>', Date.now()),
    paraId,
    trieIndex,
    communityAccount,
    recipient: recipient.substr(2),
    amount,
    bindAccount,
    stakingFeast: stakingFeast.substr(2),
    pid: api.createType('Compact<u8>', pid)
  })
  console.log(25, remark);
  return api.createType('Bytes', remark.toHex())
}

export const createCrowdstakingRemark = (api, communityId, projectId) => {
    const remark = api.createType('NutboxRemark', {
        magic: 'nutbox',
        op: 1,
        communityId,
        projectId
    })
    return api.createType('Bytes', remark.toHex())
}

/**
 *  创建khala的众贷推荐机制remark, chian Id  2004
 * @param {*} api
 * @param {*} paraId
 * @param {*} referrer   // 推荐人
 * @returns 
 */
export const createKhalaReferrerRemark = (api, paraId, referrer) => {
  const refAcc = api.createType('AccountId', referrer)
  const remark = api.createType('PhalaCrowdloanReferrerRemark', {
    magic: 'CR',
    paraId,
    referrer: refAcc,
    referrerHash: refAcc.hash.toHex()
  })
  return api.createType('Bytes', remark.toHex())
}