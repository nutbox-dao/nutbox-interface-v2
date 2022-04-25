<template>
  <div class="bsc-pool-modal position-relative">
    <i class="modal-back-icon" @click="$emit('back')"></i>
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <div class="my-4 modal-title">Create crowdloan pool on {{ chainName }}</div>

        <div class="custom-form col-lg-8 mx-auto">
          <b-form-group id="input-group-0" :label="$t('crowdloan.network')" label-for="dropdown-0">
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
              <b-dropdown-item v-for="(item, index) of networkOptions" :key="item.name" @click="networkIndex = index">
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
          <b-form-group id="input-group-1" :label="$t('crowdloan.parachain')" label-for="dropdown-1">
            <b-dropdown class="c-dropdown" menu-class="full-dropdown-menu">
              <template #button-content>
                <div class="c-dropdown-btn flex-between-center">
                  <div class="flex-full flex-start-center text-left">
                    <img v-show="Object.keys(selectParachain).length > 0"
                      :src="selectParachain.logo" alt="" />
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
                <div v-if="onliningCrowdloan.length === 0" class="text-center text-grey-light font12 my-2">{{
                  $t('tip.noProject')
                }}</div>
                <b-dropdown-item v-for="(item, index) of onliningCrowdloan" :key="index"
                  @click="selectParachain = item">
                  <template #default>
                    <div class="flex-between-center">
                      <div class="flex-full flex-start-center">
                        <img :src="item.logo" alt="" />
                        <span>{{ item.text }}</span>
                      </div>
                      <i class="selected-icon" v-if="selectParachain === item"></i>
                    </div>
                  </template>
                </b-dropdown-item>
              </template>
            </b-dropdown>
          </b-form-group>
          
          <button class="primary-btn mt-5" @click="$emit('confirm', networkIndex, selectParachain)">
            {{ $t("operation.confirm") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { BSC_CHAIN_NAME } from '@/config'
import { ethers } from 'ethers'
import { ASSET_LOGO_URL } from '../../constant'
import { stanfiAddress } from '@/utils/polkadot/account'
import { handleApiErrCode } from '@/utils/helper'
import { namedLogos } from '@polkadot/apps-config';

export default {
  name: 'StakingCrowdloanPool',
  data() {
    return {
      searchResult: null,
      provideLogo: null,
      provideName: null,
      provideSymbol: null,
      provideAddress: null,
      chainName: BSC_CHAIN_NAME,      
      form: {
        chainId: "",
        paraId: "",
        trieIndex: "",
        communityAddress: "",
        assetName: "",
        endingBlock: "",
      },
      selectParachain: {},
      networkIndex: 0,
      networkOptions: [
        {
          name: "Polkadot",
          icon: ASSET_LOGO_URL.polkadot.icon
        },
        {
          name: "Kusuama",
          icon: ASSET_LOGO_URL.kusama.icon
        }
      ]
    }
  },
  watch: {
    networkIndex(newValue, oldnewValue) {
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
    onliningCrowdloan() {
      if (this.networkIndex === 0) {
        console.log(265, this.polkadotFund);
        return this.polkadotFund.filter(f => f.statusIndex === 0).map(f => {
          let logo = namedLogos[f.info]
          if (logo.indexOf('data:image') === -1) {
            logo = logo.replaceAll('/img', 'https://polkadot.js.org/apps/static')
            logo = logo.slice(0, -4) + '.' + logo.slice(-4)
          }
          return {...f, logo}
        })
      } else {
        return this.kusamaFund.filter(f => f.statusIndex === 0).map(f => {
          let logo = namedLogos[f.info]
          if (logo.indexOf('data:image') === -1) {
            logo = logo.replaceAll('/img', 'https://polkadot.js.org/apps/static')
            logo = logo.slice(0, -4) + '.' + logo.slice(-4)
          }
          return {...f, logo}
        })
      }
    },
    loading() {
      return this.networkIndex === 0 ? this.polkadotLoading : this.kusamaLoading
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
      } else {
        return true
      }
      this.$bvToast.toast(tipStr, {
        title: this.$t('tip.tips'),
        variant: 'info'
      })
      return false
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";

.bsc-pool-modal-content {
  height: 60vh;
}

.divide-line {
  width: 50%;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(to right, var(--card-broder), var(--card-broder)),
    linear-gradient(to right, var(--card-broder), var(--card-broder));
  ;
  background-size: 30% 2px, 30% 2px;
  background-position: left center, right center;
}

.token-list-card {
  @include card(20px 0, var(--input-bg), auto, fit-content);
  max-height: 330px;
  border: 1px solid var(--text-74);

  .list-item {
    cursor: pointer;
    padding: .2rem 1.2rem;
  }

  .list-item:hover {
    background-color: #272828;
  }
}

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
