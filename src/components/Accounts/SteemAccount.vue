<template>
  <b-dropdown v-if="isLogin" class="account-dropdown" right>
    <template #button-content>
      <div class="account-dropdown-btn flex-between-center">
        <span>{{steemAccount}}</span>
        <i class="dropdown-icon ml-3"></i>
      </div>
    </template>
    <b-dropdown-item class="text-center" @click="clearSteemAccount">{{ $t('commen.logout') }}</b-dropdown-item>
  </b-dropdown>
  <div v-else></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SteemAccount',
  computed: {
    ...mapState('steem',['steemAccount']),
    isLogin() {
      return this.steemAccount
    }
  },
  methods: {
    ...mapMutations('steem', ['clearSteemAccount'])
  }
}
</script>

<style scoped lang="scss">
</style>
