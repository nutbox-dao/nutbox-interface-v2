<template>
  <div class="">
    <div class="text-right">
      <img class="modal-close-icon" src="~@/static/images/close.svg" alt="" @click="hide"/>
    </div>
    <div class="text-center font20 font-bold" >
      {{
        operate === "add"
          ? $t("stake.stake")
          : $t("stake.unStake")
      }}
    </div>
    <div class="custom-form my-3">
      <div class="input-group-box mb-4">
        <div class="label">
          <span class="text-right">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : formStaked) | amountForm }}</span>
        </div>
        <div class="c-input-group input-border d-flex">
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
      <button class="primary-btn outline-btn mx-3" @click="hide" :disabled='loading'>{{
            $t("operation.cancel")
          }}</button>
      <button class="primary-btn mx-3" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
            >{{ $t("operation.confirm") }}</button>
    </div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deposit, withdraw } from '@/utils/web3/pool'
import { handleApiErrCode } from '../../utils/helper';
import { getERC20Balance } from '@/utils/web3/asset'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'

export default {
  data () {
    return {
      stakingValue: '',
      loading: false,
      balance: 0
    }
  },
  computed: {
    ...mapState('pool', ['userStaked']),
    ...mapState('web3', ['userGraphInfo']),
    ...mapState('currentCommunity', ['communityId']),
    staked(){
      if (!this.userStaked) return 0;
      return this.userStaked[this.card.id] ?? 0
    },
    formBalance(){
      const balance = this.balance;
      return parseFloat(balance.toString() / (1e18));
    },
    formStaked(){
      const staked = this.staked;
      return parseFloat(staked.toString() / (1e18))
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
        this.operate === "add" ? this.formBalance : this.formStaked;
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
          await deposit(this.card.id, this.stakingValue)
          message = this.$t('transaction.depositOk')
        }else{
          await withdraw(this.card.id, this.stakingValue)
          message = this.$t('transaction.withdrawOk')
        }
        this.$bvToast.toast(message, {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          if (this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
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
    // get user's balance
    console.log(this.userGraphInfo);
    this.balance = await getERC20Balance(this.card.asset)
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
