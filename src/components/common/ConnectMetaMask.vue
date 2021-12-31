<template>
  <button
    class="connect primary-btn w-auto"
    @click="connect"
    :disabled="isConnecting"
  >
    <b-spinner small type="grow" v-show="isConnecting"></b-spinner>
    {{
      $t('commen.connectMetamask')
    }}
  </button>
</template>

<script>
import { setupNetwork }  from '@/utils/web3/web3'
export default {
  name: "ConnectMetaMask",
  data() {
      return {
          isConnecting: false
      }
  },
  methods: {
      connect() {
          setupNetwork()
      }
  },
};
</script>

<style lang="scss" scoped>
</style>
