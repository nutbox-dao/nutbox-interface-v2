<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 mb-4">
      <WalletCard type='hive' :logo="hiveLogo" name='HIVE' symbol="HIVE" :balance='hiveFormat'/>
    </div>
     <div class="col-xl-4 col-md-6 mb-4">
      <WalletCard type='hive' :logo="hpLogo" name='HIVE POWER' symbol='HP' :balance='hpFormat'/>
    </div>
  </div>
</template>

<script>
import WalletCard from '@/components/Wallet/cards/WalletCard'
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatBalance } from '@/utils/helper'

export default {
  name: 'Hive',
  data() {
    return {
      hiveLogo: require('@/static/images/tokens/hive.png'),
      hpLogo: require('@/static/images/tokens/hp.png')
    }
  },
  computed: {
    ...mapState('hive', ['hiveBalance', 'hiveAccount']),
    ...mapGetters('hive', ['hpBalance']),
    hiveFormat(){
      return formatBalance(this.hiveBalance)
    },
    hpFormat(){
      return formatBalance(this.hpBalance)
    }
  },
  components: { WalletCard },
  methods: {
    ...mapActions('hive', ['getHive', 'getVests'])
  },
  mounted () {
    if (!this.hiveAccount){
      return;
    }
    this.getHive()
    this.getVests()
  },
}
</script>

<style scoped>

</style>
