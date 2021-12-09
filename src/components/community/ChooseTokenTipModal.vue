<template>
  <div class="token-tip-modal">
    <div class="">You have choose <span class="text-primary-0 font20">{{ symbol }}</span> as community token.</div>
    <div class="my-3">
      Before distribution, you need deposit enough
      <span class="text-primary-0 font20">{{ symbol }}</span>
      to the community
    </div>
    <div>You can do it now, or later in the community management page.</div>
    <div class="custom-form mt-4">
      <b-form-group
        class="mb-4"
        label-class="overflow-hidden"
        label-cols-md="2"
        content-cols-md="10"
        label="Amount"
      >
        <div class="d-flex">
          <b-form-input class="input-border" v-model="value"></b-form-input>
          <button class="primary-btn w-auto px-3 ml-3" :disabled="depositing">
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
        <button class="primary-btn" @click="$emit('close')">OK</button>
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
      if (this.communityInfo && this.communityityInfo.cToken) {
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
  font-weight: 200;
  padding: 3rem;
}
</style>
