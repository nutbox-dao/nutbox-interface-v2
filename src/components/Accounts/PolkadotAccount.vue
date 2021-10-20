<template>
  <b-dropdown class="account-dropdown" right no-caret>
    <template #button-content>
      <span>{{account && account.meta && account.meta.name | formatUserAddress}}</span>
      <i class="dropdown-icon ml-3"></i>
    </template>
    <b-dropdown-item v-for="(item, index) of allAccounts ? allAccounts : []" :key="index"
                     @click="changeAccount(item)">
      <template>
        <div class="flex-between-center">
          <div class="d-flex align-items-center">
            <Identicon class="ident-icon" :size="40" theme="polkadot" :value="item.address"/>
            <div class="account-info ml-2">
              <div class="font-bold">
                {{ item.meta ? item.meta.name : "" }}
              </div>
              <div class="address">
                {{ item.address | formatUserAddress }}
              </div>
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
import { getBalance as getPolkadotBalance } from '@/utils/polkadot/account'
import { getBalance as getKusamaBalance } from '@/utils/kusama/account'
import { subNominators } from '@/utils/commen/crowdStaking'

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
      'account'
    ])
  },
  methods: {
    ...mapMutations("polkadot", [
      'saveAccount'
    ]),
    changeAccount (acc) {
      console.log(acc.address);
      this.saveAccount(acc);
      getPolkadotBalance(acc);
      getKusamaBalance(acc);
      subNominators('polkadot');
      subNominators('kusama')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
