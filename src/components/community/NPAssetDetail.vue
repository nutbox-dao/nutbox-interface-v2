<template>
  <div class="np-asset-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="d-flex justify-content-between align-items-center top-box">
      <div class="value-box">
        <div class="font20 line-height24">{{ $t('np.totalNp') }}</div>
        <div class="font32 line-height36 d-flex align-items-center">
          <span>{{ totalNp | amountForm }} NP</span>
          <i class="help-icon ml-2" id="total-np-tip"></i>
          <b-popover custom-class="sub-popover-outline" target="total-np-tip" triggers="hover" placement="right">
            <div class="font12 line-height12" style="width: 130px">
              {{ $t('np.totalNpTip') }}
            </div>
          </b-popover>
        </div>
      </div>
      <div class="d-flex justify-content-center np-btn-group">
        <button class="primary-btn mr-2" @click="$emit('powerUp')">Power up</button>
        <button class="primary-btn" :disabled="freeNp==0" @click="$emit('powerDown')">{{ $t('np.powerDown') }}</button>
      </div>
    </div>
    <div class="row pt-4 bottom-box">
      <div class="col-lg-5">
        <div class="d-flex align-items-center item-card-title">
          <span class="font20 line-height24">{{ $t('commen.summary') }}</span>
          <i class="help-icon ml-2" id="available-np-help"></i>
          <b-popover custom-class="sub-popover-outline" target="available-np-help" triggers="hover" placement="top">
            <div class="font12 line-height12" style="width: 130px">
              <p>
                {{ $t('np.npTip3') }}
              </p>
              <p>
                {{ $t('np.npTip4') }}
              </p>
            </div>
          </b-popover>
        </div>
        <div class="c-card">
          <div class="c-card-header c-card-header-available d-flex">
            <div class="font16 line-height16 header-left">
              <span>{{ $t('np.nutStaked') }}</span>
              <span>{{ totalLockedNut | amountForm }} NUT</span>
            </div>
            <div class="font12 line-height12 text-grey-7 d-flex header-right">
              <span>{{ $t('np.npAvailable') }} {{ freeNp | amountForm }}</span>
              <span>{{ $t('np.npVoted') }} {{ lockedNp | amountForm }}</span>
            </div>
          </div>
          <div class="c-card-content">
            <div class="empty-bg p-0" v-if="totalLockedNut == 0">
              <img src="~@/static/images/empty-data.png" alt="" />
              <p> {{ $t('tip.noPowerupNut') }} </p>
            </div>
            <div v-else>
              <div v-for="(amount, idx) of userLockedNut" :key="'lockedNut' + idx">
                <div v-if="amount > 0"  class="available-items d-flex justify-content-between align-items-center">
                  <div>
                    <div class="font14 line-height14">{{ (amount * releasePeriod[idx]) | amountForm}} NP</div>
                    <div class="font12 line-height12 text-grey-7">{{ $t('np.unlockPeriod') }} {{ releasePeriod[idx] }} {{ $t('commen.weeks') }}</div>
                  </div>
                  <button v-if="idx<6" class="primary-btn-outline font12" @click="$emit('upgrade', { nut: amount, period: releasePeriod[idx] })">{{ $t('operation.upgrade') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="col-lg-4">-->
<!--        <div class="d-flex align-items-center item-card-title">-->
<!--          <span class="font20 line-height24">Voted NP</span>-->
<!--          <i class="help-icon ml-2" id="voted-np-tip"></i>-->
<!--          <b-popover custom-class="sub-popover-outline" target="voted-np-tip" triggers="hover" placement="top">-->
<!--            <div class="font12 line-height12" style="width: 130px">-->
<!--              Voted NP: NP you voted into pools of entire Nutbox.-->
<!--            </div>-->
<!--          </b-popover>-->
<!--        </div>-->
<!--        <div class="c-card">-->
<!--          <div class="c-card-header font16 line-height16">Total voted:3300 NP</div>-->
<!--          <div class="c-card-content">-->
<!--            <div class="voted-item" v-for="i of 3" :key="i">-->
<!--              <div class="d-flex align-items-center mb-1">-->
<!--                <img class="info-icon" src="https://cdn.wherein.mobi/nutbox/v2/1645831114472" alt="">-->
<!--                <span class="font12 line-height12 text-grey-7 ml-1">Peanut</span>-->
<!--              </div>-->
<!--              <div class="font14 line-height14 d-flex justify-content-between align-items-center">-->
<!--                <span>This is Pools name</span>-->
<!--                <span>300NP</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="col-lg-7">
        <div class="d-flex justify-content-between align-items-center item-card-title">
          <div class="d-flex align-items-center">
            <span class="font20 line-height24">{{ $t('np.unlockingNp') }}</span>
            <i class="help-icon ml-2" id="unlocking-np-tip"></i>
            <b-popover custom-class="sub-popover-outline" target="unlocking-np-tip" triggers="hover" placement="top">
              <div class="font12 line-height12" style="width: 130px">
                {{ $t('np.npTip5') }}
              </div>
            </b-popover>
          </div>
          <button class="primary-btn-outline claim-btn font12 d-flex align-items-center" @click="claim" :disabled="claiming">
            {{ $t('np.claimNp') }}
          </button>
        </div>
        <div class="c-card">
          <div class="c-card-header">
            <div class="font16 line-height16">{{totalUnlockingNp | amountForm}} NP to {{totalUnlockingNut | amountForm}} NUT</div>
            <div class="font12 line-height12 text-grey-7 mt-1">{{ $t('np.claimAvailable') }}{{claimableNut | amountForm}} NUT</div>
          </div>
          <div class="c-card-content">
            <div class="c-loading c-loading-bg c-loading-absolute" v-if="loadingRedeemInfo">
            </div>
            <template v-else>
              <div class="empty-bg p-0" v-if="redeemList.length == 0">
                <img src="~@/static/images/empty-data.png" alt="" />
                <p> {{ $t('tip.npRedeemProcess') }} </p>
              </div>
              <div v-else class="unlock-items" v-for="(unlockedItem, idx) of redeemList" :key="idx">
                <div class="font12 line-height16">{{ $t('np.unlockInWeeks', {period: unlockedItem.period}) }}<br>
                  {{ $t('np.covertTip', {npAmount: formatAmount(unlockedItem.npAmount), nutAmount: formatAmount(unlockedItem.nutAmount)}) }}
                </div>
                <b-popover custom-class="sub-popover-outline" :target="'progress-tip' + idx"
                          triggers="hover" placement="top">
                  <div class="font12">
                    {{ $t('np.claimedNut') }} {{unlockedItem.claimed | amountForm}}
                  </div>
                </b-popover>
                <b-progress :max="100">
                  <b-progress-bar class="green-progress-bar"
                                  :id="'progress-tip' + idx"
                                  :value="unlockedItem.ratio"></b-progress-bar>
                </b-progress>
                <div class="d-flex justify-content-between align-items-center font12 text-grey-7">
                  <span>{{ $t('np.claimAvailable') }} {{unlockedItem.claimble | amountForm}} Nut</span>
                  <span>{{ unlockedItem.timeLeft }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserRedeemRequestsOfPeriod, redeem } from '@/utils/nutbox/nutpower'
import { formatAmount } from '@/utils/helper'

export default {
  name: 'NPAssetDetail',
  data() {
    return {
      releasePeriod: [1,2,4,8,16,32,64],
      totalUnlockingNut:0,
      totalUnlockingNp:0,
      claimableNut:0,
      redeemList: [],
      claiming: false
    }
  },
  computed: {
    ...mapState('np', ['balance', 'userLockedNut', 'userRedeemInfo', 'loadingRedeemInfo']),
    // user free np
    freeNp() {
      if (this.balance && this.balance.freeNp){
        return this.balance.freeNp
      }
      return 0
    },
    // user locked np
    lockedNp() {
      if (this.balance && this.balance.lockedNp) {
        return this.balance.lockedNp
      }
      return 0
    },
    // user total np
    totalNp() {
        return this.freeNp + this.lockedNp
    },
    // user total locked nut
    totalLockedNut() {
      const t = this.userLockedNut.reduce((s, n) => s + n, 0)
      return t;
    },
  },
  methods: {
    calculateLeftTime(sec) {
      if (sec > 86400) {
        return parseInt(sec / 86400) + this.$t('np.daysLeft')
      }
      if (sec > 3600) {
        return parseInt(sec / 3600) + this.$t('np.hoursLeft')
      }
      if (sec > 60) {
        return parseInt(sec / 60) + this.$t('np.minutesLeft')
      } if (sec > 0) {
        return sec + this.$t('np.secondsLeft')
      }
      return '0' + this.$t('np.secondsLeft')
    },
    formatAmount(a) {
      return formatAmount(a)
    },
    updateRedeemData() {
      // update datas
      let totalUnlockingNp = 0
      let totalUnlockingNut = 0
      let claimableNut = 0
      let timestamp = parseInt(new Date().getTime() / 1e3)
      let redeemList = []
      for (let i = 0; i < this.userRedeemInfo.length; i++) {
        for (let j = 0; j < this.userRedeemInfo[i].length; j++) {
          const d = this.userRedeemInfo[i][j]
          const startTime = d.startTime.toString() / 1
          const endTime = d.endTime.toString() / 1
          const nutAmount = d.nutAmount.toString() / 1e18
          const period = this.releasePeriod[i]
          const npAmount = nutAmount * period
          let ratio = (timestamp - startTime) / (endTime - startTime)
          ratio = ratio > 1 ? 1 : ratio
          const claimed = d.claimed.toString() / 1e18
          const claimble = nutAmount * ratio - claimed
          const leftSecond = endTime - timestamp
          const timeLeft = this.calculateLeftTime(leftSecond)
          totalUnlockingNut += nutAmount
          totalUnlockingNp += npAmount
          claimableNut += claimble
          redeemList.push({
            nutAmount,
            npAmount,
            period,
            claimed,
            claimble,
            ratio: ratio * 100,
            timeLeft
          })
        }
      }
      this.totalUnlockingNut = totalUnlockingNut
      this.totalUnlockingNp = totalUnlockingNp;
      this.claimableNut = claimableNut
      this.redeemList = redeemList
    },
    async claim() {
      try {
        this.claiming = true
        await redeem()
        await getUserRedeemRequestsOfPeriod()
        this.$bvToast.toast(this.$t('tip.tryWithdrawOk'), {
          title: this.$t('success.success'),
          variant: 'success'
        })
      } catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        });
      } finally {
        this.claiming = false
      }
    }
  },
  mounted () {
    getUserRedeemRequestsOfPeriod().then(this.updateRedeemData)
    const interval = setInterval(this.updateRedeemData, 2000);
    this.$once('hook:beforeDestroy', () => {
      clearInterval(interval)
    })
  },
}
</script>

<style scoped lang="scss">
.np-asset-modal {
  min-height: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: url("~@/static/images/np-asset-bg.png");
  background-repeat: no-repeat;
  background-position: 20% top;
  padding: 12px 24px 24px;
}
.modal-close-icon-right {
  top: 12px;
  right: 24px;
}
.top-box {
  margin-top: 4rem;
  padding: 0 1.4rem;
}
.bottom-box {
  flex: 1;
  overflow: auto;
}
.np-btn-group button {
  min-width: 6rem;
  font-weight: normal;
  font-size: 14px;
  height: 36px;
}
.primary-btn-outline {
  border-radius: 8px;
}
.claim-btn {
  height: 28px;
}
.item-card-title {
  height: 36px;
  padding: 0 1.4rem;
}
.c-card {
  @include card(0);
  height: 340px;
  min-height: 340px;
  max-height: 340px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  .c-card-header {
    border-bottom: 1px solid rgba(white, 0.05);
    height: 70px;
    padding-top: 1.5rem;
    padding-left: 1.4rem;
    padding-right: 1.4rem;
    &-available {
      justify-content: space-between;
    }
  }
  .header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    :first-child {
      margin-bottom: 4px;
    }
  }
  .c-card-content {
    flex: 1;
    padding: 1rem 1.4rem;
    overflow: auto;
    position: relative;
  }
  .empty-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .available-items, .voted-item {
    padding: 10px 0;
  }
  .unlock-items {
    padding: .6rem;
    background-color: #1F1F1F;
    border-radius: .6rem;
    margin: 0 -.7rem 8px;
  }
  .info-icon {
    width: 14px;
    height: 14px;
    border-radius: 14px;
    background-color: var(--card-bg-primary);
    border: 1px solid var(--text-74);
  }
}
.progress {
  height: 10px;
  border-radius: 10px;
  background-color: #1D1E1F;
  margin-top: 8px;
  margin-bottom: 4px;
}
.green-progress-bar {
  border-radius: 10px;
  background-color: #50BF00;
}
@media (max-width: 1200px) {
  .c-card {
    .c-card-header-available {
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 1rem;
    }
    .header-left {
      display: flex;
      flex-direction: column;
    }
  }
}
@media (max-width: 991px) {
  .c-card {
    margin-bottom: 15px;
  }
}
@media (max-width: 500px) {
  .top-box {
    flex-direction: column;
  }
  .value-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .np-btn-group {
    width: 100%;
    justify-content: space-between;
    margin-top: .8rem;
  }
}
@media (max-width: 375px) {
  .c-card .c-card-header {
    height: fit-content;
  }
  .c-card .c-card-header-available {
    flex-direction: column;
    align-items: flex-start;
  }
  .c-card .header-left {
    flex-direction: row;
  }
  .c-card .header-right {
    flex-direction: column;
    align-items: flex-start;
    line-height: 16px;
    margin-top: 4px;
  }
}
</style>
