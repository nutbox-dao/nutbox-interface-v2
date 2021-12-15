<template>
  <div class="activity-card">
    <div class="title">{{ operation.type }}</div>
    <div class="content hover" :id="operation.tx + operation.type" @click="gotoTransaction()">{{ description }}</div>
    <b-popover
          :target="operation.tx + operation.type"
          triggers="hover focus"
          placement="top"
        >
          {{ description }}
        </b-popover>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <img v-if="operation.user.length > 0" class="rounded-circle hover"
           style="width: 2rem; height: 2rem"
           :src="operation.user" alt="">
      <span class="hover">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { contractAddress } from '@/utils/web3/contract'
import { VUE_APP_TX_BROWER } from '@/config'

export default {
  name: 'ActivityItem',
  props: {
    operation: {
      type: Object
    }
  },
  data() {
    return {
      time: '',
      description: '',
    }
  },
  computed: {
    ...mapState('web3', ['allTokens']),
    ...mapState('steem', ['vestsToSteem']),
    ...mapState('hive', ['vestsToHive'])
  },
  methods: {
    gotoTransaction() {
      window.open(VUE_APP_TX_BROWER + this.operation.tx, '_blank')
    }
  },
  mounted () {
    // timestamp
    this.time = parseTimestamp(this.operation.timestamp)
    const interval = setInterval(() => {
      this.time = parseTimestamp(this.operation.timestamp)
    }, 5000);
    this.$once('hook:beforeDestroy', () => {
      window.clearInterval(interval)
    })
    const accName = this.operation.user.substring(0, 4) + '...' + this.operation.user.substring(this.operation.user.length - 4, this.operation.user.length)
    let symbol;
    let delegatee;
    if (this.operation.asset && this.operation.asset.length > 0){
      try{
        const tokenAddress = ethers.utils.getAddress(this.operation.asset)
        const token = this.allTokens.filter(t => t.address == tokenAddress)[0]
        symbol = token.symbol;
      }catch(e){
        console.log(e);
        delegatee = ethers.utils.parseBytes32String(this.operation.asset)
      }
    }
    const amount = (this.operation.amount?.toString() / 1e18).toFixed(2)
    // distribution
    switch (this.operation.type) {
      case "DEPOSIT":
        if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = accName + ` deposit ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          if (parseInt(this.operation.chainId) === 1){
            this.description = `${accName} add ${amount * this.vestsToSteem} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = `${accName} add ${amount * this.vestsToHive} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "WITHDROW":
         if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = accName + ` withdraw ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          if (parseInt(this.operation.chainId) === 1){
            this.description = `${accName} minus ${amount * this.vestsToSteem} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = `${accName} minus ${amount * this.vestsToHive} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "HARVEST":
       this.description = accName + ` withdraw ${ethers.utils.formatEther(this.operation.amount)} ${symbol} from pool: ${this.operation.pool.name}`
        break;
      case "HARVESTALL":
        this.description = accName + ` harvest all ${symbol}`
        break;
      case "ADMINCREATE":
        this.description = `Admin create this community`
        break;
      case "ADMINSETFEE":
        this.description = `Admin change DAO fund ratio to ${(this.operation.amount.toString() / 100).toFixed(2)}%`
        break;
      case "ADMINADDPOOL":
        this.description = `Admin create a new pool: ${this.operation.pool.name}`
        break;
      case "ADMINCLOSEPOOL":
        this.description = `Admin close a pool: ${this.operation.pool.name}`
        break;
      case "ADMINSETRATIO":
        this.description = `Admin reset the pool ratios.`
        break;
    }
  },
}
</script>

<style scoped lang="scss">
.activity-card {
  @include card(.5rem, var(--block-bg), unset, fit-conent);
  font-size: .7rem;
  .content {
    @include text-multi-line(2);
  }
}
</style>
