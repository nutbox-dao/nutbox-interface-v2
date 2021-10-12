<template>
  <b-dropdown v-if="isLogin" class="account-dropdown" right>
    <template #button-content>
      <div class="account-dropdown-btn flex-between-center">
        <span>{{hiveAccount}}</span>
        <i class="dropdown-icon ml-3"></i>
      </div>
    </template>
    <b-dropdown-item class="text-center" @click="clearHiveAccount">{{ $t('commen.logout') }}</b-dropdown-item>
  </b-dropdown>
  <div v-else></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HiveAccount',
  computed: {
    ...mapState('hive',['hiveAccount']),
    isLogin() {
      return this.hiveAccount
    }
  },
  methods: {
    ...mapMutations('hive', ['clearHiveAccount'])
  }
}
</script>

<style scoped lang="scss">
</style>
