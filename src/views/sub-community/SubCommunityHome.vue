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
              <i class="official-link-icon ml-2" v-show="baseInfo && baseInfo.website"></i>
              <i class="v-line mx-2" v-show="baseInfo && baseInfo.website && baseInfo.website.length > 4"></i>
            </div>
            <div class="desc font14 line-height18 mt-2"
                 v-html="(baseInfo && baseInfo.description)"></div>
          </div>
        </div>
      </div>
      <!-- c token -->
      <div class="c-card">
        <div class="content1">
          <div class="title mb-3">{{ $t('community.communityAsset') }}</div>
          <div class="row">
            <div class="col-md-5 d-flex token-base-info">
              <img class="token-logo mr-3" :src="cToken && cToken.icon" alt=""/>
              <div>
                <span class="font20">{{ cToken ? cToken.symbol : '-' }}</span>
                <div class="token-address font12 text-grey-7"
                     @click="copyAddress(cToken ? cToken.address : null)">
                  {{ cToken ? cToken.name : '-' }}
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
                <div class="value font-bold">{{ (cToken ? (cToken.totalSupply / (10 ** cToken.decimal)) : 0) | amountForm }}</div>
              </div>
              <div class="r-item">
                <div class="label font12 text-grey-7">{{ $t('asset.cap') }}</div>
                <div class="value font-bold">
                  {{ (cToken ? (cToken.totalSupply / (10 ** cToken.decimal) * cToken.price) : 0) | formatPrice }}
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
          <div class="title mb-3">Distribution Stratage</div>
          <Progress :progress-data="specifyDistributionEras"></Progress>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-show="specifyDistributionEras.length == 0"></div>
      </div>
      <!-- pools -->
      <div class="c-card">
        <div class="content3">
          <div class="title mb-3">Pools</div>
          <PoolRatio :pools-data="poolsData" :chart-style="{maxWidth: '15rem'}"/>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-show="loadingPool"></div>
      </div>
      <!-- Dao fund -->
      <div class="c-card">
        <div class="content3">
          <div class="title mb-3">DAO Fund</div>
          <div class="custom-form form-row-align-center">
            <!-- community balance -->
            <b-form-group v-if="showBalance" label-cols-md="3" content-cols-md="8"
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
    </div>
  <!-- history -->
    <div class="activity-banner">
      <div class="a-banner-card">
        <div class="mt-2 mb-4 font-bold font14 justify-content-between d-flex align-items-center">
          <span>{{ communityInfo ? communityInfo.operationCount : '' }} Activities</span>
          <div class="d-flex align-items-center">
            <span class="mr-2 font14">Admin only</span>
            <ToggleSwitch v-model="isAdmin"/>
          </div>
        </div>
        <div class="c-loading c-loading-absolute c-loading-bg" v-if="!operationHistory || (operationHistory.length === 0)"></div>
        <transition-group v-else name="list-complete">
          <ActivityItem class="mt-3 list-complete-item"
                        v-for="operation of operationHistory" :key="operation.tx + operation.type"
                        :operation="operation"/>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Progress from '@/components/community/Progress'
import PoolRatio from '@/components/community/PoolRatio'
import { getCToken } from '@/utils/web3/asset'
import { sleep, formatBalance, rollingFunction } from '@/utils/helper'
import { getSpecifyDistributionEras, getCommunityBalance } from '@/utils/web3/community'
import ActivityItem from '@/components/community/ActivityItem'
import { getUpdateCommunityOPHistory } from '@/utils/graphql/community'
import { ethers } from 'ethers'
import ToggleSwitch from '@/components/common/ToggleSwitch'

export default {
  name: 'Home',
  components: {
    Progress,
    PoolRatio,
    ActivityItem,
    ToggleSwitch
  },
  data () {
    return {
      communityBalanceValue: 0,
      loadingPool: true,
      laodingHistory: false,
      fund:'',
      isAdmin: false
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityId', 'communityInfo', 'loadingCommunityInfo', 'allPools', 'feeRatio', 'cToken', 'specifyDistributionEras', 'operationHistory']),
    ...mapGetters('community', ['getCommunityInfoById']),
    poolsData () {
      if (!this.allPools) return []
      this.loadingPool = false
      return this.allPools.filter(pool => pool.status === 'OPENED').map(pool => ({
        name: pool.name,
        ratio: parseFloat(pool.ratio) / 100
      }))
    },
    baseInfo () {
      if (this.communityId) {
        return this.getCommunityInfoById(this.communityId)
      }
    },
    showBalance () {
      if (!this.cToken) {
        return false;
      }
      return !this.cToken.isMintable
    }
  },
  methods: {
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
    }
  },
  async mounted () {
    while (!this.communityInfo) {
      await sleep(0.2)
    }
    this.fund = ethers.utils.getAddress(this.communityInfo.owner.id);
    getCToken(this.communityId, true).then(async (res) => {
      if (!res.isMintable) {
        const bb = await getCommunityBalance(this.communityId, res.address)
        this.communityBalanceValue = formatBalance(bb.toString() / (10 ** res.decimal))
      }
      // start watch history
      while (this.operationHistory.length === 0) {
        await sleep(0.3)
      }
      const interval = rollingFunction(getUpdateCommunityOPHistory, this.communityId, 3)
      interval.start();
      this.$once('hook:beforeDestroy', () => {
        interval.stop();
      })
    }).catch(e => {
      console.log('[Sub community home]: get ctoken fail', e);
    })
    getSpecifyDistributionEras(this.communityId).then(res => {
      console.log('dis', res);
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
    @include card-poster-bg(12rem);
    background-color: var(--primary-custom);
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
  }
  .v-middle {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
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
</style>
