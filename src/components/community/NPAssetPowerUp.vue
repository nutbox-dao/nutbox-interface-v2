<template>
  <div class="np-asset-up-modal position-relative">
    <i class="modal-back-icon modal-back-icon-no-bg" @click="$emit('back')"></i>
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="modal-title">
      <span style="width: 80%" v-if="isUpgrade">Upgrade NP unlock period from {{ srcPeriod }} week to {{ distPeriod }} week.</span>
      <span v-else>Power up every 1 Nut to {{ distPeriod }} NP</span>
    </div>
    <div class="mt-4">
      <div class="mt-2 mb-3 font14 line-height14" style="margin-left: 1rem">Balance: {{ (isUpgrade ? srcBalance : nutBalance) | amountForm }}</div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border flex-column align-items-start px-3 py-2">
        <div class="c-input-group d-flex w-100 p-1">
          <input class="flex-1 font24 line-height24"
                 style="flex: 1"
                 type="number"
                 v-model="value1"
                 placeholder="0"/>
          <div class="c-append">
            <div class="symbol-type px-2" style="height: 1.6rem">{{ isUpgrade ? "NP" : "NUT"}}</div>
          </div>
        </div>
      </div>
      <div class="transfer-icon text-center my-3">
        <img src="~@/static/images/transfer-icon-primary.svg" alt="">
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border flex-column align-items-start px-3 py-2">
        <!-- <div class="mt-2 mb-3 font14 line-height14">Balance: {{ distBalance | amountForm }}</div> -->
        <div class="c-input-group d-flex w-100">
          <input class="flex-1 font24 line-height24"
                 style="flex: 1"
                 type="number"
                 v-model="value2"
                 disabled
                 placeholder="0"/>
          <div class="c-append">
            <div class="symbol-type px-2" style="height: 1.6rem">NP</div>
          </div>
        </div>
      </div>
      <button class="primary-btn my-4"
         v-if="!isUpgrade && (loadingApproveToNutPower || !approveToNutPower)"
         :disabled="isApproving || loadingApproveToNutPower"
         @click="approveNutPower">
        <b-spinner small type="grow" v-show="isApproving || loadingApproveToNutPower"></b-spinner>
        {{ $t('operation.approve') }}
      </button>
      <button v-else class="primary-btn my-4" :disabled="executing" @click="isUpgrade ? upgrade() : powerUp()">
        <b-spinner small type="grow" v-show="executing"></b-spinner>
        {{ $t('operation.confirm') }}
      </button>
      <div class="tip my-4">
        When you want to convert back your NP to NUT, you should do the power down operate, which will take
        <strong class="text-primary-1">{{npData.distPeriod}} weeks</strong>
        to get all your NUT back gradually.
      </div>
      <!-- <div class="text-right">
        <a class="text-primary-1 link" href="https://pancakeswap.finance/swap" target="_blank">
          Not enough Nut？Buy Nut at here.
        </a>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { handleApiErrCode } from '../../utils/helper'
import { powerUp, upgrade } from '@/utils/nutbox/nutpower'
import { NutAddress, PeriodToIdx } from '@/config'
import { contractAddress } from '@/utils/web3/contract'
import { approveUseERC20 } from '@/utils/web3/community'

export default {
  name: 'NPAssetPowerUp',
  props: {
    npData: {
      type: Object
    }
  },
  computed: {
    ...mapState('np', ['userLockedNut', 'balance']),
    ...mapState('user', ['nutBalance', 'loadingApproveToNutPower', 'approveToNutPower']),
    isUpgrade() {
      return this.npData.isUpgrade 
    },
    srcPeriod() {
      return this.npData.srcPeriod
    },
    distPeriod() {
      return this.npData.distPeriod
    },
    srcBalance() {
      return this.userLockedNut[PeriodToIdx[this.srcPeriod]] * this.srcPeriod
    },
    distBalance() {
      if(this.isUpgrade) {
       return  this.userLockedNut[PeriodToIdx[this.distPeriod]] * this.distPeriod
      }else{
        return this.balance.freeNp + this.balance.lockedNp
      }
    },
    convertRatio() {
      return this.npData.distPeriod / this.npData.srcPeriod
    },
    value2() {
      return this.value1 * this.convertRatio
    }
  },
  data () {
    return {
      value1: '',
      executing: false,
      isApproving: false
    }
  },
  methods: {
    async approveNutPower() {
      try {
        this.isApproving = true
        await approveUseERC20(NutAddress, contractAddress['NutPower']);
        this.bvToast.toast(this.$t('tip.success'), {
          title: this.$t('tip.approveSuccess'),
          variant: 'success'
        })
        // update the approvement result immediately
        this.$store.commit('user/saveApproveToNutPower', true);
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$t(tip, param)
        })
      }finally{
        this.isApproving = false
      }
    },
    async powerUp() {
      const amount = parseFloat(this.value1)
      if (amount > this.nutBalance) {
        this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }
      try {
        this.executing = true
        await powerUp(amount, PeriodToIdx[this.distPeriod])
        // update user locked Nut immediately
        this.userLockedNut[PeriodToIdx[this.distPeriod]] += amount
        this.$emit('finish');
      }catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally {
        this.executing = false
      }
    },
    async upgrade() {
      const amount = parseFloat(this.value1)
      if (amount > this.srcBalance) {
        this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }
      try {
        this.executing = true
        await upgrade(amount, PeriodToIdx[this.srcPeriod], PeriodToIdx[this.distPeriod])
        
        this.$emit('finish');
      }catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally {
        this.executing = false
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.np-asset-up-modal {
  min-height: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 12px 24px 24px;
}
.modal-back-icon {
  top: 12px;
  left: 24px;
}
.modal-close-icon-right {
  top: 12px;
  right: 24px;
}
.symbol-type {
  background: var(--sub-primary);
  font-size: 12px;
  border-radius: 28px;
  width: 56px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--card-bg-primary);
}
.link:hover {
  color: var(--sub-primary);
}
</style>
