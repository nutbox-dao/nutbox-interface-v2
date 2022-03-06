<template>
  <div class="np-asset-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="d-flex justify-content-between align-items-center top-box">
      <div class="value-box">
        <div class="font20 line-height24">Total NP</div>
        <div class="font32 line-height36 d-flex align-items-center">
          <span>{{ totalNp | amountForm }} NP</span>
          <i class="help-icon ml-2" id="total-np-tip"></i>
          <b-popover custom-class="sub-popover-outline" target="total-np-tip" triggers="hover" placement="right">
            <div class="font12 line-height12" style="width: 130px">
            <p>
              Total NP: ALL NP you power up.
            </p>
            <p style="margin-bottom:0">
              Available NP: NP you can power down to Nut any time.
            </p>
            </div>
          </b-popover>
        </div>
      </div>
      <div class="d-flex justify-content-center np-btn-group mr-1">
        <button class="primary-btn mr-2" @click="$emit('powerUp')">Power up</button>
        <button class="primary-btn" @click="$emit('powerDown')">Power down</button>
      </div>
    </div>
    <div class="row pt-4 bottom-box">
      <div class="col-lg-4">
        <div class="d-flex align-items-center item-card-title">
          <span class="font20 line-height24">Available NP</span>
          <i class="help-icon ml-2" id="available-np-help"></i>
          <b-popover custom-class="sub-popover-outline" target="available-np-help" triggers="hover" placement="top">
            <div class="font12 line-height12" style="width: 130px">
              Available NP: NP could be used to vote or unlocking.
            </div>
          </b-popover>
        </div>
        <div class="c-card">
          <div class="c-card-header font16 line-height16">Total available:{{ freeNp | amountForm }} NP</div>
          <div class="c-card-content">
            <div class="available-items d-flex justify-content-between align-items-center"
                 v-for="(amount, idx) of userLockedNut" :key="'lockedNut' + idx">
              <template v-if="amount >= 0">
                <div>
                  <div class="font14 line-height14">{{ (amount * releasePeriod[idx]) | amountForm}} NP</div>
                  <div class="font12 line-height12 text-grey-7">Unlock period:{{ releasePeriod[idx] }} week</div>
                </div>
                <button v-if="idx<6" class="primary-btn-outline font12" @click="$emit('upgrade', { nut: amount, period: releasePeriod[idx] })">Upgrade</button>
              </template>
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
      <div class="col-lg-8">
        <div class="d-flex justify-content-between align-items-center item-card-title">
          <div class="d-flex align-items-center">
            <span class="font20 line-height24">Unlocking NP</span>
            <i class="help-icon ml-2" id="unlocking-np-tip"></i>
            <b-popover custom-class="sub-popover-outline" target="unlocking-np-tip" triggers="hover" placement="top">
              <div class="font12 line-height12" style="width: 130px">
                Unlocking NP: NP you powered down，in the unlocking process.
              </div>
            </b-popover>
          </div>
          <button class="primary-btn-outline claim-btn font12">Claim Nut</button>
        </div>
        <div class="c-card">
          <div class="c-card-header">
            <div class="font16 line-height16">3300 NP to 200 Nut</div>
            <div class="font12 line-height12 text-grey-7 mt-1">Claim available：150 Nut</div>
          </div>
          <div class="c-card-content">
            <div class="unlock-items" v-for="unlockedItem of 2" :key="unlockedItem">
              <div class="font12 line-height16">Unlock in 32 weeks：<br>100 NP to 100 Nut</div>
              <b-popover custom-class="sub-popover-outline" :target="'progress-tip' + unlockedItem"
                         triggers="hover" placement="top">
                <div class="font12">
                  Unlocked NP: 50 <br> Claimed Nut: 0
                </div>
              </b-popover>
              <b-progress :max="100">
                <b-progress-bar class="green-progress-bar"
                                :id="'progress-tip' + unlockedItem"
                                :value="80"></b-progress-bar>
              </b-progress>
              <div class="d-flex justify-content-between align-items-center font12 text-grey-7">
                <span>Claim available: 50 Nut</span>
                <span>5 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NPAssetDetail',
  data() {
    return {
      releasePeriod: [1,2,4,8,16,32,64]
    }
  },
  computed: {
    ...mapState('np', ['balance', 'userLockedNut']),
    // user free np
    freeNp() {
      if (this.balance && this.balance.freeNp){
        return this.balance.freeNp.toString() / 1e18
      }
      return 0
    },
    // user locked np
    lockedNp() {
      if (this.balance && this.balance.lockedNp) {
        return this.balance.lockedNp.toString() / 1e18
      }
      return 0
    },
    // user total np
    totalNp() {
      if (this.freeNp && this.lockedNp) {
        return this.freeNp + this.lockedNp
      }
      return 0
    },
    // user total locked nut
    totalLockedNut() {
      return this.userLockedNut.reduce((s, n) => s + n, 0)
    },
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
.item-card-title {
  height: 36px;
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
    padding-left: 1rem;
  }
  .c-card-content {
    flex: 1;
    padding: 1rem 1.2rem;
    overflow: auto;
  }
  .available-items, .voted-item {
    padding: 10px 0;
  }
  .unlock-items {
    padding: 14px 0;
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
</style>
