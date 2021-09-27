<template>
  <div>
    <div class="tab-card">
      <div class="custom-form text-left">
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
              <span class="text-primary" style="cursor: pointer"
                    @click="showDeploy = !showDeploy">{{ $t('asset.deployOne') }}</span>
            </div>
          </div>
        </b-form-group>
        <button class="primary-btn" @click="registry" :disabled='registring || !canRegister'>
          <b-spinner small type="grow" v-show="registring" />
          {{ $t('asset.register') }}
        </button>
      </div>
    </div>
    <div class="tab-card mt-4" v-if="showDeploy">
      <div class="font20 font-bold active-tab mb-3">Mintable ERC20</div>
      <div class="text-left form-box">
        <div class="warning-tip">
          <i class="warning-icon"></i>
          <div class="tip-text flex-full font12">
            Mintable ERC20 means your token contract has supported mint() and burn() method,
            that means you can assign a contract the mining role permission to mint your token to a
            specific address, also burn them from a specific address.
          </div>
        </div>
        <DeployForm :isMintable="true" @deployed="deployed"/>
      </div>
    </div>
  </div>
</template>

<script>
import { registerHomeChainAsset, getRegitryAssets } from '@/utils/web3/asset'
import { isContractAddress } from "@/utils/web3/contract"
import { handleApiErrCode } from '@/utils/helper';
import DeployForm from "@/components/Community/DeployForm";

export default {
  name: "CrossChainAsset",
  components: {DeployForm},
  data() {
    return {
      tokenAddress: null,
      registring: false,
      showDeploy: false
    };
  },
  computed: {
    canRegister() {
      return this.tokenAddress && this.tokenAddress.length > 0
    }
  },
  methods: {
    deployed(address){
      this.showDeploy = false;
      this.tokenAddress = address
    },
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
          this.$router.go(-1)
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
  margin: auto;
  .active-tab {
    padding-bottom: .6rem;
    background-image: linear-gradient(to right, var(--primary-custom), var(--primary-custom));
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 5.6rem .2rem;
  }
}
.warning-tip {
  background: #FFF4E5;
  border-radius: .4rem;
  padding: .6rem .8rem;
  display: flex;
  align-items: flex-start;
  margin-bottom: .8rem;
  .warning-icon {
    @include icon;
    background-image: url("~@/static/images/warning-icon.svg");
    margin-right: .3rem;
  }
  .tip-text {
    color: #FF5040;
    line-height: .8rem;
    word-break: break-word;
    text-align: justify;
  }
}

</style>
