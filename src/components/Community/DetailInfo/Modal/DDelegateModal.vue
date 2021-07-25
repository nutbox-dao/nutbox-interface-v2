<template>
  <div class="tip-modal delegate-modal">
    <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="$emit('close')"/>
    <div class="c-modal-header">
      <div class="text-left font20 font-bold" >
        增加代理
      </div>
    </div>
    <div class="modal-h-line"></div>
    <div class="input-group-box mb-4">
      <div class="label flex-between-start">
        <span>增加代理</span>
        <span class="text-right">{{ $t('wallet.balance') }}: 0.00</span>
      </div>
      <div class="input-box flex-between-center">
        <input style="flex: 1"
               type="number"
               v-model="inputAmount"
               :placeholder="$t('cl.inputAmount')"
        />
        <div>
          <button class="primary-btn input-btn">最大</button>
        </div>
      </div>
    </div>
    <div class="btn-group btn-group-2">
      <button class="primary-btn outline-btn" @click="$emit('close')">取消</button>
      <button class="primary-btn">确认</button>
    </div>
    <div class="text-center mb-2 mt-4">获取SP</div>
    <div class="text-center text-grey-light font14">代理手续费：1STEEM</div>
  </div>

</template>

<script>

export default {
  data () {
    return {
      inputAmount: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group-box {
  background: rgba(246, 247, 249, 1);
  border-radius: .8rem;
  .label {
    padding: 1.2rem .8rem .6rem;
    span {
      white-space: nowrap;
    }
  }
  .balance {
    padding: .8rem .8rem 0;
    color: #717376;
    font-size: .7rem;
  }
  .input-box {
    padding: 0 .8rem .8rem 0;
  }
  .input-btn {
    height: 1.6rem;
    padding: 0 .6rem;
    min-height: 1.6rem;
  }
}
.btn-group {
  gap: 1rem;
}
.primary-btn {
  border-radius: 2.4rem;
}

</style>
