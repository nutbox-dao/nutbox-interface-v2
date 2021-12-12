<template>
  <div class="bsc-pool-modal position-relative">
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <i class="modal-back-icon" @click="$emit('back')"></i>
        <div class="mt-2 mb-4 text-center">Create staking pool on BSC</div>
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group">
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
          <div v-if="searchResult==='error'" class="text-center">地址输入错误</div>
          <div v-if="provideName && provideSymbol"
               @click="$emit('confirm')">
            <TokenItem class="my-3"
                       logo="https://cdn.wherein.mobi/nutbox/v2/1634804654420"
                       token-name="Peanut"
                       token-symbol="PNUT"
                       token-address="0x1111111111111111111111111"/>
          </div>
        </template>
        <div class="mt-5 mb-2 mx-auto divide-line font-bold text-center text-grey-5">OR</div>
        <div class="mb-4 text-center text-grey-5">Choose a token as cToken</div>
        <div style="cursor: pointer" v-for="token of 13" :key="token" @click="$emit('confirm')">
          <TokenItem class="my-3"
                     logo="https://cdn.wherein.mobi/nutbox/v2/1634804654420"
                     token-name="Peanut"
                     token-symbol="PNUT"
                     token-address="0x1111111111111111111111111"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenItem from '@/components/community/TokenItem'
export default {
  name: 'StakingBSCPool',
  components: { TokenItem },
  data () {
    return {
      loading: false,
      searchResult: '',
      provideLogo: null,
      provideName: null,
      provideSymbol: null,
      provideAddress: null
    }
  },
  methods: {
    checkTokenAddress () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.provideName = 'Pnut'
        this.provideSymbol = 'Pnut'
        // this.searchResult = 'error'
      }, 2000)
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
