<template>
  <div class="bsc-pool-modal position-relative">
<!--    <i class="modal-back-icon" @click="$emit('back')"></i>-->
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="mb-3">
        <div class="my-4 modal-title">Create staking NFT(ERC1155) pool on {{chainName}}</div>
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group c-input-group-bg-dark c-input-group-border">
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full"
                       :placeholder="$t('asset.tokenAddress')"
                       @keyup="checkTokenAddress"
                       v-model="provideAddress"></b-input>
            </b-input-group>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="custom-form col-lg-8 mx-auto">
          <div class="c-input-group c-input-group-bg-dark c-input-group-border">
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full"
                      number
                      step="1"
                      :placeholder="$t('asset.tokenId')"
                      v-model="provideId"></b-input>
            </b-input-group>
          </div>
        </div>
        <div class="col-lg-8 mx-auto mt-3 red font14" style="color: red" v-show="showIllegalToken">
          {{ $t('asset.notErc1155') }}
        </div>
        <div class="col-lg-8 mx-auto mt-3 red font14" style="color: red" v-show="showIllegalTokenId">
          {{ $t('asset.wrongTokenId') }}
        </div>
      </div>
      <div class="col-md-6 mx-auto mt-3">
          <button class="primary-btn" :disabled="isChecking" @click="confirm">
            <b-spinner small type="grow" v-show="isChecking"></b-spinner>
            Confirm
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import TokenItem from '@/components/community/TokenItem'
import { isErc1155 } from '@/utils/web3/erc1155'
import { BSC_CHAIN_NAME } from '@/config'
import { ethers } from 'ethers'
import { isPositiveInt } from '@/utils/helper'

export default {
  name: 'StakingNFTPool',
  components: { TokenItem },
  data () {
    return {
      loading: false,
      searchResult: null,
      provideLogo: null,
      provideName: null,
      provideSymbol: null,
      provideAddress: null,
      provideId: null,
      chainName: BSC_CHAIN_NAME,
      showIllegalToken: false,
      showIllegalTokenId: false,
      isChecking: false
    }
  },
  methods: {
    async checkTokenAddress () {
      if (!ethers.utils.isAddress(this.provideAddress)) return;
      this.loading = true
      try{
        const token = await isErc1155(this.provideAddress);
        this.searchResult = token
      }catch(err){
        this.searchResult = false
      }finally {
        this.loading = false
      }
    },
    checkTokenId () {
      return isPositiveInt(this.provideId)
    },
    async confirm () {
      try{
        this.isChecking = true
        this.showIllegalToken = false
        this.showIllegalTokenId = false
        if (!this.checkTokenId()) {
          this.showIllegalTokenId = true
          return;
        }
        await this.checkTokenAddress()
        if (this.searchResult) {
          // this.asset = this.provideAddress + ethers.utils.hexZeroPad(ethers.utils.hexlify(this.provideId), 32).substring(2);
          this.$emit('confirm', this.provideAddress, parseInt(this.provideId))
        }else {
          this.showIllegalToken = true;
        }
      } catch (e) {
        
      } finally {
        this.isChecking = false
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
