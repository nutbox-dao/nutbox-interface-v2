<template>
  <div class="d-form">
    <div class="custom-form">
      <b-form-group
        id="input-group-0"
        :label="$t('asset.network')"
        label-for="dropdown-0"
      >
        <b-dropdown class="c-dropdown" menu-class="full-dropdown-menu">
          <template #button-content>
            <div class="c-dropdown-btn flex-between-center">
              <div class="flex-full flex-start-center text-left">
                <img :src="networkOptions[networkIndex].icon" alt="" />
                <span>{{ networkOptions[networkIndex].name }}</span>
              </div>
              <i class="dropdown-icon"></i>
            </div>
          </template>
          <b-dropdown-item
            v-for="(item, index) of networkOptions"
            :key="item.name"
            @click="networkIndex = index"
          >
            <template #default>
              <div class="flex-between-center">
                <div class="flex-full flex-start-center">
                  <img :src="item.icon" alt="" />
                  <span>{{ item.name }}</span>
                </div>
                <i class="selected-icon" v-if="networkIndex === index"></i>
              </div>
            </template>
          </b-dropdown-item>
        </b-dropdown>
      </b-form-group>
      <b-form-group
        id="input-group-1"
        :label="$t('asset.parachainId')"
        label-for="dropdown-1"
      >
        <b-dropdown class="c-dropdown" menu-class="full-dropdown-menu">
          <template #button-content>
            <div class="c-dropdown-btn flex-between-center">
              <div class="flex-full flex-start-center text-left">
                <img v-show="Object.keys(selectParachain).length > 0"
                     :src="'https://cdn.wherein.mobi/polkadot/paralogo/k/'+selectParachain.paraId+'.png'" alt="" />
                <span>{{ selectParachain.text }}</span>
              </div>
              <i class="dropdown-icon"></i>
            </div>
          </template>
          <template v-if="loading">
            <div class="dropdown-menu-loading">
              <img src="~@/static/images/loading.gif" alt="" />
            </div>
          </template>
          <template v-else>
            <div v-if="onliningCrowdloan.length === 0"
                 class="text-center text-grey-light font12 my-2">{{ $t('tip.noProject') }}</div>
            <b-dropdown-item
              v-for="(item, index) of onliningCrowdloan"
              :key="index"
              @click="selectParachain = item"
            >
              <template #default>
                <div class="flex-between-center">
                  <div class="flex-full flex-start-center">
                    <img :src="'https://cdn.wherein.mobi/polkadot/paralogo/k/'+item.paraId+'.png'" alt="" />
                    <span>{{ item.text }}</span>
                  </div>
                  <i class="selected-icon" v-if="selectParachain === item"></i>
                </div>
              </template>
            </b-dropdown-item>
          </template>
        </b-dropdown>
      </b-form-group>
      <!-- <b-form-group :label="$t('asset.trieIndex')">
        <b-form-input
          v-model="form.trieIndex"
          :placeholder="$t('asset.inputTrieIndex')"
        ></b-form-input>
      </b-form-group> -->
      <b-form-group :label="$t('asset.communityAddress')">
        <b-form-input
          v-model="form.communityAddress"
          :placeholder="$t('asset.inputCommunityAddress')"
        ></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('asset.assetProperties')">
        <div class="font12 text-grey-light" style="margin: -0.6rem 0 0.4rem">
          {{ $t("asset.assetName") }}
        </div>
        <b-form-input
          v-model="form.assetName"
          :placeholder="$t('asset.inputAssetName')"
        ></b-form-input>
      </b-form-group>
      <!-- <b-form-group
        :label="$t('asset.endingBlock')"
        label-class="text-grey-light"
      >
        <b-form-input
          v-model="form.endingBlock"
          :placeholder="$t('asset.inputEndingBlock')"
        ></b-form-input>
      </b-form-group> -->
      <button class="primary-btn" @click="register" :disabled='registring'>
        <b-spinner small type="grow" v-show="registring" />
        {{ $t("asset.register") }}
      </button>
    </div>
    <!-- <div class="text-grey-light font16 mt-3">Assetld:0x1242222xshjdh32721</div> -->
  </div>
</template>

<script>
import { registerCrowdloanAsset, getRegitryAssets } from "@/utils/web3/asset";
import { isPositiveInt } from "@/utils/helper";
import { stanfiAddress } from "@/utils/commen/account";
import { handleApiErrCode } from '@/utils/helper';
import { ASSET_LOGO_URL } from '@/constant'
import { mapState } from 'vuex'

export default {
  name: "NominationForm",
  data() {
    return {
      registring: false,
      selectParachain: {},
      form: {
        chainId: "",
        paraId: "",
        trieIndex: "",
        communityAddress: "",
        assetName: "",
        endingBlock: "",
      },
      networkIndex: 0,
      networkOptions: [
        {
          name: "Polkadot",
          icon: ASSET_LOGO_URL.polkadot.icon
        },
        { name: "Kusuma",
          icon: ASSET_LOGO_URL.kusama.icon
        }
      ]
    };
  },
  watch: {
    networkIndex(newValue, oldValue) {
      this.selectParachain = {}
    }
  },
  computed: {
    ...mapState({
      polkadotFund: state => state.polkadot.clProjectFundInfos,
      kusamaFund: state => state.kusama.clProjectFundInfos,
      polkadotLoading: state => state.polkadot.loadingFunds,
      kusamaLoading: state => state.kusama.loadingFunds
    }),
    onliningCrowdloan (){
      if (this.networkIndex === 0){
        return this.polkadotFund.filter(f => f.statusIndex === 0)
      }else {
        return this.kusamaFund.filter(f => f.statusIndex === 0)
      }
    },
    loading() {
      return this.networkIndex===0?this.polkadotLoading:this.kusamaLoading
    }
  },
  methods: {
    validateParams() {
      const substrateAddressType = this.networkIndex === 0 ? 0 : 2;
      let tipStr = "";
      if (Object.keys(this.selectParachain).length === 0) {
        tipStr = this.$t('tip.selectCowdloan')
      } else if (
        !stanfiAddress(this.form.communityAddress, substrateAddressType) ||
        stanfiAddress(
          this.form.communityAddress,
          substrateAddressType
        ).toLowerCase() !== this.form.communityAddress.toLowerCase()
      ) {
        tipStr = this.$t("tip.wrongSubstrateAddress", {
          type: this.networkIndex === 0 ? "Polkadot" : "Kusama",
        });
      }else {
        return true
      }
      this.$bvToast.toast(tipStr, {
        title: this.$t('tip.tips'),
        variant: 'info'
      })
      return false
    },
    async register() {
      try{
        this.registring = true;
        if (!this.validateParams()) {
          this.registring = false
          return;
        }
        this.form.chainId = parseInt(this.networkIndex) + 2;
        this.form.paraId = this.selectParachain.paraId;
        this.form.trieIndex = this.selectParachain.trieIndex;
        const tx = await registerCrowdloanAsset(this.form);
        // update cache
        await getRegitryAssets(true)
        this.$bvToast.toast(this.$t('tip.registryAssetSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.form = {
          chainId: "",
          paraId: "",
          trieIndex: "",
          communityAddress: "",
          assetName: "",
          endingBlock: "",
        }
        this.networkIndex = 0
        setTimeout(() => {
          this.$router.go(-1);
        } , 1000)
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.registring = false
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
@import "src/static/css/dropdown";
.d-form {
  max-width: 500px;
  margin: auto;
}
label {
  margin-bottom: 0.2rem !important;
}
.c-dropdown {
  width: 100%;
  height: 2.4rem;
  .btn img {
    width: 1.4rem;
    height: 1.4rem;
    margin-right: 0.6rem;
  }
  .btn span {
    color: #242629;
  }
  .dropdown-item img {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.8rem;
  }
  .selected-icon {
    @include icon;
    background-image: url("~@/static/images/selected-gray.png");
  }
}
.dropdown-menu-loading {
  background-color: #f6f7f9;
  text-align: center;
  padding: 0.5rem 0;
  margin: -0.5rem 0;
}
</style>
