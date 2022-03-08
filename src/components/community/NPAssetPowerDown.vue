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
          <button class="primary-btn item-btn" @click="selectChannel(item)">Power down</button>
        </div>
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border d-flex w-100 py-2">
        <input class="flex-1 font24 line-height24 px-3"
               style="flex: 1"
               type="number"
               v-model="value1"
               placeholder="0"/>
        <div class="c-append">
          <div class="symbol-type px-2" style="height: 1.6rem">NP</div>
        </div>
      </div>
      <div class="transfer-icon text-center my-3">
        <img src="~@/static/images/transfer-icon-primary.svg" alt="">
        <div class="font14 line-height14 mt-1 text-grey-7">8 weeks | 8NP to 1 NUT</div>
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border d-flex w-100 py-2">
        <input class="flex-1 font24 line-height24 px-3"
               style="flex: 1"
               type="number"
               v-model="value2"
               placeholder="0"/>
        <div class="c-append">
          <div class="symbol-type px-2" style="height: 1.6rem">NUT</div>
        </div>
      </div>

      <button class="primary-btn my-4">Confilm</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

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
    }
  },
  data () {
    return {
      value1: 0,
      value2: 0
    }
  },
  methods: {
    selectChannel(item) {
      console.log('item', item);
      
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
