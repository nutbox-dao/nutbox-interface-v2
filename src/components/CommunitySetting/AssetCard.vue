<template>
  <div class="asset-card">
    <div class="top flex-between-center">
      <img v-if="logo" :src="logo" alt="" class="logo" />
      <div v-else class="logo"></div>
      <div class="balance-right flex-full">
        <div class="d-flex justify-content-between align-items-start font-bold">
          <div class="d-flex flex-column align-items-start justify-content-between">
            <div class="font16">{{ showingSymbol }}</div>
            <div class="font12 text-grey-light flex-start-center">
              <span>{{ showingName }}</span>
              <i class="copy-icon" v-if="type === 'HomeChainAssetRegistry'" @click="copy"></i>
            </div>
          </div>
          <span class="font16">${{ formatPrice | amountForm }}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { updateTokenIcon } from '@/utils/web3/asset'

export default {
  name: 'AssetCard',
  props: {
    logo: {
      type: String
    },
    symbol: {
      type: String
    },
    name: {
      type:String
    },
    address: {
      type: String
    },
    price: {
      type: Number
    },
    type: {
      type: String
    },
    chainId: {
      type: Number
    }
  },
  data() {
    return {
      showingSymbol: '',
      showingName: '',
      logoUrl: '',
      loading: false
    }
  },
  computed: {
    ...mapState(['prices', 'ethPrice']),
    formatPrice() {
      if (this.type === 'HomeChainAssetRegistry') {
        return this.price
      } else if(this.type === 'SubstrateCrowdloanAssetRegistry' || this.type === 'SubstrateNominateAssetRegistry'){
        if (this.chainId === 2) {
          return this.prices['DOTUSDT']
        }else if(this.chainId === 3){
          return this.prices['KSMUSDT']
        }
      } else if (this.type === 'SteemHiveDelegateAssetRegistry'){
        if (this.chainId === 1){
          return this.prices['STEEMETH'] * this.ethPrice
        }else if (this.chainId === 2){
          console.log('2354235', this.prices);
          return this.prices['HIVEUSDT']
        }
      }
    }
  },
  mounted () {
    if (this.type === 'HomeChainAssetRegistry') {
        this.showingName = this.name
        this.showingSymbol = this.symbol
      } else if(this.type === 'SubstrateCrowdloanAssetRegistry' || this.type === 'SubstrateNominateAssetRegistry'){
        if (this.chainId === 2) {
          this.showingName = 'Polkadot'
          this.showingSymbol = 'DOT'
        }else if(this.chainId === 3){
          this.showingName = 'Kusama'
          this.showingSymbol = 'KSM'
        }
      } else if (this.type === 'SteemHiveDelegateAssetRegistry'){
        if (this.chainId === 1){
          this.showingName = 'Steem power'
          this.showingSymbol = 'SP'
        }else if (this.chainId === 2){
          this.showingName = 'Hive power'
          this.showingSymbol = 'HIVE'
        }
      }
  },
  methods: {
    copy () {
      if (this.type !== 'HomeChainAssetRegistry') return;
      navigator.clipboard.writeText(this.address).then(() => {
        this.$bvToast.toast(
          this.address,
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info'
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    async updateTokenIcon() {
      if (this.type !== 'HomeChainAssetRegistry') return;
      let token = {
        address: this.address,
        logo: this.logoUrl
      }
      try{
        const res = await updateTokenIcon(token)
      }catch(e){
        
      }finally{
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.asset-card {
  @include card(1.2rem 0);
  @include c-col-flex-between-center;
  .top {
    width: 100%;
    @include single-color-bg(.2rem 1.4rem);
    background-position: left center;
    padding: 0 1.2rem;
  }
  .logo {
    @include card-icon;
    margin-right: .4rem;
  }
  .copy-icon {
    @include icon(.6rem, .6rem);
    background-image: url("~@/static/images/copy.svg");
    margin-left: .2rem;
  }
}
</style>
