<template>
  <div class="page-view-content" >
    <div class="scroll-content">
      <div class="container">
        <div class="p-card">
          <img class="poster" :src="communityInfo.poster" alt="">
          <div class="second-card">
            <img class="large-logo" :src="communityInfo.icon" alt="" />
            <div class="project-info text-left">
              <div class="d-flex align-items-center">
                <a class="font20 font-bold title icon-title official-link-icon m-0"
                  :href="communityInfo.website"
                  target="_blank">{{ communityInfo.name || 'Nutbox' }}</a>
                <i class="v-line" v-show="communityInfo.website && communityInfo.website.length > 4"></i>
              </div>
              <div class="desc font14 mt-2"
                  v-html="(communityInfo.description)"></div>
            </div>
          </div>
        </div>
        <div class="c-card">
          <div class="content1 mb-5">
            <div class="title mb-3">{{ $t('community.communityAsset') }}</div>
            <div class="row">
              <div class="col-md-4 d-flex align-items-center token-base-info">
                <img class="token-logo" :src="communityInfo.icon" alt="" />
                <span class="px-3">{{ ctoken ? ctoken.symbol : '-' }}</span>
                <div class="token-address" @click="copyAddress(ctoken ? ctoken.address : null)">{{ ctoken ? ctoken.name : '-' }}</div>
              </div>
              <div class="col-md-8 flex-between-center">
                <div class="r-item">
                  <div class="label mb-2">{{ $t('asset.price') }}</div>
                  <div class="value">{{ (ctoken ? ctoken.price : 0) | formatPrice }}</div>
                </div>
                <div class="r-item">
                  <div class="label mb-2">{{ $t('asset.totalSupply') }}</div>
                  <div class="value">{{ (ctoken ? ctoken.totalSupply : 0) / (10 ** ctoken.decimal) | amountForm }}</div>
                </div>
                <div class="r-item">
                  <div class="label mb-2">{{ $t('asset.cap') }}</div>
                  <div class="value">
                    {{ (ctoken ? (ctoken.totalSupply / (10 ** ctoken.decimal) * ctoken.price) : 0) | formatPrice }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content2 mb-5">
            <div class="title mb-3">{{ $t('community.tokenRelease') }}</div>
            <Progress :progress-data="distributin"></Progress>
          </div>
          <div class="content3 mb-5">
            <div class="title mb-3">{{ $t('asset.poolRatios') }}</div>
            <PoolRatio :pools-data="poolsData"/>
          </div>
          <div class="content3 mb-5">
            <div class="title mb-3">DAO Fund</div>
            <div class="custom-form">
              <!-- community balance -->
          <b-form-group v-if="!isMintable" label-cols-md="2" content-cols-md="7" :label="$t('community.communityBalance')">
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  v-model='communityBalanceValue'
                  placeholder="0.000"
                >
                </b-form-input>
                <span class="c-append">{{ ctoken ? ctoken.symbol: '' }}</span>
              </div>
            </div>
          </b-form-group>
          <!-- community dev address -->
          <b-form-group label-cols-md="2" content-cols-md="7"
            :label="$t('community.devAddress')"
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  :placeholder="devAddress"
                >
                </b-form-input>
                <span></span>
              </div>
            </div>
          </b-form-group>
          <!-- community dev ratio -->
          <b-form-group label-cols-md="2" content-cols-md="7" :label="$t('community.devRatio')">
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  type="number"
                  :placeholder="(devRatio / 100).toFixed(2).toString()"
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
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Progress from '@/components/Community/Progress'
import PoolRatio from '@/components/Community/PoolRatio'
import { getCToken } from '@/utils/web3/asset'
import { sleep, formatBalance } from '@/utils/helper'
import { getSpecifyDistributionEras, getCommunityBalance, getCommunityDaoInfo } from '@/utils/web3/community'

export default {
  name: 'Home',
  components: { Progress, PoolRatio },
  data () {
    return {
      communityId: null,
      ctoken: {},
      isMintable: true,
      distributin: [],
      communityBalanceValue: 0,
      devAddress:'',
      devRatio: 0
    }
  },
  computed: {
    ...mapState(['currentCommunityId']),
    ...mapState('web3', ['cTokens', 'allPools']),
    ...mapGetters('web3', ['communityById']),
    communityInfo () {
      const com = this.communityById(this.currentCommunityId)
      return com
    },
    poolsData() {
      if (!this.allPools) return [];
      return this.allPools.filter(pool => pool.communityId === this.currentCommunityId).map(pool => ({
        name: pool.poolName,
        value: parseFloat(pool.poolRatio) / 100
      }))
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
      if (!address) return;
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
  },
  async mounted () {
    while (!this.currentCommunityId) {
      await sleep(0.2);
    }
    this.ctoken = this.cTokens[this.currentCommunityId]
    getCToken(this.currentCommunityId, true).then(async (res) => {
      this.ctoken = res;
      this.isMintable = res.isMintable
      if (!this.isMintable) {
        const bb = await getCommunityBalance(this.currentCommunityId, res)
        this.communityBalanceValue = formatBalance(bb.toString() / (10 ** res.decimal))
      }
    })
    getSpecifyDistributionEras(this.currentCommunityId).then(res => this.distributin = res);
    getCommunityDaoInfo(this.currentCommunityId).then(res => {
      this.devAddress = res.dev;
      this.devRatio = res.ratio;
    })
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/poster-card";
@import "src/static/css/form";

.p-card {
  height: fit-content;
  margin-top: 3rem;
  .poster{
    @include card-poster-bg(12rem);
    background-color: var(--primary-custom);
  }
  .v-line {
    display: inline-block;
    margin: 0 1rem;
    @include line(1px, 1rem, 0, #E3E5E8)
  }
}
.c-card {
  @include card(2rem, white, hidden, fit-content);
  margin-top: 1rem;
  margin-bottom: 3rem;
  .title {
    @include single-color-bg(.2rem 1.6rem, left center);
    padding-left: 1rem;
    text-align: left;
  }
  .token-logo {
    height: 2.8rem;
    width: 2.8rem;
    @include coin-shadow();
    border-radius: 3rem;
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
  }
  .r-item {
    flex: 1;
  }
}
@media (max-width: 767px) {
  .c-card {
    .token-base-info {
      border: none;
      margin-bottom: 1rem;
    }
    .r-item:nth-child(2) {
      border-left: 1px solid var(--dividers);
      border-right: 1px solid var(--dividers);
    }
  }
}
</style>
