

export default {
    namespaced: true,
    state: {
      communityId: null,
      // loading community info from graph flag
      loadingCommunityInfo: false,
      communityInfo: null,
      allPools: null,
      cToken: null,
      operationHistory: null,
      feeRatio: 0,
      operationCount: 0,
      specifyDistributionEras: []
    },
    mutations: {
      saveCommunityId (state, communityId) {
        state.communityId = communityId;
      },
      saveLoadingCommunityInfo (state, loadingCommunityInfo) {
        state.loadingCommunityInfo = loadingCommunityInfo
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
      saveSpecifyDistributionEras (state, specifyDistributionEras) {
        state.specifyDistributionEras = specifyDistributionEras
      },
      
      clearData (state) {
          state.communityId = null;
          state.communityInfo = null;
          state.operationHistory = null;
          state.feeRatio = 0;
          state.allPools = null;
          state.cToken = null;
          state.operationCount = 0;
          state.specifyDistributionEras = [];
      }
    }
  }
  