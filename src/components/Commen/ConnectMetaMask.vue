<template>
  <div>
      <b-button
      class="connect"
      variant="primary"
      style="width:100%"
      @click="connect"
      :disabled="isConnecting"
    >
    <b-spinner small type="grow" v-show="isConnecting"></b-spinner>
      {{
        $t('commen.connectMetamask')
      }}
    </b-button>
  </div>
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