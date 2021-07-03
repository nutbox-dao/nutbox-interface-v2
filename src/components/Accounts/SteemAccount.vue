<template>
  <b-dropdown v-if="isLogin" class="c-dropdown" right>
    <template #button-content>
      <div class="account-dropdown-btn flex-between-center">
        <span>{{account}}</span>
        <i class="dropdown-icon ml-3"></i>
      </div>
    </template>
    <b-dropdown-item class="text-center" @click="logoutSteem">Logout</b-dropdown-item>
  </b-dropdown>
  <div v-else></div>
</template>

<script>
export default {
  name: 'SteemAccount',
  data () {
    return {
      isLogin: true,
      account: 'Test'
    }
  },
  methods: {
    logoutSteem () {
      this.isLogin = false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
