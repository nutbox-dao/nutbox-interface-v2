<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 mb-4">
      <WalletCard type='steem' :logo="steemLogo" name='STEEM' symbol="STEEM" :balance='steemFormat'/>
    </div>
     <div class="col-xl-4 col-md-6 mb-4">
      <WalletCard type='steem' :logo="spLogo" name='STEEM POWER' symbol='SP' :balance='spFormat'/>
    </div>
  </div>
</template>

<script>
import WalletCard from '@/components/Wallet/cards/WalletCard'
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatBalance } from '@/utils/helper'

export default {
  name: 'Steem',
  data() {
    return {
      steemLogo: require('@/static/images/tokens/steem.png'),
      spLogo: require('@/static/images/tokens/sp.png')
    }
  },
  computed: {
    ...mapState('steem', ['steemBalance', 'steemAccount']),
    ...mapGetters('steem', ['spBalance']),
    steemFormat(){
      try{
        return formatBalance(this.steemBalance)
      }catch(e){
        console.log(331,e);
      }
    },
    spFormat(){
      return formatBalance(this.spBalance)
    }
  },
  components: { WalletCard },
  methods: {
    ...mapActions('steem', ['getSteem', 'getVests'])
  },
  mounted () {
    if (!this.steemAccount){
      return;
    }
    this.getSteem()
    this.getVests()
  },
}
</script>

<style scoped>

</style>
