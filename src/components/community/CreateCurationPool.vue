<template>
  <div class="bsc-pool-modal position-relative">
<!--    <i class="modal-back-icon" @click="$emit('back')"></i>-->
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <div class="my-4 modal-title">{{ $t('pool.createCurationPool', {chainName}) }}</div>
        <div class="col-lg-8 mx-auto mb-3">
          {{ $t('pool.recipientDescription') }}
        </div>
        <div class="custom-form col-lg-8 mx-auto mb-5">
          <div class="c-input-group c-input-group-bg-dark c-input-group-border">
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full"
                       :placeholder="$t('placeHolder.inputRecipientAddress')"
                       @keyup="checkTokenAddress"
                       v-model="form.provideAddress"></b-input>
            </b-input-group>
          </div>
        </div>
        <div class="col-lg-8 mx-auto mb-3">
          {{ $t('pool.poolDescription') }}
        </div>
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group c-input-group-bg-dark c-input-group-border">
            <b-input-group class="d-flex flex-between-center h-20">
              <b-textarea class="flex-full"
                       :placeholder="$t('placeHolder.inputPoolDesc')"
                       v-model="form.provideDesc"></b-textarea>
            </b-input-group>
          </div>
        </div>
        <button
            class="primary-btn col-lg-8 mx-auto mt-5"
            @click="$emit('confirm', form)"
          >
            {{ $t('operation.confirm') }}
          </button>
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
  name: 'CreateCurationPool',
  components: { TokenItem },
  data () {
    return {
      loading: false,
      chainName: BSC_CHAIN_NAME,
      form: {
        provideDesc: null,
        provideAddress: null,
      }
    }
  },
  computed: {
    
  },
  methods: {
    async checkTokenAddress () {
      if (ethers.utils.isAddress(this.provideAddress)) return true;
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
