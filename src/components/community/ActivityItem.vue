<template>
  <div class="activity-card">
    <div class="title">{{ opType }}</div>
    <div class="content hover" :id="operation.tx + operation.type" @click="gotoTransaction()">{{ description }}</div>
    <!-- <b-popover
          :target="operation.tx + operation.type"
          triggers="hover focus"
          placement="top"
        >
          {{ description }}
        </b-popover> -->
    <div class="d-flex justify-content-between align-items-center mt-2">
      <img class="rounded-circle hover avatar"
            v-if="userAvatar && userAvatar.length > 0"
            :id="operation.tx + operation.type + operation.user"
           :src="userAvatar" alt="">
      <img v-else class="user-avatar rounded-circle avatar"
            :id="operation.tx + operation.type + operation.user"
              src="~@/static/images/avatars/default.png" alt="">
      <b-popover :target="operation.tx + operation.type + operation.user"
      triggers="hover focus"
      placement="top">
        {{ username }}
      </b-popover>
      <span :id="operation.tx + operation.type + operation.timestamp" class="hover">{{ time }}</span>
      <b-popover :target="operation.tx + operation.type + operation.timestamp"
        triggers="hover focus"
        placement="top"
      >
        {{ getDateString(operation.timestamp) }}
      </b-popover>
    </div>
  </div>
</template>

<script>
import { parseTimestamp, sleep } from '@/utils/helper'
import { ethers } from 'ethers'
import { mapState, mapGetters } from 'vuex'
import { contractAddress } from '@/utils/web3/contract'
import { BLOCK_CHAIN_BROWER } from '@/config'

export default {
  name: 'ActivityItem',
  props: {
    operation: {
      type: Object
    },
    showName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      time: '',
      description: '',
      username: '',
      userAvatar: '',
      opType: '',
    }
  },
  computed: {
    ...mapState('web3', ['allTokens']),
    ...mapState('user', ['users']),
    ...mapState('steem', ['vestsToSteem']),
    ...mapState('hive', ['vestsToHive']),
    ...mapState('currentCommunity', ['cToken']),
    ...mapGetters('user', ['getUserByAddress']),
  },
  methods: {
    gotoTransaction() {
      window.open(BLOCK_CHAIN_BROWER + 'tx/' + this.operation.tx, '_blank')
    },
    getDateString(timestamp) {
      try {
        return new Date(parseInt(timestamp) * 1e3).toISOString().replace("T", " ").substring(0, 19)
      }catch(e) {
        return '--'
      }
    },
  },
  async mounted () {
    // timestamp
    this.time = parseTimestamp(this.operation.timestamp)
    const interval = setInterval(() => {
      this.time = parseTimestamp(this.operation.timestamp)
    }, 5000);
    this.$once('hook:beforeDestroy', () => {
      window.clearInterval(interval)
    })
    let accName = this.operation.user.substring(0, 4) + '...' + this.operation.user.substring(this.operation.user.length - 4, this.operation.user.length)
    const user = this.getUserByAddress(this.operation.user);
    if (user) {
      accName = user.name ?? accName;
      this.userAvatar = user.avatar
    }
    this.username = accName
    let symbol;
    let ctokenSymbol;
    let delegatee;
    if (this.operation.asset && this.operation.asset.length > 0){
      try{
        const tokenAddress = ethers.utils.getAddress(this.operation.asset)
        const token = this.allTokens.filter(t => t.address == tokenAddress)[0]
        symbol = token.symbol;
      }catch(e){
        delegatee = ethers.utils.parseBytes32String(this.operation.asset)
      }
    }
    const amount = (this.operation.amount?.toString() / 1e18).toFixed(2)
    // distribution
    switch (this.operation.type) {
      case "DEPOSIT":
        this.opType = "Deposit"
        if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = (this.showName ? accName + ' deposit' : 'Deposit') + ` ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          const sp = (this.operation.amount?.toString() / 1e6)
          if (parseInt(this.operation.chainId) === 1){
            this.description = (this.showName ? accName + ' add' : 'Add') + ` ${(sp * this.vestsToSteem).toFixed(2)} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = (this.showName ? accName + ' add' : 'Add') + ` ${(sp * this.vestsToHive).toFixed(2)} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "WITHDRAW":
        this.opType = "Withdraw"
         if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = (this.showName ? accName + ' withdraw' : 'Withdraw')  + ` ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          const sp = (this.operation.amount?.toString() / 1e6)
          if (parseInt(this.operation.chainId) === 1){
            this.description = (this.showName ? accName + ' minus' : 'Minus') + ` ${(sp * this.vestsToSteem).toFixed(2)} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = (this.showName ? accName + ' minus' : 'Minus') + ` ${(sp * this.vestsToHive).toFixed(2)} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "HARVEST":
        this.opType = "Harvest"
        while(!this.cToken) {
          await sleep(0.2)
        }
        ctokenSymbol = this.cToken.symbol;
        this.description = (this.showName ? accName + ' harvest' : 'Harvest') + ` ${(this.operation.amount.toString() / 1e18).toFixed(2)} ${ctokenSymbol} from pool: ${this.operation.pool.name}`
        break;
      case "HARVESTALL":
        this.opType = "Harvest all"
        while(!this.cToken) {
          await sleep(0.2)
        }
        ctokenSymbol = this.cToken.symbol;
        this.description = (this.showName ? accName + ' harvest' : 'Harvest') + ` harvest all ${ctokenSymbol}`
        break;
      case "ADMINCREATE":
        this.opType = "Create Community"
        this.description = (this.showName ? 'Admin creat' : 'Create') + ` this community`
        break;
      case "ADMINSETFEE":
        this.opType = "Set DAO fund ratio"
        this.description = (this.showName ? 'Admin change' : 'Change') + ` DAO fund ratio to ${(this.operation.amount.toString() / 100).toFixed(2)}%`
        break;
      case "ADMINADDPOOL":
        this.opType = "Create new pool"
        this.description = (this.showName ? 'Admin creat' : 'Create') + ` a new pool: ${this.operation.pool.name}`
        break;
      case "ADMINCLOSEPOOL":
        this.opType = "Close pool"
        this.description = (this.showName ? 'Admin close' : 'Close') + ` a pool: ${this.operation.pool.name}`
        break;
      case "ADMINSETRATIO":
        this.opType = "Reset pool ratios"
        this.description = (this.showName ? 'Admin reset' : 'Reset') + ` the pool ratios.`
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
.avatar{
  width: 2rem;
  height: 2rem;
}
</style>
