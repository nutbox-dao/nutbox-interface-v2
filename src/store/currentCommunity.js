

export default {
    namespaced: true,
    state: {
      communityId: null,
      communityInfo: null,
      operationHistory: null,

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
      
      clearData (state) {
          state.communityId = null;
          state.communityInfo = null;
          state.operationHistory = null;
      }
    }
  }
  