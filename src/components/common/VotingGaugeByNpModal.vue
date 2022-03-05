<template>
  <div class="position-relative">
    <i class="modal-close-icon-right" @click="hide"></i>
    <div class="modal-title font20 font-bold" >
      {{
        operate === "add"
          ? $t("gauge.vote")
          : $t("gauge.unvote")
      }}
    </div>
    <div class="custom-form my-3">
      <div class="input-group-box mb-4">
        <div class="label text-right font20">
          <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? freeNp : userLocked[this.card.id]) | amountForm }}</span>
        </div>
        <div class="c-input-group c-input-group-border c-input-group-bg-dark d-flex">
          <input style="flex: 1"
                 type="number"
                 v-model="stakingValue"
                 placeholder="0"
          />
          <div class="c-append">
            <button class="primary-btn input-btn px-2" style="height: 1.6rem"
                    @click="fillMax">{{ $t("commen.max") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex" style="margin: 0 -1rem">
      <button class="dark-btn mx-3" @click="hide" :disabled='loading'>{{
            $t("operation.cancel")
          }}</button>
      <button class="primary-btn mx-3" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
      >{{ $t("operation.confirm") }}</button>
    </div>
    <div v-if="takeFee" class="font14 my-1" style="text-align:center">
          {{ `Operation fee: ${fee} NUT` }}
        </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { vote, unvote } from '@/utils/nutbox/gauge'
import { handleApiErrCode } from '../../utils/helper';
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
    }
  },
  computed: {
    ...mapState('pool', ['userStaked']),
    ...mapState('user', ['userGraphInfo']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapState('gauge', ['userLocked', 'totalLocked', 'userRewardNut', 'userRewardCtoken', 'gaugeRatio']),
    ...mapState('np', ['npApr', 'npPrice', 'freeNp']),
    ...mapState('web3', ['fees']),
    ...mapGetters('web3', ['tokenDecimals']),
    fee() {
      if (this.fees){
        return this.fees['USER'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['USER'] > 0
      }
      return false
    }
  },
  props: {
    operate: {
      type: String,
      default: "add",
    },
    card: {
      type: Object
    }
  },
  methods: {
    hide() {
      if (this.loading) return;
      this.$emit("hideStakeMask");
    },
    fillMax(){
        this.stakingValue =
        this.operate === "add" ? this.freeNp : this.userLocked[this.card.id];
    },
    checkInputValue() {
      const reg = /^\d+(\.\d+)?$/;
      const res =
        reg.test(this.stakingValue) && parseFloat(this.stakingValue) > 0;
      if (!res) {
        this.$bvToast.toast(this.$t('error.inputError'), {
          title: this.$t("error.error"),
          variant: 'info'
        })
      }
      return res;
    },
    async confirm(){
      if (!this.checkInputValue()) return;
      this.loading = true;
      try{
        let message;
        if (this.operate === 'add'){
          await vote(this.card.id, this.stakingValue)
          message = this.$t('transaction.depositOk')
        }else{
          await unvote(this.card.id, this.stakingValue)
          message = this.$t('transaction.withdrawOk')
        }
        this.$bvToast.toast(message, {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          if (!this.userGraphInfo.inCommunities || this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
            // first join
            getAllCommunities(true)
            getMyJoinedCommunity()
          }
          this.$emit("hideStakeMask");
        }, 3000);
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.loading = false
      }
    },
  },
  async mounted () {
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
