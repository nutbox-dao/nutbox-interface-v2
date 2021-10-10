<template>
    <div>
        <div v-if="metamaskConnected" class="account-dropdown-btn flex-between-center">
         <span>{{ showingAddress }}</span>
        </div>
        <div v-else>
            <ConnectMetaMask style="width: 8rem;padding:.1rem .3rem;"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ConnectMetaMask from '@/components/Commen/ConnectMetaMask'

export default {
  name: 'BSCAccount',
  components: {
      ConnectMetaMask,
  },
  computed: {
      ...mapState('web3', ['account']),
      ...mapState(['metamaskConnected']),
      showingAddress (){
          if (this.account) {
              return this.account.slice(0, 6) + '...' + this.account.slice(-5)
          }
      }
  },
}
</script>

<style scoped lang="scss">
</style>
