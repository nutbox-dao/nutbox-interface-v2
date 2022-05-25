<template>
  <div class="card-link-top-box">
    <div class="status-container">
      <span class="font14 font-bold" :class="card.status == 'OPENED' ? 'Active' : 'Completed'">{{
        $t('pool.' + card.status.toLowerCase())
      }}</span>
    </div>
    <div class="d-flex align-items-center">
      <div class="card-link-icons">
        <img class="icon1" :src="communityInfo.icon" alt="" />
        <img class="icon2" :src="icon" alt="" />
      </div>
      <div class="card-link-title-text font20 font-bold">
        <div class="link-title font20 line-height24">
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
        <div class="link-title font16 line-height20">
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
      <!-- <span class="chain-type mt-2">{{ poolType }}</span> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getPoolType } from '@/utils/web3/pool'
import { getPoolFactory } from '@/utils/web3/contract'
import { ASSET_LOGO_URL } from '@/constant'
import { CHAIN_NAME } from '@/config'
import { getParaIcon } from '@/utils/polkadot/util'

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
    ...mapGetters('dappstaking', ['dappByAddress']),
    ...mapState('currentCommunity', ['communityId', 'cToken']),
    ...mapState('web3', ['tokenIcons']),
    ...mapState({
      polkadotFund: state => state.polkadot.clProjectFundInfos,
      kusamaFund: state => state.kusama.clProjectFundInfos,
      polkadotLoading: state => state.polkadot.loadingFunds,
      kusamaLoading: state => state.kusama.loadingFunds
    }),
    communityInfo() {
      if (!this.communityId || !this.getCommunityInfoById(this.communityId)) return {};
      return this.getCommunityInfoById(this.communityId)
    },
    icon() {
      if (this.type === 'erc20staking') {
        return this.tokenIcons[this.card.asset]
      } else if (this.type === 'crowdloan') {
        return getParaIcon(this.card.paraId)
      } else if (this.type === 'dappstaking') {
        const dapp = this.dappByAddress(this.card.asset)
        return dapp.icon
      }
    },
    type() {
      return getPoolType(this.card.poolFactory, this.card.chainId)
    },
    poolType() {
      if (this.type === 'erc20staking') {return 'ERC20'}
      else if (this.type === 'crowdloan') {
        if (this.card.chainId === 0) {
          if (this.polkadotLoading) {
            return 'Loading'
          }
          const fund = this.polkadotFund.filter(f => f.pId === parseInt(this.card.paraId))
          if (fund.length > 0) {
            return fund[0].status
          }
        }else {
          if (this.kusamaLoading) {
            return 'Loading'
          }
          const fund = this.kusamaFund.filter(f => f.pId === parseInt(this.card.paraId))
          if (fund.length > 0) {
            return fund[0].status
          }
        }
      } else if (this.type === 'dappstaking') {
        return 'Dapp'
      }
      return this.type.toUpperCase()
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
.status-container {
  position: absolute;
  top: 8px;
  right: 8px;
  box-sizing: border-box;
  span {
    box-sizing: border-box;
  }
}
.chain-type {
  border-radius: 24px;
  color: var(--sub-primary);
  border: 1px solid var(--sub-primary);
  font-size: 14px;
  line-height: 22px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
</style>
