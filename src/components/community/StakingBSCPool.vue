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
        <div @click="$emit('confirm')">
          <TokenItem class="my-3"
                     logo="https://cdn.wherein.mobi/nutbox/v2/1634804654420"
                     token-name="Peanut"
                     token-symbol="PNUT"
                     token-address="0x1111111111111111111111111"/>
        </div>
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
      provideAddress: null
    }
  },
  methods: {
    checkTokenAddress () {}
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.bsc-pool-modal-content {
  height: 60vh;
}
</style>
