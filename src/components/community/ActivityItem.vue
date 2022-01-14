<template>
  <div class="activity-card">
    <div class="title font14 font-bold">{{ opType }}</div>
    <div class="content hover font14 line-height18 font-bold" :id="operation.tx + operation.type" @click="gotoTransaction()">
      <span v-show="showName" :class="isAdmin ? 'admin' : ''">{{ username }}</span>
      {{ description }}
    </div>
    <b-popover
          :target="operation.tx + operation.type"
          :delay="{show: 800}"
          triggers="hover focus"
          placement="top"
        >
          {{ showName ? username + description : description }}
        </b-popover>
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
      <span :id="operation.tx + operation.type + operation.timestamp" class="hover text-grey-7 font14 line-height14">{{ time }}</span>
      <b-popover :target="operation.tx + operation.type + operation.timestamp"
        triggers="hover focus"
        placement="top"
        :delay="{show: 500}"
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
      isAdmin: false,
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
        while(!this.allTokens) {
          await sleep(0.3)
        }
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
        this.isAdmin =false;
        if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = (this.showName ? ' deposit' : 'Deposit') + ` ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          const sp = (this.operation.amount?.toString() / 1e6)
          if (parseInt(this.operation.chainId) === 1){
            this.description = (this.showName ? ' add' : 'Add') + ` ${(sp * this.vestsToSteem).toFixed(2)} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = (this.showName ? ' add' : 'Add') + ` ${(sp * this.vestsToHive).toFixed(2)} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "WITHDRAW":
        this.opType = "Withdraw"
        this.isAdmin =false;
         if (this.operation.poolFactory.toLowerCase() == contractAddress.ERC20StakingFactory.toLowerCase()){
          this.description = (this.showName ? ' withdraw' : 'Withdraw')  + ` ${amount} ${symbol} to ${this.operation.pool.name}`
        }else if (this.operation.poolFactory.toLowerCase() == contractAddress.SPStakingFactory.toLowerCase()) {
          const sp = (this.operation.amount?.toString() / 1e6)
          if (parseInt(this.operation.chainId) === 1){
            this.description = (this.showName ? ' minus' : 'Minus') + ` ${(sp * this.vestsToSteem).toFixed(2)} sp to ${delegatee} from ${this.operation.pool.name}`
          }else {
            this.description = (this.showName ? ' minus' : 'Minus') + ` ${(sp * this.vestsToHive).toFixed(2)} hp to ${delegatee} from ${this.operation.pool.name}`
          }
        }
        break;
      case "HARVEST":
        this.opType = "Harvest"
        this.isAdmin =false;
        while(!this.cToken) {
          await sleep(0.2)
        }
        ctokenSymbol = this.cToken.symbol;
        this.description = (this.showName ? ' harvest' : 'Harvest') + ` ${(this.operation.amount.toString() / 1e18).toFixed(2)} ${ctokenSymbol} from pool: ${this.operation.pool.name}`
        break;
      case "HARVESTALL":
        this.opType = "Harvest all"
        this.isAdmin =false;
        while(!this.cToken) {
          await sleep(0.2)
        }
        ctokenSymbol = this.cToken.symbol;
        this.description = (this.showName ? ' harvest' : 'Harvest') + ` harvest all ${ctokenSymbol}`
        break;
      case "ADMINCREATE":
        this.isAdmin = true;
        this.username = 'Admin'
        this.opType = "Create Community"
        this.description = (this.showName ? ' creat' : 'Create') + ` this community`
        break;
      case "ADMINSETFEE":
        this.isAdmin = true
        this.username = 'Admin'
        this.opType = "Set DAO fund ratio"
        this.description = (this.showName ? ' change' : 'Change') + ` DAO fund ratio to ${(this.operation.amount.toString() / 100).toFixed(2)}%`
        break;
      case "ADMINADDPOOL":
        this.isAdmin = true;
        this.username = 'Admin'
        this.opType = "Create new pool"
        this.description = (this.showName ? ' creat' : 'Create') + ` a new pool: ${this.operation.pool.name}`
        break;
      case "ADMINCLOSEPOOL":
        this.isAdmin = true;
        this.username = 'Admin'
        this.opType = "Close pool"
        this.description = (this.showName ? ' close' : 'Close') + ` a pool: ${this.operation.pool.name}`
        break;
      case "ADMINSETRATIO":
        this.isAdmin = true;
        this.username = 'Admin'
        this.opType = "Reset pool ratios"
        this.description = (this.showName ? ' reset' : 'Reset') + ` the pool ratios.`
        break;
    }
  },
}
</script>

<style scoped lang="scss">
.activity-card {
  @include card(16px 8px, var(--block-bg), unset, fit-conent);
  .content {
    @include text-multi-line(2);
    span {
      color: var(--primary-hover);
    }
    .admin {
      color: var(--warning)
    }
  }
}
.avatar{
  width: 28px;
  height: 28px;
}
</style>
