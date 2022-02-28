<template>
  <div class="staked-pools">
    <div class="view-top-header">
      <div class="nav-box nav-box-bg mb-3 mb-md-0 w-auto">
        <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
        </div>
      </div>
      <ToggleSwitch v-model="isFold"/>
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
        <UserStakingList v-if="getCommunityInfoById(pool.community.id)" :pool="pool" :is-fold="isFold" />
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
import ToggleSwitch from '@/components/common/ToggleSwitch'

export default {
  name: 'StakedPools',
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Steem', 'Hive', 'Inactive'],
      searchText: '',
      poolStatus: 'active',
      isApprove: false,
      isFold: true
    }
  },
  components: {
    UserStakingList,
    ToggleSwitch
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('web3', ['tokenIcons']),
    ...mapState('user', ['userGraphInfo', 'loadingUserGraph']),
    joinedPool() {
      switch(this.activeTab) {
        case 4:
          return this.inActivedPools;
        case 0:
          return this.activedPools;
        case 1:
          return this.activedPools.filter(p => p.poolFactory.toLowerCase() === getPoolFactoryAddress('erc20staking'))
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
      const polling = updatePoolsByPolling(this.userGraphInfo.inPools)
      this.$once('hook:beforeDestroy', () => {
          polling.stop();
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
.view-top-header {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 720px) {
  .view-top-header {
    flex-direction: column;
    overflow: hidden;
    .nav-box {
      width: 100%!important;
      overflow: scroll;
    }
  }
}
@media (max-width: 560px) {
  .view-top-header {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
