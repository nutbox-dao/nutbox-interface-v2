/**
 * Cache to cookie
 */
import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        myCreatedCommunityInfo: Cookie.get('myCommunityInfo'),
        myCommunityDistribution: Cookie.get('myCommunityDistribution'),
        myCreatedPools: Cookie.get('myPoolsInfo')
    },
    mutations: {
        saveMyCreatedCommunityInfo: (state, myCreatedCommunityInfo) => {
            myCreatedCommunityInfo = JSON.stringify(myCreatedCommunityInfo)
            state.myCreatedCommunityInfo = myCreatedCommunityInfo;
            Cookie.set('myCommunityInfo', myCreatedCommunityInfo, "20MIN")
        },
        saveMyCommunityDistribution: (state, myCommunityDistribution) => {
            myCommunityDistribution = JSON.stringify(myCommunityDistribution)
            state.myCommunityDistribution = myCommunityDistribution;
            Cookie.set('myCommunityDistribution', myCommunityDistribution, "20MIN")
        },
        saveMyCreatedPools: (state, myCreatedPools) => {
            myCreatedPools = JSON.stringify(myCreatedPools)
            state.myCreatedPools = myCreatedPools;
            Cookie.set('myPoolsInfo', myCreatedPools, "20MIN");
        }
    }
}