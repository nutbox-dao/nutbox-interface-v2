<template>
  <div class="tab-card">
    <b-form class="custom-form text-left">
      <b-form-group
        id="input-group-1"
        label="Home Location"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="tokenAddress"
          placeholder="Your token contract address"
          required
        ></b-form-input>
        <div id="mint-checkbox" class="mt-3 font12 flex-between-center">
          <div class="text-grey">
            <div v-if="false"></div>
          </div>
          <div class="custom-control" style="line-height: 1.5rem">
            Havn’t Deploy yet？
            <router-link to="/community/deploy-token">Deploy one</router-link>
          </div>
        </div>
      </b-form-group>
      <button class="primary-btn" @click="registry" :disabled='registring'>
        <b-spinner small type="grow" v-show="registring" />
        Register
      </button>
    </b-form>
  </div>
</template>

<script>
import { registryHomeChainAsset, getRegitryAssets, getERC20Info } from '@/utils/web3/asset'
import { isContractAddress } from '@/utils/web3/contract'

export default {
  name: "CrossChainAsset",
  data() {
    return {
      tokenAddress: null,
      registring: false
    };
  },
  methods: {
    async registry() {
      // validate token
      this.registring = true
      const tokenInfo = await getERC20Info(this.tokenAddress)
      if (!tokenInfo || !tokenInfo.name) {
        this.$bvToast.toast(this.$t('tip.notContractAddress'), {
          title: this.$t('tip.error'),
          variant: 'danger'
        })
        this.registring = false
        return;
      }
      try{
        const res = await registryHomeChainAsset(this.tokenAddress)
        if (res){
          this.$bvToast.toast('txHash:'+res.hash, {
            title: this.$t('tip.registryAssetSuccess'),
            variant: 'success'
          })
          // update assets cache
          await getRegitryAssets(true)
          this.$router.push('/community/create-economy')
        }else{
          this.$bvToast.toast(this.$t('tip.registryAssetFail'), {
            title: this.$t('tip.error'),
            variant: 'danger'
          })
        }
      }catch(e){
        console.log('Registry homechain asset failed', e);
      }finally{
        this.registring = false
      }
      
    }
  },
  mounted () {
    const address = this.$route.query.tokenAddress
    if (address) {
      this.tokenAddress = address
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.tab-card {
  @include card(2.4rem 1.2rem, white, hidden, auto);
  max-width: 500px;
  min-height: 27rem;
  margin: auto;
}
</style>