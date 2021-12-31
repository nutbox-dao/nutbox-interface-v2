<template>
  <div class="pool-type-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-type-modal-content d-flex flex-column">
      <div class="modal-title mt-4">Choose a pool type</div>
      <div class="col-lg-10 mx-auto flex-fill d-flex my-4 align-items-center h-100">
        <div class="type-box" @click="$emit('onType', 'bsc')">BSC <br> Staking</div>
        <div class="type-box" @click="$emit('onType', 'steem')">Steem <br> Staking</div>
        <div class="type-box" @click="$emit('onType', 'hive')">Hive <br> Staking</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StakingPoolTypeModal',
  data () {
    return {
      poolType: ''
    }
  }
}
</script>

<style scoped lang="scss">
.pool-type-modal-content {
  min-height: 50vh;
}
.type-box {
  border: 1px solid var(--text-74);
  background-color: var(--nav-tab-bg-active);
  flex: 1;
  margin: 0 .5rem;
  border-radius: .8rem;
  text-align: center;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
}
</style>
