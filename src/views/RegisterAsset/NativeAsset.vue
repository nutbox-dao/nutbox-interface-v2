<template>
  <div class="tab-card">
    <b-form class="custom-form text-left">
      <b-form-group
        id="input-group-1"
        :label="$t('asset.homeLocation')"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="tokenAddress"
          :placeholder="$t('asset.inputHomeLocation')"
          required
        ></b-form-input>
        <div id="mint-checkbox" class="mt-3 font12 flex-between-center">
          <div class="text-grey">
            <div v-if="false"></div>
          </div>
          <div class="custom-control" style="line-height: 1.5rem">
            {{ $t('asset.notDeploy') }}
            <router-link to="/community/deploy-token">{{ $t('asset.deployOne') }}</router-link>
          </div>
        </div>
      </b-form-group>
      <button class="primary-btn" @click="registry" :disabled='registring || !canRegister'>
        <b-spinner small type="grow" v-show="registring" />
        {{ $t('asset.register') }}
      </button>
    </b-form>
  </div>
</template>

<script>
import { registerHomeChainAsset, getRegitryAssets } from '@/utils/web3/asset'
import { isContractAddress } from "@/utils/web3/contract"
import { handleApiErrCode } from '../../utils/helper';

export default {
  name: "CrossChainAsset",
  data() {
    return {
      tokenAddress: null,
      registring: false
    };
  },
  computed: {
    canRegister() {
      return this.tokenAddress && this.tokenAddress.length > 0 
    }
  },
  methods: {
    async registry() {
      // validate token
      this.registring = true
      const isContract = await isContractAddress(this.tokenAddress)
      if (!isContract) {
        this.$bvToast.toast(this.$t('tip.notContractAddress'), {
          title: this.$t('tip.error'),
          variant: 'danger'
        })
        this.registring = false
        return;
      }
      try{
        const tsHash = await registerHomeChainAsset(this.tokenAddress)
        if (tsHash){
          this.$bvToast.toast('txHash:'+tsHash, {
            title: this.$t('tip.registryAssetSuccess'),
            variant: 'success'
          })
          // update assets cache
          await getRegitryAssets(true)
          this.tokenAddress = ''
        }else{
          this.$bvToast.toast(this.$t('tip.registryAssetFail'), {
            title: this.$t('tip.error'),
            variant: 'danger'
          })
        }
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
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