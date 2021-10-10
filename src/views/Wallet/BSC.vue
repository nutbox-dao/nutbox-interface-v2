<template>
  <div class="row">
    <div class="col-xl-4 col-md-6 mb-4">
      <div class="wallet-card">
        <div class="top flex-between-center">
          <img src="~@/static/images/tokens/bnb.png" alt="" class="logo" />
          <div class="balance-right flex-full">
            <div class="d-flex justify-content-between align-items-start font-bold">
              <div class="d-flex flex-column align-items-start justify-content-between">
                <div class="font16">BNB</div>
                <div class="font12 text-grey-light">
                  <span>
                    BNB
                  </span>
                </div>
              </div>
              <span class="font16">{{ balance.toString() | amountForm }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-md-6 mb-4 " v-for="(v, i) in sortedCards" :key="i">
      <div  class="wallet-card">
        <div class="top flex-between-center">
          <img :src="v.logo" alt="" class="logo" />
          <div class="balance-right flex-full">
            <div class="d-flex justify-content-between align-items-start font-bold">
              <div class="d-flex flex-column align-items-start justify-content-between">
                <div class="font16">{{ v.symbol }}</div>
                <div class="font12 text-grey-light">
                  <span>
                    {{ v.name }}
                  </span>
                  <img style="width: 14px; height: 14px"
                    class='copy-icon'
                    src="~@/static/images/copy.svg"
                    @click="copy(v.address)"
                  >
                </div>
              </div>
              <span class="font16">{{ (v.balance.toString() / 1e18) | amountForm }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { monitorCtokenBalance, getBalance } from '@/utils/web3/asset'
import { mapState } from 'vuex'

export default {
   name: 'BSCWallet',
  data() {
    return {
      balance: 0
    };
  },
  computed: {
    ...mapState('web3', ['ctokenBalances']),
    sortedCards() {
      let temp = []
      for (const k in this.ctokenBalances) {
        temp.push({
          address: k,
          ...this.ctokenBalances[k]
        })
      }
      return temp.sort((a,b) => b.balance.sub(a.balance))
    }
  },
  methods: {
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },
    copy(address) {
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: this.formatUserAddress(address)
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    }
  },
  async mounted () {
    monitorCtokenBalance(true);
    const balance = await getBalance()
    this.balance = balance.toString() / 1e18
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/wallet-card";
.copy-icon:hover{
  cursor: pointer;
}
.wallet-card {
  border: 2px solid transparent;
  &:hover {
    box-shadow: 0 2px 20px #FFE973;
    border: 2px solid #FFDB1B;
    box-sizing: border-box;
  }
  .top {
    margin-bottom: 0;
  }
  .btn-group {
    margin-top: 1rem;
  }
}
</style>
