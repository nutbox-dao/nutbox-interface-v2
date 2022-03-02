<template>
  <div class="bsc-pool-modal position-relative">
<!--    <i class="modal-back-icon" @click="$emit('back')"></i>-->
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <div class="my-4 modal-title">Create staking pool on {{chainName}}</div>
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group c-input-group-bg-dark c-input-group-border">
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full"
                       :placeholder="$t('asset.tokenAddress')"
                       @keyup="checkTokenAddress"
                       v-model="provideAddress"></b-input>
            </b-input-group>
            <div class="c-append">
              <i class="search-icon" @click="checkTokenAddress"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 mx-auto flex-fill overflow-auto">
        <div v-if="loading" class="text-center">
          <b-spinner label="Spinning"></b-spinner>
        </div>
        <template v-else>
          <div v-if="!searchResult" class="text-center font14 text-grey-7">No search token</div>
          <div class="hover" v-else
               @click="$emit('confirm', searchResult)">
            <TokenItem class="my-3"
                       :logo="searchResult.icon"
                       :token-name="searchResult.name"
                       :token-symbol="searchResult.symbol"
                       :token-address="searchResult.address"/>
          </div>
        </template>
        <div class="my-3 mx-auto divide-line font14 line-height14 text-center">OR</div>
        <div class="font14 line-height14 text-center text-grey-7 mb-3">Choose a token as cToken</div>
        <div class="token-list-card mb-2">
          <div class="list-item"  v-for="token of recommendToken" :key="token.address" @click="$emit('confirm', token)">
            <TokenItem :logo="token.icon"
                       :token-name="token.name"
                       :token-symbol="token.symbol"
                       :token-address="token.address"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenItem from '@/components/community/TokenItem'
import { mapState } from 'vuex'
import { getERC20Info } from '@/utils/web3/asset'
import { BSC_CHAIN_NAME } from '@/config'
import { ethers } from 'ethers'

export default {
  name: 'StakingBSCPool',
  components: { TokenItem },
  data () {
    return {
      loading: false,
      searchResult: null,
      provideLogo: null,
      provideName: null,
      provideSymbol: null,
      provideAddress: null,
      chainName: BSC_CHAIN_NAME,
    }
  },
  computed: {
    ...mapState('web3', ['allTokens']),
    recommendToken() {
      if (!this.allTokens || this.allTokens.length === 0) return [];
      return this.allTokens.filter(t => t.isRecommend)
    }
  },
  methods: {
    async checkTokenAddress () {
      if (!ethers.utils.isAddress(this.provideAddress)) return;
      this.loading = true
      try{
        const token = await getERC20Info(this.provideAddress);
        this.searchResult = token
      }catch(err){
        this.searchResult = null
      }finally {
        this.loading = false
      }
    }
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
    linear-gradient(to right, var(--card-broder), var(--card-broder));;
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
</style>
