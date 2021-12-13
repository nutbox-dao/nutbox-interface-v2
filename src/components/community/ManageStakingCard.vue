<template>
  <div class="c-card">
    <div class="status-container text-right">
      {{ pool.poolIndex }}
      <span v-if="pool.status === 'OPENED'" :class="'Active'">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
      <span v-else class="Completed">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
    </div>
    <div class="card-top mt-4">
      <div class="card-title-box d-flex align-items-center">
        <div class="card-single-icon">
         <img class="icon1" :src="icon" alt="">
        </div>
        <div class="title-text font20 font-bold ml-2">
          <span>{{ pool.name || '--' }}</span>
        </div>
      </div>
      <div class="h-line mt-4 mb-3"></div>
      <div class="project-info-container">
        <span class="name">{{ $t('pool.userCount') }}</span>
       <div class="info">{{ pool.stakerCount || 0 }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('pool.totalDeposit') }}</span>
       <div class="info">{{ totalDeposited | amountForm }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('pool.tvl') }}</span>
       <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('pool.ratio') }}</span>
       <div class="info">{{pool.ratio / 100}}%</div>
      </div>
    
      <button class="primary-btn" :disabled="updating" v-if="pool.status === 'OPENED'" @click="showAttention=true">
        <b-spinner small type="grow" v-show="updating" />
        {{ $t('pool.closePool')}}
      </button>
    </div>

    <!-- showAttention tip -->
    <b-modal
      v-model="showAttention"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <h3 style="color: red;text-align:center">{{ $t("tip.attention") }}</h3>
        <div class="my-5">
          {{ $t("tip.stopPoolAttention") }}
        </div>
        <div class="my-5">
          {{ `Please input pool name: "${pool.name}" to close this pool.` }}
        </div>

        <div class="c-input-group">
          <b-input-group class="d-flex flex-between-center">
            <b-input class="flex-full"
                      :placeholder="$t('placeHolder.confirmInfo', {info: pool.name})"
                      v-model="confirmInfo"></b-input>
          </b-input-group>
        </div>

        <div class="flex-between-center" style="gap: 2rem">
          <button class="primary-btn" @click="receiveAttention" :disabled="uploading">
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("pool.closePool") }}
          </button>
          <button
            class="primary-btn primary-btn-outline"
            @click="showAttention = false"
            :disabled="uploading"
          >
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("operation.cancel") }}
          </button>
        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { handleApiErrCode, sleep } from '@/utils/helper'
import { closePool } from '@/utils/web3/pool'
import { getAssetMetadata, getERC20Info } from '@/utils/web3/asset'
import { getPoolFactory } from '@/utils/web3/contract'
import { ASSET_LOGO_URL } from '@/constant'

export default {
  name: 'ManageStakingCard',
  computed: {
    ...mapState('web3', ['stakingFactoryId', 'blockNum', 'allPools', 'allTokens', 'monitorPools']),
    ...mapState('community', ['communityData']),
    ...mapState({
      steemVests: state => state.steem.vestsToSteem,
      hiveVests: state => state.hive.vestsToHive,
      prices: state => state.prices
    }),
    totalDeposited () {
      if (!this.pool || !this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-totalStakedAmount']) return 0
      return this.pool && this.monitorPools[this.stakingFactoryId + '-' + this.pool.pid + '-totalStakedAmount'] / this.vert
    },
    tvl () {
      if (!this.pool) return '--'
      switch (this.pool.asset.type) {
        case 'SteemHiveDelegateAssetRegistry':
        {
          if (this.pool.asset.chainId === 1) { // steem
            return this.totalDeposited * this.prices.STEEMETH * this.prices.ETHUSDT
          } else if (this.pool.asset.chainId === 2) { // hive
            return this.totalDeposited * this.prices.HIVEUSDT
          }
        }
        case 'SubstrateCrowdloanAssetRegistry' || 'SubstrateNominateAssetRegistry':
        {
          if (this.pool.asset.chainId === 2) { // polkadot
            return this.totalDeposited * this.prices.DOTUSDT
          } else if (this.pool.asset.chainId === 3) { // kusama
            return this.totalDeposited * this.prices.KSMUSDT
          }
        }
        case 'HomeChainAssetRegistry':
          return this.erc20Price * this.totalDeposited
      }
    },
  },
  data () {
    return {
      updating: false,
      minedToken: 0,
      contract: null,
      stakedERC20: {},
      showAttention: false,
      uploading: false,
      icon: null,
      vert: 1e18,
      confirmInfo: ''
    }
  },
  props: {
    pool: {
      type: Object
    }
  },
  methods: {
    receiveAttention () {
      if (this.confirmInfo !== this.pool.name) {
        this.$bvToast.toast(this.$t('error.wrongConfirmInfo'), {
          title: this.$t('error.error'),
          variant: "danger"
        })
        return;
      }
      this.closePool()
    },

    async closePool () {
      try {
        this.updating = true
        if (this.pool.ratio === 10000 && this.communityData.pools.length === 1) {
            // remove only one pool
            const res = await closePool({poolAddress: this.pool.id, activedPools: [], ratios: []});
            this.communityData.pools[0].status = 'CLOSED';
            return;
        }
        if (this.pool.ratio !== 0) {
          this.$bvToast.toast(this.$t('tip.stopPoolTips'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return
        }
        const res = await closePool(this.pool.pid)
        this.$bvToast.toast(this.$t('tip.stopPoolOk'), {
          title: this.$t('tip.tips'),
          variant: 'success'
        })
        await sleep(2)
        this.showAttention = false
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.updating = false
      }
    }
  },

  async mounted () {
    this.stakedERC20 = await getERC20Info(this.pool.asset)
    switch (this.pool.poolFactory.toLowerCase()){
      case getPoolFactory('bsc').toLowerCase():
        this.icon = this.stakedERC20.icon
        this.vert = (10 ** this.stakedERC20.decimal)
        break;
      case getPoolFactory('steem').toLowerCase():
        const chainId = this.pool.chainId
        this.icon = ASSET_LOGO_URL[chainId === 1 ? 'steem' : 'hive']
        this.vert = this.pool.chainId === 1 ? 1e6 / this.steemVests : 1e6 / this.hiveVests
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
.apy-input {
  width: 50%;
  border: none;
  background: #F6F7F9;
  border-radius: .8rem;
  text-align: center;
  font-size: .8rem;
  height: 2.4rem;
  &::-webkit-input-placeholder {
    color: #BDBFC2;
  }
.close-icon {
  position: absolute;
  right: -1.4rem;
  top: -1.4rem;
  @include icon(1.4rem, 1.4rem);
  background-image: url("~@/static/images/circle-close.png");
}

}
</style>
