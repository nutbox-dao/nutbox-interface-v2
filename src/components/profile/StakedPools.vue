<template>
  <div class="staked-pools">
    <div class="row">
      <div class="col-md-6">
        <div class="nav-box nav-box-bg mb-3 mb-md-0">
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
<!--    <div class="c-card mt-3" v-if="joinedPool.length>0">-->
<!--      <div v-for="(pool, index) of joinedPool" :key="index">-->
<!--        <UserStakingList v-if="getCommunityInfoById(pool.community.id)" :pool="pool" />-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="c-loading my-5" v-else></div>-->

    <div class="c-card">
      <div v-for="i of 10" :key="i">
        <UserStakingList :pool="testData"></UserStakingList>
      </div>
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
      isApprove: false,
      testData: {
        asset: "0x6e7574626f780000000000000000000000000000000000000000000000000000",
        chainId: 1,
        community: {id: "0x92a3a1148caceec2c588e67228e95209a3c03b7e"},
        id: "0xe70ef856b121667032773405803b4ac6b789a042",
        name: "Delegate to nutbox",
        poolFactory: "0x4042163cf1e94b5a0ae5296de55a076110d03e55",
        ratio: 1000,
        stakers: ["0x3d67a8926f097a1304eaf9dc985fd00533fa56c5", "0xe27890a9f122c6df6f27a6fb92970334777016dd"],
        stakersCount: 2,
        status: "OPENED",
        totalAmount: "16566148834"
      }
    }
  },
  components: {
    UserStakingList,
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('web3', ['userGraphInfo', 'tokenIcons']),
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
      if (this.userGraphInfo && this.userGraphInfo.inPools) {
        break;
      }
      await sleep(0.3)
    }
    // update pools data
    const [stake, total, reward, approve] = updatePoolsByPolling(this.userGraphInfo.inPools)
    this.$once('hook:beforeDestroy', () => {
        stake.stop();
        total.stop();
        reward.stop();
        approve.stop();
    });
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(0);
}
</style>
