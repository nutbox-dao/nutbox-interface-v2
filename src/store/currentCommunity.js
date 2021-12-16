
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
      communityId: Cookie.get('currentCommunityId'),
      // loading community info from graph flag
      loadingCommunityInfo: false,
      communityInfo: null,
      allPools: null,
      cToken: null,
      operationHistory: null,
      allUsers: null,
      feeRatio: 0,
      operationCount: 0,
      specifyDistributionEras: []
    },
    mutations: {
      saveCommunityId (state, communityId) {
        state.communityId = communityId;
        Cookie.set('currentCommunityId', communityId, '30d')
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
      saveAllUsers(state, allUsers) {
        state.allUsers = allUsers
      },
      
      clearData (state) {
          state.communityInfo = null;
          state.operationHistory = [];
          state.feeRatio = 0;
          state.allPools = null;
          state.cToken = null;
          state.allUsers = null;
          state.operationCount = 0;
          state.specifyDistributionEras = [];
      }
    }
  }
  