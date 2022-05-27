<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="d-flex align-items-center">
        <div class="card-link-title-text font-bold">
          <div class="text-grey-7 font14 line-height14 mb-1">{{ $t('np.voteFor') }}</div>
          <div class="link-title font20 line-height24">
            <span>{{ gauge.name }}</span>
          </div>
          <!-- <div class="link-title font16 line-height20">
            <span>Earn {{ cToken.name }} & NUT</span>
          </div> -->
        </div>
        <div class="card-link-icons">
          <img class="icon1" :src="assetIcon" alt="">
          <img class="icon2" :src="nutIcon" alt="">
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
        <span class="name">{{ $t('commen.apy') }}</span>
        <div class="info d-flex align-items-center">
            <i class="help-icon mr-1" v-b-popover.hover.top="detailApr"></i>
            <span>{{ (npApr + ctokenApr).toFixed(2) }}%</span>
          </div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('np.claimbleNut') }}</span>
        <div class="info">{{ pendingRewardNut | amountForm }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getCToken } from '@/utils/web3/asset'
import { ASSET_LOGO_URL, YEAR_BLOCKS } from '@/constant'

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
    ...mapState("web3", ["stakingFactoryId", "allTokens", "fees"]),
    ...mapState(['prices']),
    ...mapState('gauge', ['communityPendingRewardNut', 'userLocked', 'totalLocked', 'userRewardNut', 'userRewardCtoken', 'gaugeRatio', 'distributionRatio']),
    ...mapState('np', ['npPrice', 'npApr']),
    ...mapState('community', ['communityData', 'rewardPerBlock']),
    totalVoted() {
      return this.gauge.votedAmount.toString() / 1e18
    },
    tvl() {
      return this.totalVoted * this.npPrice
    },
    pendingRewardNut() {
      if (this.totalVotedNP == 0 || !this.communityPendingRewardNut) return 0;
      return this.communityPendingRewardNut.toString() / 1e18 * this.totalVoted / this.totalVotedNP
    },
    ctokenApr() {
      if (!this.rewardPerBlock || !this.npPrice || this.tvl === 0  || this.totalVoted === 0 || this.gaugeRatio === 0 || !this.cToken) {
        return 0
      }
      const ctokenPrice = this.cToken.price
      
      const apr = this.rewardPerBlock[this.communityData.id] * (10000 - this.communityData.feeRatio) * this.gauge.ratio * this.gaugeRatio * ctokenPrice * YEAR_BLOCKS / this.tvl / 1e14
      return apr ?? 0;
    },
    detailApr() {
      return 'NUT: ' + this.npApr.toFixed(2) + '% + ' + this.cToken?.name + ': ' + this.ctokenApr.toFixed(2) + '%'
    }
  },
  data () {
    return {
      assetIcon:'',
      cToken: {},
      nutIcon: ASSET_LOGO_URL['nut']
    }
  },
  async mounted () {
    this.cToken = await getCToken(this.communityData.id)
    this.assetIcon = this.cToken.icon
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
</style>
