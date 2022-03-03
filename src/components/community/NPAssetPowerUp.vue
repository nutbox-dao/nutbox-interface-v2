<template>
  <div class="np-asset-up-modal position-relative">
    <i class="modal-back-icon modal-back-icon-no-bg" @click="$emit('back')"></i>
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="modal-title">Power up 1 Nut to {{npData.ratio}} NP</div>
    <div class="mt-4">
      <div class="c-input-group c-input-group-bg-dark c-input-group-border flex-column align-items-start px-3 py-2">
        <div class="mt-2 mb-3 font14 line-height14">Balance:18,994,940,0000</div>
        <div class="c-input-group d-flex w-100 p-1">
          <input class="flex-1 font24 line-height24"
                 style="flex: 1"
                 type="number"
                 v-model="value1"
                 placeholder="0"/>
          <div class="c-append">
            <div class="symbol-type px-2" style="height: 1.6rem">Nut</div>
          </div>
        </div>
      </div>
      <div class="transfer-icon text-center my-3">
        <img src="~@/static/images/transfer-icon-primary.svg" alt="">
      </div>
      <div class="c-input-group c-input-group-bg-dark c-input-group-border flex-column align-items-start px-3 py-2">
        <div class="mt-2 mb-3 font14 line-height14">Balance:18,994,940,0000</div>
        <div class="c-input-group d-flex w-100">
          <input class="flex-1 font24 line-height24"
                 style="flex: 1"
                 type="number"
                 v-model="value2"
                 placeholder="0"/>
          <div class="c-append">
            <div class="symbol-type px-2" style="height: 1.6rem">NP</div>
          </div>
        </div>
      </div>
      <button class="primary-btn my-4">Confilm</button>
      <div class="tip my-4">
        When you want to convert back your NP to Nut，you should do the power down operation，which will take
        <strong class="text-primary-1">{{npData.ratio}}weeks</strong>
        to get all your Nut back gradually.
      </div>
      <div class="text-right">
        <a class="text-primary-1 link" href="https://pancakeswap.finance/swap" target="_blank">
          Not enough Nut？Buy Nut at here.
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NPAssetPowerUp',
  props: {
    npData: {
      type: Object
    }
  },
  data () {
    return {
      value1: 0,
      value2: 0
    }
  }
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
