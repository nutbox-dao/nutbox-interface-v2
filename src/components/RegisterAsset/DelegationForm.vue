<template>
  <div class="d-form">
    <div class="custom-form">
            <b-form-group id="input-group-0"
                    :label="$t('asset.network')"
                    label-for="dropdown-1">
        <b-dropdown class="c-dropdown" menu-class="full-dropdown-menu">
          <template #button-content>
            <div class="c-dropdown-btn flex-between-center">
              <div class="flex-full flex-start-center text-left">
                <img :src="networkOptions[networkIndex].icon" alt="">
                <span>{{networkOptions[networkIndex].name}}</span>
              </div>
              <i class="dropdown-icon"></i>
            </div>
          </template>
          <b-dropdown-item v-for="(item, index) of networkOptions" :key="item.name" @click="networkIndex=index">
            <template #default>
              <div class="flex-between-center">
                <div class="flex-full flex-start-center">
                  <img :src="item.icon" alt="">
                  <span>{{item.name}}</span>
                </div>
                <i class="selected-icon" v-if="networkIndex===index"></i>
              </div>
            </template>
          </b-dropdown-item>
        </b-dropdown>

      </b-form-group>
      <b-form-group id="input-group-1"
                    :label="$t('asset.yourSteemAccount')"
                    label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.account"
          :placeholder="$t('asset.inputAccount')"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2"
                    :label="$t('asset.assetProperties')"
                    label-for="input-2">
        <div class="font12 text-grey-light" style="margin: -.6rem 0 .4rem">{{ $t('asset.assetName') }}</div>
        <b-form-input
          id="input-2"
          v-model="form.assetName"
          :placeholder="$t('asset.inputAssetName')"
          required
        ></b-form-input>
      </b-form-group>
      <button class="primary-btn" @click="register" :disabled="registring">
        <b-spinner small type="grow" v-show="registring" />
        {{ $t('asset.register') }}
      </button>
    </div>
    <!-- <div class="text-grey-light font16 mt-3">Assetld:0x1242222xshjdh32721</div> -->
  </div>
</template>

<script>
import { registerSteemHiveAsset, getRegitryAssets } from '@/utils/web3/asset'
import { handleApiErrCode } from '@/utils/helper'
import { ASSET_LOGO_URL } from '@/constant'

export default {
  name: 'DelegationForm',
  data () {
    return {
      registring: false,
      form: {
        account: '',
        assetName: '',
        chainId: 1
      },
      networkIndex: 0,
      networkOptions: [
        { name: 'Steem', icon: ASSET_LOGO_URL.steem },
        { name: 'Hive', icon: ASSET_LOGO_URL.hive }
      ]
    }
  },
  methods: {
    async register() {
      this.form.chainId = this.networkIndex + 1
      console.log(this.form);
      try{
        this.registring = true
        const hash = await registerSteemHiveAsset(this.form)
        // update cache
        await getRegitryAssets(true)
        console.log(13487, hash);
        this.$bvToast.toast(this.$t('tip.registryAssetSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.form = {
          account: '',
           assetName: '',
           chainId:1
        }
        this.networkIndex = 0
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.registring = false
      }
    }
  },
}

</script>

<style scoped lang="scss">
@import "src/static/css/form";
.d-form {
  max-width: 500px;
  margin: auto;
}
label {
  margin-bottom: .2rem!important;
}
.c-dropdown {
  width: 100%;
  height: 2.4rem;
  .btn img {
    width: 1.4rem;
    height: 1.4rem;
    margin-right: .6rem;
  }
  .btn span {
    color: #242629;
  }
  .dropdown-item img {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: .8rem;
  }
  .selected-icon {
    @include icon;
    background-image: url("~@/static/images/selected-gray.png");
  }
}
</style>
