

export default {
    namespaced: true,
    state: {
      communityId: null,
      communityInfo: null,
      allPools: null,
      cToken: null,
      operationHistory: null,
      feeRatio: 0,
      operationCount: 0,
    },
    mutations: {
      saveCommunityId (state, communityId) {
        state.communityId = communityId;
      },
      saveCommunityInfo (state, communityInfo) {
          state.communityInfo = communityInfo
      },
      saveOperationHistory (state, operationHistory) {
          state.operationHistory = operationHistory
      },
      saveAllPools (state, allPools) {
        state.allPools = allPools
      },
      saveCtoken (state, cToken) {
        state.cToken = cToken
      },
      saveFeeRatio (state, feeRatio) {
        state.feeRatio = feeRatio
      },
      saveOperationCount (state, operationCount) {
        state.operationCount = operationCount
      },
      
      clearData (state) {
          state.communityId = null;
          state.communityInfo = null;
          state.operationHistory = null;
      }
    }
  }
  