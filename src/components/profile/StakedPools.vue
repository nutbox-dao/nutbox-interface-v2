<template>
  <div class="staked-pools">
    <div class="row">
      <div class="col-md-12">
        <div class="nav-box nav-box-bg mb-3 mb-md-0 w-auto">
          <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="col-md-6">
        <div class="row">
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <b-input-group class="search-input">
              <b-form-input :placeholder="$t('operation.search')" v-model="searchText"></b-form-input>
              <template #append>
                <i class="search-icon"></i>
              </template>
            </b-input-group>
          </div>
        </div>
      </div> -->
    </div>
    <div class="c-loading my-5" v-if="loadingUserGraph"></div>
    <div class="c-card mt-3" v-else-if="joinedPool.length>0">
      <div v-for="(pool, index) of joinedPool" :key="index">
        <UserStakingList v-if="getCommunityInfoById(pool.community.id)" :pool="pool" />
      </div>
    </div>
    <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('community.noJoinedPool') }} </p>
        </div>
  </div>
</template>

<script>
import { CHAIN_NAME } from '@/config'
import { mapGetters, mapState } from 'vuex'
import { getPoolFactoryAddress, updatePoolsByPolling } from '@/utils/web3/pool'
import UserStakingList from '@/components/community/UserStakingList'
import { sleep } from '@/utils/helper'

export default {
  name: 'StakedPools',
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Steem', 'Hive', 'Inactive'],
      searchText: '',
      poolStatus: 'active',
      isApprove: false
    }
  },
  components: {
    UserStakingList,
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('web3', ['userGraphInfo', 'tokenIcons']),
    ...mapState('user', ['loadingUserGraph']),
    joinedPool() {
      switch(this.activeTab) {
        case 4:
          return this.inActivedPools;
        case 0:
          return this.activedPools;
        case 1:
          return this.activedPools.filter(p => p.poolFactory.toLowerCase() === getPoolFactoryAddress('main'))
        case 2:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('steem')) && parseInt(p.chainId) == 1)
        case 3:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('hive')) && parseInt(p.chainId) == 2)
      }
    },
    activedPools() {
      if (!this.userGraphInfo || !this.userGraphInfo.inPools || this.userGraphInfo.inPools.length === 0) return [];
      return this.userGraphInfo.inPools.filter(p => p.status === 'OPENED')
    },
    inActivedPools() {
      if (!this.userGraphInfo || !this.userGraphInfo.inPools || this.userGraphInfo.inPools.length === 0) return [];
      return this.userGraphInfo.inPools.filter(p => p.status === 'CLOSED')
    }
  },
  async mounted () {
    while(true) {
      if (this.userGraphInfo && this.userGraphInfo.inPools || !this.loadingUserGraph) {
        break;
      }
      await sleep(0.3)
    }
    // update pools data
    if (this.userGraphInfo && this.userGraphInfo.inPools){
      const [stake, total, reward, approve] = updatePoolsByPolling(this.userGraphInfo.inPools)
      this.$once('hook:beforeDestroy', () => {
          stake.stop();
          total.stop();
          reward.stop();
          approve.stop();
      });
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(0);
}
</style>
