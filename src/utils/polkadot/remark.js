import { BSC_CHAIN_ID } from '@/config'
// 创建nutbox推荐人remark
/**
 * 
 * export const NUTBOX_REMARK_TYPE = {
  magic: "Text", // 默认为nutbox
  msgType: 'Text',  // crowdloan
  dest: 'u8',   // 0: astar
  sequence: 'u64',  // timestamp
  recipient: 'Text',  // evm address
  pid: 'Text'         // evm address
};
 * @returns 
 */
export const createCrowdloanRemark = (api, recipient, pid) => {
  const remark = api.createType('NutboxRemark', {
    magic: 'nutbox',
    msgType: 'crowdloan',
    dest: api.createType('Compact<u8>', 0),
    sequence: api.createType('Compact<u64>', Date.now()),
    recipient: recipient,
    pid: pid
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