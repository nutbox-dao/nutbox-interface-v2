<template>
  <div class="np-asset-up-modal position-relative">
    <i class="modal-back-icon modal-back-icon-no-bg" @click="$emit('back')"></i>
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="modal-title">Power down NP to NUT</div>
    <div class="mt-4">
      <div class="down-info-box mb-4">
        <div class="down-item-info d-flex justify-content-between" v-for="(item, i) of powerDownList" :key="i">
          <div class="info d-flex font14 line-height14 flex-1">
            <div class="d-flex align-items-center flex-1">
              <span>{{item.from}} NP</span>
              <i class="arrow-right-icon mx-2"></i>
              <span>{{item.to}} NUT</span>
            </div>
            <div class="info-sub flex-1">Unlocking period:{{item.unlockTime}} weeks</div>
          </div>
          <button class="primary-btn item-btn" @click="selectChannel(item, i)">Power down</button>
        </div>
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border d-flex w-100 py-2">
        <input class="flex-1 font24 line-height24 px-3"
               style="flex: 1"
               type="number"
               :disabled='selectRatio==0'
               v-model="value1"
               placeholder="0"/>
        <div class="c-append">
          <div class="symbol-type px-2" style="height: 1.6rem">NP</div>
        </div>
      </div>
      <div class="transfer-icon text-center my-3">
        <img src="~@/static/images/transfer-icon-primary.svg" alt="">
        <div class="font14 line-height14 mt-1 text-grey-7">{{ selectRatio }} weeks | every {{selectRatio}}NP to 1 NUT</div>
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border d-flex w-100 py-2">
        <input class="flex-1 font24 line-height24 px-3"
               style="flex: 1"
               type="number"
               disabled
               v-model="value2"
               placeholder="0"/>
        <div class="c-append">
          <div class="symbol-type px-2" style="height: 1.6rem">NUT</div>
        </div>
      </div>

      <button class="primary-btn my-4" :disabled="powerdowning" @click="powerDown">
        <b-spinner small type="grow" v-show="powerdowning"></b-spinner>
        Confilm
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { powerDown, getUserRedeemRequestsOfPeriod } from '@/utils/nutbox/nutpower'
import { PeriodToIdx } from '@/config'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: 'NPAssetPowerDown',
  props: {
    npData: {
      type: Object
    }
  },
  computed: {
    ...mapState('np', ['userLockedNut', 'balance']),
    // channels can be power down
    powerDownList() {
      let freeNp = this.balance.freeNp
      let list = []
      for (let i = 0; i < 7; i++) {
        const ratio = 2 ** i;
        const q = this.userLockedNut[i] * ratio
        if (q >= freeNp){
          list.push({from: freeNp, to: freeNp / ratio, unlockTime: ratio})
          break;
        }
        if (q === 0) {
          continue;
        }
        list.push({from: q, to: q / ratio, unlockTime: ratio})
        freeNp -= q;
      }
      return list;
    },
    value2() {
      return this.value1 / this.selectRatio
    }
  },
  data () {
    return {
      value1: '',
      selectRatio: 0,
      selectIdx: -1,
      powerdowning: false
    }
  },
  methods: {
    selectChannel(item, idx) {
      console.log('item', item);
      this.selectRatio = item.unlockTime
      this.selectIdx = idx
      this.value1 = ''
    },
    async powerDown(){
      const amount = parseFloat(this.value1)
      if (amount > this.powerDownList[this.selectIdx].from){
        this.$bvToast.toast(this.$t('tip.insufficientBalance'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }else {
        try {
          this.powerdowning = true
          const channel = PeriodToIdx[this.selectRatio]
          await powerDown(amount, channel)  
          this.$bvToast.toast(this.$t('tip.powerDownSuccess'), {
            title: this.$t('tip.success'),
            variant: 'success'
          })
          // update data immediately
          this.userLockedNut[channel] = this.userLockedNut[channel] - amount / this.selectRatio
          await getUserRedeemRequestsOfPeriod()
          this.$emit('back')
        } catch(e) {
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param)
          });
        } finally {
          this.powerdowning = false
        }
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.np-asset-up-modal {
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
.c-input-group input {
  width: 100%;
}
.arrow-right-icon {
  @include icon(16px, 16px);
  background-image: url("~@/static/images/arrow-right-primary-icon.svg");
}
.down-item-info {
  padding: 10px 0;
  .item-btn {
    width: 86px;
    height: 30px;
    font-size: 12px;
    font-weight: normal;
    margin-left: 2rem;
  }
  .info {
    align-items: center;
    justify-content: space-between;
  }
}
@media (max-width: 550px) {
  .down-item-info .info {
    flex-direction: column;
    align-items: flex-start;
  }
  .info-sub {
    margin-top: 8px;
  }
}
</style>
