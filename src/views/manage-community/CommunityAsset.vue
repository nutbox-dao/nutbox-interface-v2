<template>
  <div class="scroll-content">
    <div class="container">
      <div class="c-card">
        <div class="row">
          <div class="col-md-6 d-flex flex-column justify-content-between">
            <div class="font20 font-bold">{{ $t('community.communityAsset') }}</div>
            <div class="d-flex align-items-center">
              <img v-if="cToken.icon" class="token-icon" :src="cToken.icon" alt="">
              <empty-img v-else class="rounded-circle mx-0"></empty-img>
              <div class="info d-flex flex-column align-items-start ml-2">
                <div class="font32">{{ cToken.symbol }}</div>
                <div class="flex-start-center">
                  <span>{{ cToken.name }}</span>
                  <i class="copy-icon ml-2" @click="copyAddress"></i>
                </div>
                <div class="font24">${{ cToken.price | amountForm }}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 c-mt-1">
            <div class="token-info-card">
              <div class="row-info">
                <span>{{ $t('asset.totalSupply') }}：</span>
                <span>{{ (cToken && cToken.totalSupply && cToken.totalSupply.toString() / (10 ** cToken.decimal))  | amountForm }} {{ cToken.symbol }}</span>
              </div>
              <div class="row-info">
                <span>{{ $t('asset.cap') }}：</span>
                <span>${{ (cToken.price *  (cToken && cToken.totalSupply && cToken.totalSupply.toString() / (10 ** cToken.decimal))) | amountForm}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="c-card mt-3">
        <div class="font20 font-bold">Token Release Strategy</div>
        <Progress :progress-data="progressData"></Progress>
      </div>
      <div class="c-card mt-3">
        <div class="font20 font-bold">Other Assets Info</div>
        <div class="custom-form mt-5">
          <!-- community balance -->
          <b-form-group v-if="!isMintable" label-cols-md="2" content-cols-md="7" :label="$t('community.communityBalance')">
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  v-model="communityBalanceValue"
                  placeholder="0.000"
                >
                </b-form-input>
                <span class="c-append">{{ cToken.symbol }}</span>
              </div>
              <button class="primary-btn ml-2" style="width: 5rem" @click="showChargeTip = true">
                {{$t("community.charge") }}
              </button>
              <button class="primary-btn ml-2" style="width: 5rem" @click="showWithdrawTip = true">
                {{$t("community.withdraw") }}
              </button>
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
                  :placeholder="devAddress || $t('community.devAddress')"
                >
                </b-form-input>
                <span></span>
              </div>
              <button class="primary-btn ml-2" style="width: 5rem" @click="showDevAddressTip = true">
                {{$t("commen.update") }}
              </button>
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
              <button class="primary-btn ml-2" style="width: 5rem" @click="showDevRatioTip = true">
                {{ this.$t("commen.update") }}
              </button>
            </div>
          </b-form-group>
        </div>

      </div>
    </div>
    <!-- charge balance tip -->
    <b-modal
      v-model="showChargeTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.communityCharge") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="label flex-between-start">
            <span>{{ $t("community.charge") }}</span>
            <span class="text-right"
            >{{ $t("wallet.balance") }}:
              {{ cTokenBalance | amountForm }}</span
            >
          </div>
          <div class="input-box flex-between-center">
            <input
              style="flex: 1"
              type="number"
              v-model="chargeValue"
              placeholder="0"
            />
            <div class="ml-2">
              <button
                class="primary-btn"
                @click="fillMax"
                :disabled="charging"
              >
                {{ $t("commen.max") }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showChargeTip = false"
            :disabled="charging || approving"
          >
            <b-spinner small type="grow" v-show="charging || approving" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="charge" :disabled="charging" v-if="ctokenApprovement">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("community.confirmCharge") }}
          </button>
          <button
            v-else
            class="primary-btn"
            @click="approve"
            :disabled="approving"
          >
            <b-spinner small type="grow" v-show="approving" />
            {{ $t('commen.approveContract') }}
          </button>
        </div>
      </div>
    </b-modal>
    <!-- withdraw balance tip -->

    <b-modal
      v-model="showWithdrawTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.withdraw") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="label flex-between-start">
            <span>{{ $t("community.withdraw") }}</span>
            <span class="text-right"
            >{{ $t("wallet.balance") }}:
              {{ communityBalanceValue | amountForm }}</span
            >
          </div>
          <div class="input-box flex-between-center">
            <input
              style="flex: 1"
              type="number"
              v-model="withdrawValue"
              placeholder="0"
            />
            <div class="ml-2">
              <button
                class="primary-btn"
                @click="fillMax"
                :disabled="withdrawing"
              >
                {{ $t("commen.max") }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showWithdrawTip = false"
            :disabled="withdrawing"
          >
            <b-spinner small type="grow" v-show="withdrawing" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="withdraw" :disabled="withdrawing">
            <b-spinner small type="grow" v-show="withdrawing" />
            {{ $t("community.withdraw") }}
          </button>
        </div>
      </div>
    </b-modal>
    <!-- dev address tip -->
    <b-modal
      v-model="showDevAddressTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.devAddress") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <input
              style="flex: 1"
              v-model="inputDevAddress"
              :placeholder="$t('community.inputDevAddress')"
            />
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showDevAddressTip = false"
            :disabled="updatingAddress"
          >
            <b-spinner small type="grow" v-show="updatingAddress" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="updateAddress" :disabled="updatingAddress">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
    <!-- dev ratio tip -->
    <b-modal
      v-model="showDevRatioTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.devRatio") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group">
              <input
                style="flex: 1"
                :step="0.01"
                :max="100"
                type="number"
                v-model="inputDevRatio"
                :placeholder="$t('community.inputDevRatio')"
              />
              <span class="c-append">%</span>
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showDevRatioTip = false"
            :disabled="updatingDevRatio"
          >
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="updateDevRatio" :disabled="updatingDevRatio">
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Progress from '@/components/community/Progress'
import AssetCard from '@/components/community/AssetCard'
import BN from 'bn.js'
import { approveCommunityBalance, chargeCommunityBalance, withdrawCommunityBalance, setDevAddress, setDevRatio, getMyCommunityInfo, getDistributionEras, monitorCommunity } from '@/utils/web3/community'
import { getRegitryAssets, getCToken } from '@/utils/web3/asset'
import { handleApiErrCode } from '@/utils/helper'
import { mapGetters, mapState } from 'vuex'
import { errCode } from '@/config'

export default {
  name: 'CommunityAsset',
  components: { Progress, AssetCard },
  data () {
    return {
      progressData: [

      ],
      showChargeTip: false,
      showWithdrawTip: false,
      showDevAddressTip: false,
      showDevRatioTip: false,
      chargeValue: 0,
      withdrawValue: 0,
      inputDevAddress: '',
      inputDevRatio: '',
      charging: false,
      withdrawing: false,
      approving: false,
      updatingAddress: false,
      updatingDevRatio: false,
      cToken: {},
      isMintable: true,
      assets: [],
      homeAssets: [],
      foreignAssets: []
    }
  },
  computed: {
    ...mapState('web3', ['communityBalance', 'userBalances', 'ctokenApprovement', 'devAddress', 'devRatio']),
    ...mapGetters('web3', ['createState']),
    ...mapState('steem', ['steemAccount']),
    communityBalanceValue () {
      if (this.communityBalance) {
        return (this.communityBalance.toString() / (10 ** this.cToken.decimal)).toFixed(6)
      } else {
        return 0
      }
    },
    cTokenAddress () {
      return this.cToken.address
    },
    cTokenBalance () {
      if (!this.userBalances || !this.userBalances[this.cTokenAddress]) {
        return 0
      }
      return this.userBalances[this.cTokenAddress].toString() / (10 ** this.cToken.decimal)
    }
  },
  methods: {
    async approve () {
      try {
        this.approving = true
        const hash = await approveCommunityBalance(this.cTokenAddress)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.approving = false
      }
    },
    copyAddress () {
      const address = this.cToken.address
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: address
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
    fillMax () {
      this.chargeValue = this.cTokenBalance
    },
    async charge () {
      try {
        this.charging = true
        const chargeValue = Number(this.chargeValue)
        if (!chargeValue || chargeValue <= 0) {
          this.$bvToast.toast(this.$t('error.inputError'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        const decimal = new BN(10).pow(new BN(18))
        const amount = new BN(Number(this.chargeValue * 1e6)).mul(decimal).divn(1e6)
        const hash = await chargeCommunityBalance(amount)
        this.$bvToast.toast(this.$t('community.chargeSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showChargeTip = false
        }, 2000)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.charging = false
      }
    },
    async withdraw () {
      try {
        this.withdrawing = true
        const withdrawValue = Number(this.withdrawValue)
        console.log(232, withdrawValue)
        if (!withdrawValue || withdrawValue <= 0) {
          this.$bvToast.toast(this.$t('error.inputError'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        if (withdrawValue > this.communityBalanceValue) {
          this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        const decimal = new BN(10).pow(new BN(18))
        const amount = new BN(Number(this.withdrawValue * 1e6)).mul(decimal).divn(1e6)
        const hash = await withdrawCommunityBalance(amount)
        this.$bvToast.toast(this.$t('community.chargeSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showWithdrawTip = false
        }, 2000)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.withdrawing = false
      }
    },
    async updateAddress () {
      try {
        this.updatingAddress = true
        await setDevAddress(this.inputDevAddress)
        this.$bvToast.toast(this.$t(), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showDevAddressTip = false
        }, 1000)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.updatingAddress = false
      }
    },
    async updateDevRatio () {
      try {
        this.updatingDevRatio = true
        const r = parseInt(parseFloat(this.inputDevRatio) * 100)
        await setDevRatio(r)
        this.$bvToast.toast(this.$t(), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showDevRatioTip = false
        }, 1000)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.updatingDevRatio = false
      }
    }
  },
  async mounted () {
    let communityInfo
    try {
      communityInfo = await getMyCommunityInfo()
      getDistributionEras().then(dist => {
        this.progressData = dist
      }).catch(e => handleApiErrCode(e, (tip, param) => this.$bvToast.toast(tip, param)))
      monitorCommunity()
    } catch (e) {
      if (e === errCode.NO_STAKING_FACTORY) {
        this.noCommunity = true
      } else {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }
    }
    this.cToken = await getCToken(communityInfo.id)
    this.isMintable = this.cToken.isMintable

    this.assets = await getRegitryAssets()
    this.homeAssets = this.assets.filter(a => a.type === 'HomeChainAssetRegistry')
    this.foreignAssets = this.assets.filter(a => a.type !== 'HomeChainAssetRegistry')
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";

.c-card {
  @include card(1.2rem, var(--card-bg-primary), hidden, fit-content);
  box-sizing: border-box;
}
.token-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 5rem;
  margin-right: .9rem;
}
.copy-icon {
  @include icon(.6rem, .6rem);
  background-image: url("~@/static/images/copy.svg");
  cursor: pointer
}
.token-info-card {
  @include card(1.2rem 3rem, rgba(255, 219, 38, 0.05));
  border: 1px solid var(--primary-custom);
  display: flex;
  flex-direction: column;
  gap: .7rem;
  .row-info {
    @include c-flex-between-center;
  }
}
@media (max-width: 767px) {
  .c-mt-1 {
    margin-top: 1rem;
  }
}
</style>
