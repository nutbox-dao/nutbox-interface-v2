<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="d-flex align-items-center">
        <div class="card-link-icons card-link-icons-lg">
          <img class="icon1" :src="assetIcon" alt="">
          <img class="icon2-lg" src="https://cdn.wherein.mobi/nutbox/v2/1633769085901" alt="">
        </div>
        <div class="card-link-title-text font-bold">
          <div class="link-title font20 line-height24">
            <span>{{ gauge.name }}</span>
          </div>
          <div class="link-title font16 line-height20">
            <span>Earn Monns & Nut</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card text-grey-7 font14 font-bold">
      <div class="project-info-container">
        <span class="name">{{ $t("gauge.voterCount") }}</span>
        <div class="info">{{ gauge.votersCount || 0 }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t("gauge.totalVoted") }}</span>
        <div class="info">{{ totalVoted | amountForm }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t("pool.tvl") }}</span>
        <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">Claimble Nut</span>
        <div class="info">{{ pendingRewardNut }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { NutAddress } from '@/config'
import { getPoolFactory } from '@/utils/web3/contract'
import { getERC20Info } from '@/utils/web3/asset'
import { ASSET_LOGO_URL } from '@/constant'

export default {
  name: 'ManageNPCard',
  props: {
    gauge: {
      type: Object
    },
    // all voted np of this community
    totalVotedNP: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters("web3", ["tokenByKey"]),
    ...mapState(['prices']),
    ...mapState('gauge', ['communityPendingRewardNut']),
    totalVoted() {
      console.log('4235', this.gauge);
      return this.gauge.votedAmount.toString() / 1e18
    },
    tvl() {
      const nutPrice = this.prices[NutAddress];
      if (!nutPrice || nutPrice == 0) return 0;
      return this.totalVoted * nutPrice
    },
    pendingRewardNut() {
      if (this.totalVotedNP == 0) return 0;
      return this.communityPendingRewardNut.toString() / 1e18 * this.totalVoted / this.totalVotedNP
    }
  },
  data () {
    return {
      assetIcon:''
    }
  },
  async mounted () {
    switch (this.gauge.poolFactory.toLowerCase()) {
        case getPoolFactory("erc20staking").toLowerCase():
          const stakedERC20 = await getERC20Info(this.gauge.asset);
          this.assetIcon = stakedERC20.icon;
          break;
        case getPoolFactory('steem').toLowerCase():
          this.assetIcon = ASSET_LOGO_URL[chainId === 1 ? 'steem' : 'hive']
          break;
        case getPoolFactory('cosmos').toLowerCase():
          this.assetIcon = ASSET_LOGO_URL['cosmos']
      }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
