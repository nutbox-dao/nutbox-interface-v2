<template>
  <b-dropdown class="c-dropdown" right no-caret>
    <template #button-content>
      <div class="account-dropdown-btn flex-between-center">
        <span class="ml-2">{{account && account.meta && account.meta.name | formatUserAddress}}</span>
        <i class="dropdown-icon ml-3"></i>
      </div>
    </template>
    <b-dropdown-item v-for="(item, index) of allAccounts ? allAccounts : []" :key="index"
                     @click="changeAccount(item)">
      <template>
        <div class="flex-between-center">
          <Identicon class="ident-icon" :size="40" theme="polkadot" :value="item.address"/>
          <div class="account-info ml-2">
            <div class="font-bold">
              {{ item.meta ? item.meta.name : "" }}
            </div>
            <div class="address">
              {{ item.address | formatUserAddress }}
            </div>
          </div>
          <img class="ml-3" v-if="item.address === (account && account.address)"
               src="~@/static/images/selected.png" alt=""/>
        </div>
      </template>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Identicon from '@polkadot/vue-identicon'
export default {
  name: 'PolkadotAccount',
  components: { Identicon },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('polkadot', [
      'isConnected',
      'allAccounts',
      'account',
      'crowdstakings',
      'communitys',
      'projects'
    ])
  },
  methods: {
    changeAccount (acc) {
    }
  }
}
</script>

<style scoped lang="scss">
</style>
