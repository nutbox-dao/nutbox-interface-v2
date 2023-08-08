<template>
  <div class="sub-home-page">
    <div class="scroll-content page-view">
      <!-- base info -->
      <div class="p-card">
        <img class="poster" :src="baseInfo && baseInfo.poster" alt="">
        <div class="second-card-home border-0">
          <img class="large-logo" :src="baseInfo && baseInfo.icon" alt=""/>
          <div class="text-left">
            <div class="d-flex align-items-center font20 line-height24 font-bold">
              <a v-if="baseInfo && baseInfo.website"
                 class="font20 font-bold text-white m-0"
                 :href="baseInfo && baseInfo.website"
                 target="_blank">{{ baseInfo && baseInfo.name }}</a>
              <div v-else>{{ baseInfo && baseInfo.name }}</div>
              <i class="v-line mx-2" v-show="baseInfo && baseInfo.website && baseInfo.website.length > 4"></i>
              <i class="official-link-icon ml-2" @click="open(baseInfo.website)" v-show="baseInfo && baseInfo.website && baseInfo.website.indexOf('https://') !== -1"></i>
            </div>
            <div class="desc font14 line-height18 mt-2"
                 v-html="(baseInfo && baseInfo.description)"></div>
          </div>
        </div>
      </div>
      <!-- c token -->
      <div class="c-card">
        <div class="content1">
          <div class="title mb-3">{{ $t('community.communityToken') }}</div>
          <div class="row">
            <div class="col-md-5 d-flex token-base-info">
              <img class="token-logo mr-3" :src="cToken && cToken.icon" alt=""/>
              <div>
                <span class="font20">{{ cToken ? cToken.symbol : '-' }}</span>
                <div class="d-flex align-items-center">
                  <div class="token-address font12 text-grey-7"
                       @click="copyAddress(cToken ? cToken.address : null)">
                    {{ cToken ? cToken.name : '-' }}
                  </div>
                  <i class="link-icon link-icon-gray"></i>
                </div>
              </div>
            </div>
            <div class="col-md-7 base-value-info d-flex text-center">
              <div class="r-item">
                <div class="label font12 text-grey-7">{{ $t('asset.price') }}</div>
                <div class="value font-bold">{{ (cToken ? cToken.price : 0) | formatPrice }}</div>
              </div>
              <div class="r-item">
                <div class="label font12 text-grey-7">{{ $t('asset.totalSupply') }}</div>
                <div class="value font-bold">{{ formatTotalSupply }}</div>
              </div>
              <div class="r-item">
                <div class="label font12 text-grey-7">{{ $t('asset.cap') }}</div>
                <div class="value font-bold">
                  {{ (cToken ? (totalSupply * cToken.price) : 0) | formatPrice }}
                </div>
              </div>
            </div>
          </div>
        </div>
       <div class="c-loading c-loading-absolute c-loading-bg" v-show="!cToken"></div>
      </div>
      <!-- distribution -->
      <div class="c-card">
        <div class="content2 mb-5">
          <div class="title mb-3">{{ $t('desc.disStrategy') }}</div>
          <Progress :progress-data="specifyDistributionEras"></Progress>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-show="specifyDistributionEras.length == 0"></div>
      </div>
      <!-- token distribution -->
      <div class="c-card">
        <div class="content3" v-if="tokenAllocation && (tokenAllocation.length > 0)">
          <div class="title mb-3">{{ $t('pool.tokenDistribution') }}</div>
          <PoolRatio canvas-id="token-distribution" :animation='false' :pools-data="tokenAllocation" :chart-style="{maxWidth: '15rem'}"/>
        </div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('pool.noPools') }} </p>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-show="loadingPool"></div>
      </div>
      <!-- pools -->
      <div class="c-card">
        <div class="content3" v-if="poolsData && (poolsData.length > 0)">
          <div class="title mb-3">{{ $t('pool.pools') }}</div>
          <PoolRatio canvas-id="pools" :animation='false' :pools-data="poolsData" :chart-style="{maxWidth: '15rem'}"/>
        </div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('pool.noPools') }} </p>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-show="loadingPool"></div>
      </div>
      <!-- Dao fund -->
      <div class="c-card">
        <div class="content3">
          <div class="title mb-3">{{ $t('community.communityAsset') }}</div>
          <div class="custom-form form-row-align-center">
            <!-- community balance -->
            <b-form-group v-if="isMintable" label-cols-md="3" content-cols-md="8"
                          class="align-items-center"
                          label-class="font14"
                          label-align="left"
                          :label="$t('community.communityBalance')">
              <div class="d-flex v-middle">
                <div class="c-input-group c-input-group-bg">
                  <b-form-input
                    :disabled="true"
                    v-model='communityBalanceValue'
                    placeholder="0.000"
                  >
                  </b-form-input>
                  <span class="c-append">{{ cToken ? cToken.symbol : '' }}</span>
                </div>
              </div>
            </b-form-group>
            <!-- community retained revenue -->
            <b-form-group label-cols-md="3" content-cols-md="8"
                          class="align-items-center"
                          label-class="font14"
                          label-align="left"
                          :label="$t('community.retainedRevenue')">
              <div class="d-flex v-middle">
                <div class="c-input-group c-input-group-bg">
                  <b-form-input
                    :disabled="true"
                    v-model="retainedRevenue"
                    placeholder="0.00"
                  >
                  </b-form-input>
                  <span class="c-append">{{ cToken ? cToken.symbol : '' }}</span>
                </div>
              </div>
            </b-form-group>
            <!-- community dev address -->
            <b-form-group label-cols-md="3" content-cols-md="8"
                          label-class="font14"
                          label-align="left"
                          :label="$t('community.fundAddress')">
              <div class="d-flex v-middle">
                <div class="c-input-group c-input-group-bg">
                  <b-form-input
                    :disabled="true"
                    :placeholder="fund"
                    v-model="fund"
                  >
                  </b-form-input>
                  <span></span>
                </div>
              </div>
            </b-form-group>
            <!-- community dev ratio -->
            <b-form-group label-cols-md="3" content-cols-md="8"
                          label-align="left"
                          label-class="font14"
                          :label="$t('community.fundRatio')">
              <div class="d-flex v-middle">
                <div class="c-input-group c-input-group-bg">
                  <b-form-input
                    :disabled="true"
                    type="number"
                    :placeholder="(feeRatio / 100).toFixed(2).toString()"
                    :value="(feeRatio / 100).toFixed(2).toString()"
                  >
                  </b-form-input>
                  <span class="c-append">%</span>
                </div>
              </div>
            </b-form-group>
          </div>
        </div>
      </div>
      <!-- <div class="c-card" v-if="communityInfo && (Number(communityInfo.treasury) !== 0)">
        <div class="content3">
           <div class="title mb-3">{{ $t('treasury.daoTreasury') }}</div>
           <div class="custom-form form-row-align-center">
              <b-form-group label-cols-md="3" content-cols-md="8"
                            label-class="font14"
                            label-align="left"
                            :label="$t('treasury.treasuryAddress')">
                <div class="d-flex v-middle">
                  <div class="c-input-group c-input-group-bg">
                    <b-form-input
                      :disabled="true"
                      :placeholder="communityInfo.treasury"
                      v-model="communityInfo.treasury"
                    >
                    </b-form-input>
                    <span></span>
                  </div>
                </div>
              </b-form-group>
              <b-form-group label-cols-md="3" content-cols-md="8"
                            label-class="font14"
                            label-align="left"
                            v-if="Object.keys(treasuryBalances).length > 0"
                            :label="$t('treasury.treasuryAsset')">
                <div class="d-flex" v-for="(b, idx) in treasuryTokens" :key="idx">
                  <div class="token-address col-md-4 font14" style="text-align:center" @click="copyAddress(b)">
                    {{ treasuryBalances[b + '-symbol'] }}
                  </div>
                  <div class="col-md-3 font14" style="text-align:center">
                    -
                  </div>
                  <div class="col-md-4 font14" style="text-align:center">
                    {{ (treasuryBalances[b + '-balance'].toString() / 1e18) | amountForm }}
                  </div>
                </div>
              </b-form-group>
              <ConnectMetaMask class="w-50"
                v-if="!metamaskConnected"
              />
              <button class="primary-btn w-50" v-if="metamaskConnected && treasuryTokens && treasuryTokens.length > 0" @click="treasuryBtnClick" :disabled="loadingApprovement || isApprovingTreasury">
                  <b-spinner small type="grow" v-show="loadingApprovement || isApprovingTreasury"></b-spinner>
                {{ (loadingApprovement || !isApprovedTreasury) ? $t('operation.approveContract') : $t('operation.redeem') }}
              </button>
            </div>
        </div>
      </div> -->
    </div>
  <!-- history -->
    <div class="activity-banner">
      <div class="a-banner-card">
        <div class="mt-2 mb-4 font-bold font14 justify-content-between d-flex  flex-column">
          <div class="font24 line-height24 mb-4">{{ communityInfo ? communityInfo.operationCount : '' }} {{ $t('commen.activities') }}</div>
          <div class="d-flex align-items-center">
            <span class="mr-2 font14 text-grey-7">{{ $t('desc.adminOnly') }}</span>
            <ToggleSwitch v-model="isAdmin"/>
          </div>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-if="!operationHistory || (operationHistory.length === 0)"></div>
        <transition-group v-else name="list-complete">
          <ActivityItem class="mt-3 list-complete-item"
                        v-for="operation of operationHistory" :key="operation.id + operation.type"
                        v-show="!isAdmin || (isAdmin && operation.type.indexOf('ADMIN') !== -1)"
                        :operation="operation"></ActivityItem>
        </transition-group>
      </div>
    </div>
    <!-- redeem tip -->
    <!-- <b-modal
      v-model="showRedeem"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("operation.redeem") }}
        </div>
        <div class="mb-4">
          <div class="label mb-2 d-flex justify-content-between">
            <span></span>&nbsp;
            <span class="text-right">{{ $t("wallet.balance") }}:{{ ctokenBalance | amountForm }}</span>
          </div>
          <div class="c-input-group c-input-group-bg">
            <input type="number" v-model="redeemValue" placeholder="0"/>
          </div>
          <div class="font14 mt-2 d-flex" v-if="parseFloat(redeemValue) > 0">
            <span>
              {{ $t('desc.youWillReceive') }}
            </span>
            <div class="flex-1">
              <div class="d-flex" v-for="t of treasuryTokens" :key="t" v-show="parseFloat(redeemAssetsAmount[t]) > 1e-6">
                <div class="flex-1 text-center">
                  {{ treasuryBalances[t + '-symbol'] }}
                </div>
                <div class="flex-1 text-center">
                  --
                </div>
                <div class="flex-1 text-center">
                  {{ redeemAssetsAmount[t] | amountForm }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button class="dark-btn mx-3" @click="showRedeem = false" :disabled="redeeming">
            <b-spinner small type="grow" v-show="redeeming" />
            {{ $t("operation.cancel") }}
          </button>
          <button class="primary-btn mx-3" @click="redeem" :disabled="redeeming">
            <b-spinner small type="grow" v-show="redeeming" />
            {{ $t("operation.confirm") }}
          </button>
        </div>
      </div>
    </b-modal> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Progress from '@/components/community/Progress'
import PoolRatio from '@/components/community/PoolRatio'
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { getSingleCtokenBalance } from '@/utils/web3/asset'
import { sleep, formatBalance, rollingFunction, formatAmount } from '@/utils/helper'
import { getSpecifyDistributionEras, getCommunityBalance, getApprovement, approveUseERC20 } from '@/utils/web3/community'
import ActivityItem from '@/components/community/ActivityItem'
import { getUpdateCommunityOPHistory } from '@/utils/graphql/community'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import { getTreasuryBalance, redeem } from '@/utils/web3/treasury'
import { handleApiErrCode } from '../../utils/helper'
import { ethers } from 'ethers'

export default {
  name: 'Home',
  components: {
    Progress,
    PoolRatio,
    ActivityItem,
    ToggleSwitch,
    ConnectMetaMask
  },
  data () {
    return {
      retainedRevenue: 0,
      loadingPool: true,
      loadingHistory: false,
      loadingApprovement: true,
      isApprovedTreasury: false,
      isApprovingTreasury: false,
      fund:'',
      isAdmin: false,
      treasuryBalances: {},
      showRedeem: false,
      redeemValue: '',
      redeeming: false,
      ctokenBalance: 0,
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityId', 'communityInfo', 'loadingCommunityInfo', 'allPools', 'feeRatio', 'cToken', 'specifyDistributionEras', 'operationHistory', 'communityBalance']),
    // ...mapState('web3', ['treasuryTokens']),
    ...mapState(["metamaskConnected"]),
    ...mapGetters('community', ['getCommunityInfoById']),
    poolsData () {
      if (!this.allPools) return []
      this.loadingPool = false
      return this.allPools.filter(pool => pool.status === 'OPENED').map(pool => ({
        name: pool.name,
        ratio: parseFloat(pool.ratio) / 100
      }))
    },
    tokenAllocation() {
      return [
        {
          name: this.$t('pool.pools'),
          ratio: (10000 - this.feeRatio) / 100
        },
        {
          name: this.$t('community.communityAsset'),
          ratio: this.feeRatio / 100
        }
      ]
    },
    redeemAssetsAmount() {
      if (Object.keys(this.treasuryTokens).length === 0 || Object.keys(this.treasuryBalances).length === 0) return {}
      let inputAmount = parseFloat(this.redeemValue)
      let amounts = {}
      const rate = inputAmount / this.totalSupply
      for (let t of this.treasuryTokens) {
        amounts[t] = rate * (this.treasuryBalances[t + '-balance'].toString() / 1e18)
      }
      return amounts
    },
    baseInfo () {
      if (this.communityId) {
        return this.getCommunityInfoById(this.communityId)
      }
    },
    isMintable () {
      if (!this.cToken) {
        return false;
      }
      return !this.cToken.isMintable
    },
    communityBalanceValue () {
      if (!this.cToken) return 0;
      return this.communityBalance.toString() / (10 ** this.cToken.decimal)
    },
    totalSupply () {
      return (this.cToken ? (this.cToken.totalSupply / (10 ** this.cToken.decimal)) : 0)
    },
    formatTotalSupply() {
      return formatAmount(this.totalSupply)
    }
  },
  methods: {
    open(url) {
      window.open(url, '_blank')
    },
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },
    copyAddress (address) {
      if (!address) return
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: this.formatUserAddress(address)
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    treasuryBtnClick() {
      if (this.isApprovedTreasury) {
        this.showRedeem = true
      }else {
        this.approve()
      }
    },
    async approve() {
      try{
        this.isApprovingTreasury = true
        await approveUseERC20(this.communityInfo.cToken, this.communityInfo.treasury)
        this.isApprovedTreasury = true;
      } catch (e) {
        handleApiErrCode(e, (title, info) => {
          this.bvToast.toast(title, info)
        });
      } finally {
        this.isApprovingTreasury = false
      }
    },
    async redeem() {
      try{
        if (parseFloat(this.redeemValue) >= this.ctokenBalance){
          this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        this.redeeming = true
        await redeem(this.communityInfo.treasury, this.redeemValue)
        getSingleCtokenBalance(this.communityInfo.cToken).then(b => this.ctokenBalance = b)
        this.$bvToast.toast(this.$t('tip.redeemSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        getTreasuryBalance(this.communityInfo.treasury).then(b => this.treasuryBalances = b)
        await sleep(5);
        this.showRedeem = false;
      } catch (e) {
        handleApiErrCode(e, (title, info) => {
          this.$bvToast.toast(title, info)
        })
      } finally {
        this.redeeming = false
      }
    }
  },
  async mounted () {
    while (!this.communityInfo || !this.cToken) {
      await sleep(0.2)
    }
    this.fund = this.communityInfo.daoFund

    getSpecifyDistributionEras(this.communityId).then(res => {
      console.log('dis', res);
    })
    getSingleCtokenBalance(this.communityInfo.cToken).then(b => this.ctokenBalance = b)
    // if (Number(this.communityInfo.treasury) !== 0) {
    //   getTreasuryBalance(this.communityInfo.treasury).then(b => this.treasuryBalances = b)
    //   getApprovement(this.communityInfo.cToken, this.communityInfo.treasury).then(a => {
    //     this.loadingApprovement = false
    //     this.isApprovedTreasury = a
    //   }).catch(res => {
    //     console.log(2, res);
    //   })
    // }

    this.retainedRevenue = this.communityInfo.retainedRevenue.toString() / (10 ** this.cToken.decimal);
    // start watch history
    while (!this.operationHistory || this.operationHistory.length === 0) {
      await sleep(0.3)
    }
    const interval = rollingFunction(getUpdateCommunityOPHistory, this.communityId, 3)
    interval.start();
    this.$once('hook:beforeDestroy', () => {
      interval.stop();
    })
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/poster-card";
@import "src/static/css/form";
.sub-home-page {
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  .page-view {
    flex: 1;
  }
  .activity-banner {
    width: 25%;
    min-width: 16rem;
    max-width: 300px;
    padding: 0 .8rem .8rem;
  }
  .a-banner-card {
    @include card(1.2rem, var(--card-bg-primary), auto);
  }
  .list-complete-item {
    transition: all .6s;
  }
  .list-complete-enter-active {
    opacity: 0;
  }
}
.p-card {
  height: fit-content;
  .poster {
    width: 100%;
    min-height: 0;
    height: fit-content;
    max-height: fit-content;
    object-fit: cover;
  }

  .v-line {
    display: inline-block;
    @include line(1px, 1rem, 0, var(--text-74))
  }
}

.c-card {
  @include card(.8rem 1rem, var(--card-bg-primary), hidden, fit-content);
  margin-top: 1rem;
  margin-bottom: .8rem;

  .token-logo {
    height: 2.4rem;
    width: 2.4rem;
    min-width: 2.4rem;
    min-height: 2.4rem;
    @include coin-shadow();
    border-radius: 3rem;
  }
  .title {
    font-size: 20px;
    line-height: 24px;
    font-weight: bold;
  }

  .token-address {
    background-image: url("~@/static/images/copy.svg");
    background-size: .8rem;
    background-repeat: no-repeat;
    background-position: right center;
    padding-right: 1.4rem;
    cursor: pointer;
  }

  .token-base-info {
    border-right: 1px solid var(--dividers);
    align-items: center;
  }
  .r-item {
    flex: 1;
  }
  .r-item .value {
    margin-top: .5rem;
    font-size: 1rem;
    line-height: 1.2rem;
  }
  .v-middle {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
@media (min-width: 992px) and (max-width: 1050px){
  .ratio-container {
    flex-direction: column;
    align-items: center;
  }
  ::v-deep .ratio-container .legend-box {
    width: 70%;
    .name {
      flex: 1;
    }
  }
}
@media (max-width: 767px) {
  .c-card {
    .token-base-info {
      border: none;
      margin-bottom: 1rem;
    }
  }
  .ratio-container {
    flex-direction: column;
    align-items: center;
  }
  ::v-deep .ratio-container .legend-box {
    width: 70%;
    .name {
      flex: 1;
    }
  }
}
@media (min-width: 992px) and (max-width: 1600px) {
  .base-value-info {
    flex-direction: column;
  }
  .r-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .r-item .value {
    margin-top: 0!important;
  }
}
@media (min-width: 992px) {
  .sub-home-page {
    height: 100%;
    display: flex;
  }
}
@media (max-width: 991px) {
  .sub-home-page {
    height: 100%;
    overflow: auto;
    .page-view {
      padding: 0 .8rem;
      height: fit-content;
      flex: 1;
    }
    .activity-banner {
      width: 100%;
      max-width: 100%;
      height: fit-content;
    }
  }
}
@media (max-width: 500px) {
  .base-value-info {
    flex-direction: column;
  }
  .r-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .r-item .value {
    margin-top: 0!important;
  }
}
.link-icon {
  width: 0.8rem;
  height: 0.8rem;
  min-height: 0.8rem;
  margin-left: 0.2rem;
}
</style>
