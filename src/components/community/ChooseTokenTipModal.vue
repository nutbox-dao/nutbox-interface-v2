<template>
  <div class="token-tip-modal text-center">
    <div class="font20 line-height24">You have choose <span class="text-primary-0 font20">{{ symbol }}</span> as community token.</div>
    <div class="font20 line-height24">
      Before distribution, you need deposit enough
      <span class="text-primary-0 font20">{{ symbol }}</span>
      to the community
    </div>
    <div class="font20 line-height24">You can do it now, or later in the community management page.</div>
    <div class="custom-form mt-4">
      <b-form-group
        class="mb-4"
        label-class="overflow-hidden"
        label-cols-md="2"
        content-cols-md="10"
        label="Amount"
      >
        <div class="d-flex">
          <div class="c-input-group c-input-group-border c-input-group-bg-dark">
            <b-form-input v-model="value"></b-form-input>
          </div>
          <button class="primary-btn w-auto px-3 ml-3" :disabled="depositing" @click="deposit">
            <b-spinner
              small
              type="grow"
              v-show="depositing"
            ></b-spinner>
            Deposit
          </button>
        </div>
      </b-form-group>
      <div class="col-md-6 offset-md-3">
        <button class="primary-btn" :disabled="depositing" @click="$emit('close')">OK</button>
      </div>
    </div>

  </div>
</template>

<script>
import { chargeCommunityBalance } from '@/utils/web3/community'
import { mapState } from 'vuex'
import { handleApiErrCode, sleep } from '@/utils/helper'

export default {
  name: 'ChooseTokenTipModal',
  data() {
    return {
      value: '',
      depositing: false
    }
  },
  computed: {
    ...mapState('community', ['communityInfo']),
    symbol() {
      if (this.communityInfo && this.communityInfo.cToken) {
        return this.communityInfo.cToken.symbol
      }
    }
  },
  mounted () {
  },
  methods: {
    async deposit() {
      try{
        this.depositing = true;
        await chargeCommunityBalance(this.value);
        this.$bvToast.toast("Deposit successfull!", {
          title: "Successs",
          variant: 'success'
        })
        await sleep(3);
        this.$emit('close');
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally {
        this.depositing = false
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.token-tip-modal {
  font-weight: 500;
}
</style>
