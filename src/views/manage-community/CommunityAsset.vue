<template>
  <div class="scroll-content">
    <!-- token info -->
    <div class="c-card">
      <div class="font20 font24 font-bold mb-3">{{ $t('community.communityToken') }}</div>
      <div class="row">
        <div class="col-md-6 d-flex justify-content-between">
          <img class="token-icon" :src="cToken.icon || './default.png'" alt="">
          <div class="d-flex flex-1 justify-content-between align-items-center">
            <div class="info d-flex flex-column align-items-start ml-2">
              <div class="font20 line-height24">{{ cToken.symbol }}</div>
              <div class="d-flex align-items-center mt-2">
                <span class="font12 line-height12 text-grey-7">{{ cToken.name }}</span>
                <i class="copy-icon copy-icon-gray ml-2" @click="copyAddress"></i>
              </div>
            </div>
            <div class="font24 line-height24 font-bold mr-md-5">${{ cToken.price | amountForm }}</div>
          </div>
        </div>
        <div class="col-md-6 c-mt-1">
          <div class="token-info-card">
            <div class="row-info">
              <span class="font14 line-height14 text-grey-7 mb-2">{{ $t('asset.totalSupply') }}</span>
              <span class="font20 line-height20 font-bold">{{ (cToken && cToken.totalSupply && cToken.totalSupply.toString() / (10 ** cToken.decimal))  | amountForm }}</span>
            </div>
            <div class="row-info">
              <span class="font14 line-height14 text-grey-7 mb-2">{{ $t('asset.cap') }}</span>
              <span class="font20 line-height20 font-bold">{{ (cToken.price *  (cToken && cToken.totalSupply && cToken.totalSupply.toString() / (10 ** cToken.decimal))) | formatPrice}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- strategy -->
    <div class="c-card mt-3" style="padding-bottom:2.5rem">
      <div class="font20 font-bold">{{ $t('desc.disStrategy') }}</div>
      <Progress :progress-data="distributions"></Progress>
    </div>
    <!-- fund info -->
    <div class="c-card mt-3">
      <div class="font20 font-bold">{{ $t('community.daoFundInfo') }}</div>
      <div class="custom-form mt-5">
        <!-- community balance -->
        <b-form-group v-if="!isMintable" label-cols-md="2" content-cols-md="8"
                      label-class="font14 font-bold line-height14 d-flex align-items-center"
                      :label="$t('community.communityBalance')">
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg">
              <b-form-input
                :disabled="true"
                :placeholder="communityBalance.toString()"
              >
              </b-form-input>
              <span class="c-append">{{ cToken.symbol }}</span>
            </div>
            <button class="primary-btn ml-2" style="width: 5rem" @click="showChargeTip = true">
              {{$t("operation.charge") }}
            </button>
            <button class="primary-btn ml-2" style="width: 5rem" @click="showWithdrawTip = true">
              {{$t("operation.withdraw") }}
            </button>
          </div>
        </b-form-group>
        <!-- retained Reveue -->
        <b-form-group label-cols-md="2" content-cols-md="8"
                      label-class="font14 font-bold line-height14 d-flex align-items-center"
                      :label="$t('community.retainedRevenue')">
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg">
              <b-form-input
                :disabled="true"
                :placeholder="communityData ? (communityData.retainedRevenue.toString() / (10 ** cToken.decimal)).toString() : '0'"
              >
              </b-form-input>
              <span class="c-append">{{ cToken.symbol }}</span>
            </div>
            <button class="primary-btn ml-2" style="width: 5rem" :disabled="withdrawingRevenue || !communityData || (communityData.retainedRevenue.toString() / (10 ** cToken.decimal)) === 0" @click="withdrawRevenue">
              <b-spinner small type="grow" v-show="!communityData || withdrawingRevenue" />
              {{$t("operation.withdraw") }}
            </button>
          </div>
        </b-form-group>
        <!-- community dev address -->
        <b-form-group label-cols-md="2" content-cols-md="8"
                      label-class="font14 font-bold line-height14 d-flex align-items-center"
                      :label="$t('community.fundAddress')"
        >
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg" @click="copyFundAddress">
              <b-form-input
                :disabled="true"
                :placeholder="communityData && communityData.daoFund"
              >
              </b-form-input>
              <span></span>
            </div>
            <button class="primary-btn ml-2" style="width: 5rem" :disabled="!communityData" @click="showDevAddressTip = true">
              <b-spinner small type="grow" v-show="!communityData" />
              {{ this.$t("operation.update") }}
            </button>
          </div>
        </b-form-group>
        <!-- community dev ratio -->
        <b-form-group label-cols-md="2" content-cols-md="8"
                      label-class="font14 font-bold line-height14 d-flex align-items-center"
                      :label="$t('community.fundRatio')">
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg">
              <b-form-input
                :disabled="true"
                type="number"
                :placeholder="((communityData ? communityData.feeRatio : 0) / 100).toFixed(2).toString()"
              >
              </b-form-input>
              <span class="c-append">%</span>
            </div>
            <button class="primary-btn ml-2" style="width: 5rem" :disabled="!communityData" @click="showDevRatioTip = true">
              <b-spinner small type="grow" v-show="!communityData" />
              {{ this.$t("operation.update") }}
            </button>
          </div>
        </b-form-group>
      </div>
    </div>
    <!-- <div class="c-card mt-3 mb-5">
      <div class="font20 font-bold">{{ $t('community.daoTreasuryInfo') }}</div>
      <div class="custom-from" v-if="isLoadingTreasury">
        <div class="c-loading"></div>
      </div>
      <div class="custom-form mt-5" v-else-if="!isCreatedTreasury">
        <p>
          {{ $t('treasury.noCreatedTip') }}
        </p>
        <p>
          {{ $t('treasury.createNote') }}
        </p>
        <button class="primary-btn" style="width: 50%" @click="createTreasury" :disabled="isCreatingTreasury">
          <b-spinner small type="grow" v-show="isCreatingTreasury"></b-spinner>
          {{ $t('operation.create') }}
        </button>
      </div>
      <div class="custom-form mt-5" v-else>
        <b-form-group label-cols-md="2" content-cols-md="8"
                      label-class="font14 font-bold line-height14 d-flex align-items-center"
                      :label="$t('treasury.treasuryAddress')">
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg" @click="copyTreasury">
              <b-form-input
                :disabled="true"
                :placeholder="treasuryAddress"
                @click="copyTreasury"
              >
              </b-form-input>
            </div>
          </div>
        </b-form-group>
      </div>
    </div> -->
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
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("operation.charge") }}
        </div>
        <div class="mb-4">
          <div class="label mb-2 d-flex justify-content-between">
            <span>{{ $t("operation.charge") }} </span>&nbsp;
            <span class="text-right">{{ $t("wallet.balance") }}:{{ adminBalance | amountForm }}</span>
          </div>
          <div class="c-input-group c-input-group-bg">
            <input type="number" v-model="chargeValue" placeholder="0"/>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button class="dark-btn mx-3" @click="showChargeTip = false" :disabled="charging">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("operation.cancel") }}
          </button>
          <button class="primary-btn mx-3" @click="charge" :disabled="charging">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("operation.confirm") }}
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
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("operation.withdraw") }}
        </div>
        <div class="mb-4">
          <div class="label mb-2 d-flex justify-content-between">
            <span>{{ $t("operation.withdraw") }} </span>&nbsp;
            <span class="text-right">{{ $t("wallet.balance") }}:{{ communityBalance | amountForm }}</span>
          </div>
          <div class="c-input-group c-input-group-bg">
            <input type="number" v-model="withdrawValue" placeholder="0"/>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showWithdrawTip = false"
            :disabled="withdrawing"
          >
            <b-spinner small type="grow" v-show="withdrawing" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" @click="withdraw" :disabled="withdrawing">
            <b-spinner small type="grow" v-show="withdrawing" />
            {{ $t("operation.withdraw") }}
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
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("community.fundRatio") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group c-input-group-bg-dark c-input-group-border">
              <input
                :step="0.01"
                :max="100"
                type="number"
                v-model="inputDevRatio"
                :placeholder="$t('placeHolder.inputDevRatio')"
              />
              <span class="c-append">%</span>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showDevRatioTip = false"
            :disabled="updatingDevRatio"
          >
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" v-if="takeFee && (approving || loadingApproveCommunity || !approvedCommunity)" @click="approve" :disabled="approving || loadingApproveCommunity">
            <b-spinner small type="grow" v-show="approving || loadingApproveCommunity" />
            {{ $t("operation.approve") }}
          </button>
          <button class="primary-btn mx-3" v-else @click="updateDevRatio" :disabled="updatingDevRatio">
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t("operation.confirm") }}
          </button>
        </div>
        <div v-if="takeFee" class="font14 my-1" style="text-align:center">
          {{ `Operation fee: ${fee} NUT` }}
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
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("community.fundAddress") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group c-input-group-bg-dark c-input-group-border">
              <input
                type="text"
                v-model="inputDevAddress"
                :placeholder="$t('placeHolder.inputDevAddress')"
              />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showDevAddressTip = false"
            :disabled="updatingDevAddress"
          >
            <b-spinner small type="grow" v-show="updatingDevAddress" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" v-if="takeFee && (approving || loadingApproveCommunity || !approvedCommunity)" @click="approve" :disabled="approving || loadingApproveCommunity">
            <b-spinner small type="grow" v-show="approving || loadingApproveCommunity" />
            {{ $t("operation.approve") }}
          </button>
          <button v-else class="primary-btn mx-3" @click="updateDevAddress" :disabled="updatingDevAddress">
            <b-spinner small type="grow" v-show="updatingDevAddress" />
            {{ $t("operation.confirm") }}
          </button>
        </div>
        <div v-if="takeFee" class="font14 my-1" style="text-align:center">
          {{ `Operation fee: ${fee} NUT` }}
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Progress from '@/components/community/Progress'
import {
  chargeCommunityBalance,
  withdrawCommunityBalance,
  setDevRatio,
  setDevAddress,
  getMyCommunityInfo,
  getDistributionEras,
  getCommunityBalance,
  withdrawRevenue,
  approveUseERC20
   } from '@/utils/web3/community'
import { NutAddress } from '@/config'
import { getCToken, getERC20Balance } from '@/utils/web3/asset'
import { handleApiErrCode, sleep } from '@/utils/helper'
import { mapState } from 'vuex'
import { ethers } from 'ethers'
// import { createTreasury } from '@/utils/web3/treasury'

export default {
  name: 'CommunityAsset',
  components: { Progress },
  data () {
    return {
      showChargeTip: false,
      showWithdrawTip: false,
      showDevAddressTip: false,
      showDevRatioTip: false,
      chargeValue: null,
      withdrawValue: null,
      inputDevAddress: '',
      inputDevRatio: '',
      charging: false,
      withdrawingRevenue: false,
      withdrawing: false,
      approving: false,

      updatingDevAddress: false,
      updatingDevRatio: false,
      cToken: {},
      isMintable: true,
      communityBalance: 0,
      adminBalance: 0,

      // isCreatedTreasury: false,
      // isCreatingTreasury: false,
      // treasuryAddress: '',
      // isLoadingTreasury: true
    }
  },
  computed: {
    ...mapState('web3', ['account', 'fees']),
    ...mapState('community', ['communityData', 'distributions', 'loadingApproveCommunity', 'approvedCommunity']),
    cTokenAddress () {
      return this.cToken.address
    },
    cTokenBalance () {
      if (!this.userBalances || !this.userBalances[this.cTokenAddress]) {
        return 0
      }
      return this.userBalances[this.cTokenAddress].toString() / (10 ** this.cToken.decimal)
    }, 
    fee() {
      if (this.fees){
        return this.fees['COMMUNITY'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['COMMUNITY'] > 0
      }
      return false
    }
  },
  methods: {
    async approve () {
      try {
        this.approving = true
        const hash = await approveUseERC20(NutAddress, this.communityData.id)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.$store.commit('community/saveApprovedCommunity', true)
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
      this.copy(address)
    },
    copyTreasury () {
      const address = this.treasuryAddress
      this.copy(address)
    },
    copyFundAddress () {
      const address = this.communityData.daoFund
      this.copy(address)
    },
    copy(address) {
      if (ethers.utils.isAddress(address)) {
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
      }
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
        if (chargeValue >= this.adminBalance) {
           this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        const hash = await chargeCommunityBalance(chargeValue)
        this.$bvToast.toast(this.$t('tip.chargeSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.chargeValue = ''
        this.communityBalance = this.communityBalance + chargeValue
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
        if (!withdrawValue || withdrawValue <= 0) {
          this.$bvToast.toast(this.$t('error.inputError'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        if (withdrawValue > this.communityBalance) {
          this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return
        }
        const hash = await withdrawCommunityBalance(withdrawValue)
        this.$bvToast.toast(this.$t('tip.withdrawSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.withdrawValue = ''
        this.communityBalance = this.communityBalance - withdrawValue
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
    async withdrawRevenue() {
      try{
        this.withdrawingRevenue = true;
        await withdrawRevenue();
        if(this.isMintable) {
          this.communityData.retainedRevenue = ethers.constants.Zero
          this.$store.commit('community/saveCommunityData', this.communityData)
        }else{
          let retained = (this.communityData.retainedRevenue.toString() / (10 ** this.cToken.decimal))
          const temBalacne = this.communityBalance
          this.communityBalance = this.communityBalance > retained ?  this.communityBalance - retained : 0;
          retained = this.communityBalance > retained ? 0 : (retained - temBalacne)
          this.communityData.retainedRevenue = ethers.utils.parseUnits(retained.toString(), 18)
          this.$store.commit('community/saveCommunityData', this.communityData)
        }
        this.$bvToast.toast(this.$t('tip.success'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.withdrawingRevenue = false;
      }
    },
    async updateDevRatio () {
      try {
        this.updatingDevRatio = true
        const r = parseInt(parseFloat(this.inputDevRatio) * 100)
        await setDevRatio(r)
        this.communityData.feeRatio = r;
        this.$store.commit('community/saveCommunityData', this.communityData)
        this.$bvToast.toast(this.$t('tip.success'), {
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
    },
    async updateDevAddress() {
      try{
        this.updatingDevAddress = true
        if(!ethers.utils.isAddress(this.inputDevAddress)){
          this.$bvToast.toast('Please input right address', {
            title: this.$t('tip.tips'),
            variant:'info'
          })
          return;
        }
        await setDevAddress(this.inputDevAddress)
        this.communityData.daoFund = this.inputDevAddress
        this.$store.commit('community/saveCommunityData', this.communityData)
        this.$bvToast.toast(this.$t('tip.success'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showDevAddressTip = false
        }, 1000)
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.updatingDevAddress = false
      }
    },
    async createTreasury() {
      try{
        this.isCreatingTreasury = true
        const treasury = await createTreasury();
        this.isCreatedTreasury = true;
        this.treasuryAddress = treasury;
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isCreatingTreasury = false
      }
    }
  },
  async mounted () {
    let communityInfo
    try {
      communityInfo = await getMyCommunityInfo()
      getDistributionEras().catch(e => handleApiErrCode(e, (tip, param) => this.$bvToast.toast(tip, param)))
    } catch (e) {
    }
    while(true) {
      if (this.communityData) {
        break;
      }
      await sleep(0.3)
    }
    this.cToken = await getCToken(communityInfo.id)
    this.isMintable = this.cToken.isMintable
    // this.treasuryAddress = this.communityData.treasury
    // console.log(235, this.communityData)
    // this.isCreatedTreasury = this.treasuryAddress && Number(this.treasuryAddress) !== 0
    // this.isLoadingTreasury = false
    if (!this.isMintable) {
        // updating balances of admin and community
        const interval = setInterval(() => {
          // update admin's balance
          getERC20Balance(this.cToken.address).then(res => {
            this.adminBalance = res.toString() / (10 ** this.cToken.decimal)
          }).catch(res => {
            console.log(33, res);
          })
          // update dao fund balance
          getCommunityBalance({communityId: communityInfo.id, ctokenAddress: this.cToken.address}).then(res => {
            this.communityBalance = (res.toString() / (10 ** this.cToken.decimal)).toFixed(2)
          }).catch()
        }, 1000)
        this.$once('hook:beforeDestroy', () => {
          window.clearInterval(interval)
        })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";

.c-card {
  @include card(.9rem 1rem, var(--card-bg-primary), hidden, fit-content);
  box-sizing: border-box;
}
.token-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 5rem;
  margin-right: .9rem;
}
.token-info-card {
  height: 100%;
  display: flex;
  gap: .7rem;
  .row-info {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
@media (max-width: 767px) {
  .c-mt-1 {
    margin-top: 1rem;
  }
}
</style>
