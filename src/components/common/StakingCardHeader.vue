<template>
  <div class="card-link-top-box">
    <div class="status-container text-right">
      <span :class="card.status == 'OPENED' ? 'Active' : 'Completed'">{{
        $t('pool.' + card.status.toLowerCase())
      }}</span>
    </div>
    <div class="d-flex align-items-center">
      <div class="card-link-icons">
        <img class="icon1" :src="communityInfo.icon" alt="" />
        <img class="icon2" :src="icon" alt="" />
      </div>
      <div class="card-link-title-text font20 font-bold">
        <div class="link-title">
          <span :id="communityId + card.id + 'com'">{{
              communityInfo.name
            }}</span>
          <b-popover
            :target="communityId + card.id + 'com'"
            triggers="hover focus"
            placement="top"
          >
            {{ communityInfo.name }}
          </b-popover>
          <i class="link-icon"></i>
        </div>
        <div class="link-title">
          <span :id="card.id">{{
              card.name
            }}</span>
          <b-popover
            :target="card.id"
            triggers="hover focus"
            placement="bottom"
          >
            {{ card.name }}
          </b-popover>
        </div>
      </div>
      <span class="primary-border font12 text-primary-0 px-2" style="border-radius: .4rem">{{ poolType }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getPoolType } from '@/utils/web3/pool'
import { getPoolFactory } from '@/utils/web3/contract'
import { getERC20Info } from '@/utils/web3/asset'
import { ASSET_LOGO_URL } from '@/constant'

export default {
  name: "StakingCardHeader",
  props: {
    card: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('currentCommunity', ['communityId', 'cToken']),
    ...mapState('web3', ['tokenIcons']),
    communityInfo() {
      if (!this.communityId || !this.getCommunityInfoById(this.communityId)) return {};
      return this.getCommunityInfoById(this.communityId)
    },
    icon() {
      switch (this.card.poolFactory.toLowerCase()){
        case getPoolFactory('bsc').toLowerCase():
          console.log(325, this.tokenIcons);
          return this.tokenIcons[this.card.asset]
        case getPoolFactory('steem').toLowerCase():
          const chainId = this.card.chainId
          return ASSET_LOGO_URL[chainId === 1 ? 'steem' : 'hive']
      }
    },
    poolType() {
      return getPoolType(this.card.poolFactory, this.card.chainId)
    },
  },
  methods: {
    openNewTab (id) {
    }
  },
  async mounted () {
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>
