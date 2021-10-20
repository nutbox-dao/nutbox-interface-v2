<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div class="view-top-header view-top-header-sticky view-top-header-pt0 p-view-top-header flex-between-center">
        <div class="nav-box nav-box-bg">
          <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
          </div>
        </div>
        <component :is='tabOptions[activeTab]'/>
      </div>
      <div class="view-top-header view-top-header-sticky m-view-top-header flex-between-center ">
        <b-dropdown class="top-header-dropdown" no-caret>
          <template #button-content>
            <span>{{tabOptions[activeTab]}}</span>
            <i class="dropdown-icon ml-2"></i>
          </template>
          <b-dropdown-item v-for="(item, index) of tabOptions" :key="index"
                           :class="activeTab===index?'active':''"
                           @click="activeTab = index">{{item}}</b-dropdown-item>
        </b-dropdown>
        <component :is='tabOptions[activeTab]'/>
      </div>
     <div v-if="showingCards.length > 0"></div>
      <div class="empty-bg" v-else>
       <img src="~@/static/images/empty-data.png" alt="" />
       <p> {{ $t('tip.noProject') }} </p>
     </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(pool, idx) of showingCards" :key="idx.toString()+pool.trieIndex">
            <CrowdLoanCard :card="pool"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdLoanCard from '@/components/CrowdStaking/CrowdLoanCard'
import { getAllParachain } from '@/utils/web3/pool'
import { mapState, mapGetters } from 'vuex'
import { sortCRPoolCard } from '@/utils/commen/crowdloan'
import PolkadotAccount from '@/components/Accounts/PolkadotAccount'

export default {
  name: 'DCrowdLoan',
  components: {
    CrowdLoanCard,
    Pokadot: PolkadotAccount,
    Kusama: PolkadotAccount
  },
  data () {
    return {
      sortedPools: [],
      activeTab: 0,
      tabOptions: ['Pokadot', 'Kusama']
    }
  },
  computed: {
    ...mapState({
      allParachain: state => state.allParachain,
      loadingAllPools: state => state.web3.loadingAllPools
    }),
    ...mapGetters('web3', ['poolCards']),
    data () {
      const { poolCards, allParachain } = this
      return { poolCards, allParachain }
    },
    showingCards () {
      return this.sortedPools.filter(pool => pool.chainId === this.activeTab + 2)
    }
  },
  watch: {
    data (newValue, oldValue) {
      const { poolCards, allParachain } = newValue
      this.sortedPools = sortCRPoolCard(poolCards, allParachain)
    }
  },
  mounted () {
    // get parachian info from backend
    getAllParachain().then((res) => {
      this.sortedPools = sortCRPoolCard(this.poolCards, this.allParachain)
    }).catch(e => {
      console.log(e);
    })
  }
}
</script>

<style scoped>

</style>
