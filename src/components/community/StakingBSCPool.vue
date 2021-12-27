<template>
  <div class="bsc-pool-modal position-relative">
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <i class="modal-back-icon" @click="$emit('back')"></i>
        <div class="mt-2 mb-4 text-center">Create staking pool on BSC</div>
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group c-input-group">
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full"
                       :placeholder="$t('asset.tokenAddress')"
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
          <div v-if="!searchResult" class="text-center">No search token</div>
          <div class="hover" v-else
               @click="$emit('confirm', searchResult)">
            <TokenItem class="my-3"
                       :logo="searchResult.icon"
                       :token-name="searchResult.name"
                       :token-symbol="searchResult.symbol"
                       :token-address="searchResult.address"/>
          </div>
        </template>
        <div class="mt-5 mb-2 mx-auto divide-line font-bold text-center text-grey-5">OR</div>
        <div class="mb-4 text-center text-grey-5">Choose a token as cToken</div>
        <div style="cursor: pointer" v-for="token of recommendToken" :key="token.address" @click="$emit('confirm', token)">
          <TokenItem class="my-3"
                     :logo="token.icon"
                     :token-name="token.name"
                     :token-symbol="token.symbol"
                     :token-address="token.address"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenItem from '@/components/community/TokenItem'
import { mapState } from 'vuex'
import { getERC20Info } from '@/utils/web3/asset'

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
      provideAddress: null
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
</style>
