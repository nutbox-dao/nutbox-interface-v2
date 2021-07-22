<template>
    <div class="account-dropdown-btn flex-between-center">
        <span>{{ showingAddress }}</span>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'BSCAccount',
  computed: {
      ...mapState('web3', ['account']),
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
