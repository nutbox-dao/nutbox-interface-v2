<template>
  <div class="position-relative">
    <i class="modal-close-icon-right" @click="hide"></i>
    <div class="modal-title font20 font-bold" >
      {{
        operate === "add"
          ? $t("stake.creaseDelegation")
          : $t("stake.increaseDelegation")
      }}
    </div>
    <div style="color: red;" class="font-bold font20 line-height28 text-center mt-2">You're using hive account: {{ hiveAccount }} to delegate</div>
    <div class="custom-form">
      <div class="input-group-box mb-3">
        <div class="label text-right">
          <span></span>
          <span class="text-right font20">{{ $t('wallet.balance') }}: {{ (operate === 'add' ? formBalance : formStaked) | amountForm }}</span>
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
      <button class="dark-btn  mx-3" @click="hide" :disabled='loading'>{{
            $t("operation.cancel")
          }}</button>
      <button class="primary-btn mx-3" @click="confirm" :disabled='loading'><b-spinner small type="grow" v-show="loading"></b-spinner
      >{{ $t("operation.confirm") }}</button>
    </div>
    <div class="text-center text-grey-light font14 mt-2">{{ $t("commen.delegateFee") }}： {{ fee }} HIVE</div>
    <!-- <div class="text-center mb-2 mt-4 hover-blue" @click="getSp">{{ $t("stake.getSp") }}</div> -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { handleApiErrCode } from '../../utils/helper';
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { getAllCommunities } from '@/utils/web3/community'
import { HIVE_STAKE_FEE } from '@/config'
import { getDelegateFromHive, hiveDelegation } from '@/utils/hive/hive'
import { ethers } from 'ethers'

export default {
  name:'HPStakingModal',
  data () {
    return {
      stakingValue: '',
      loading: false,
      fee: HIVE_STAKE_FEE
    }
  },
  computed: {
    ...mapState('pool', ['userStaked']),
    ...mapState('currentCommunity', ['communityId']),
    ...mapState('hive', ['hiveAccount', 'hiveBalance', 'vestsToHive', 'vestsBalance']),
    ...mapState('web3', ['userStakings', 'account']),
    ...mapState('user', ['userGraphInfo']),
    ...mapGetters('hive', ['hpBalance']),
    staked(){
      if (!this.userStaked) return 0;
      return this.userStaked[this.pool.id] ?? 0
    },
    formBalance(){
      return this.hpBalance;
    },
    formStaked(){
      const staked = this.staked;
      return (staked.toString() / 1e6) * this.vestsToHive;
    }
  },
  props: {
    operate: {
      type: String,
      default: "add",
    },
    pool: {
      type: Object
    }
  },
  methods: {
    ...mapActions('hive', ['getHive', 'getVests']),
    hide() {
      if (this.loading) return;
      this.$emit("hideStakeMask");
    },
    fillMax(){
      if(this.loading) return;
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
    checkDelegateFee() {
      if (this.hiveBalance >= this.fee){
        return true;
      }
      this.$bvToast.toast(this.$t('error.delegateeroor'), {
        title: this.$t('error.notEnoughFee'),
        variant: 'info'
      })
      return false
    },
    async confirm(){
      if (!this.checkInputValue()) return;
      if (!this.checkDelegateFee()) return;
      let hp = 0;
      this.loading = true;
      const haveDelegated = await getDelegateFromHive(this.hiveAccount, ethers.utils.parseBytes32String(this.pool.asset))
      if (haveDelegated < 0) {
        this.$bvToast.toast(this.$t('error.delegateerror'), {
          title:this.$t('error.pleaseRetry'),
          variant: 'info'
        })
        this.loading = false
        return false
      }
      if (this.operate === 'add') {
        hp = parseFloat(haveDelegated) + parseFloat(this.stakingValue)
      } else {
        hp = parseFloat(haveDelegated) - parseFloat(this.stakingValue)
        hp = hp < 0 ? 0 : hp
      }
      this.delegateHp(hp);
    },
    async delegateHp(hp) {
      try{
        hp = parseFloat(hp)
        if ((hp !== 0 && !this.checkInputValue()) || !this.checkDelegateFee()){
          return;
        }
        const amount = parseFloat(hp / this.vestsToHive).toFixed(6);
        const res = await hiveDelegation(
          this.hiveAccount,
          ethers.utils.parseBytes32String(this.pool.asset),
          amount,
          this.pool.id,
          this.account
        )
        if (res.success === true){
          if (this.userGraphInfo.inCommunities.map(c => c.id).indexOf(this.communityId.toLowerCase()) === -1){
            // first join
            getAllCommunities(true)
            getMyJoinedCommunity()
          }
          this.getVests();
          this.getHive();
          this.$bvToast.toast('Delegate success! The data will be update after 1 or 2 mins later, please wait', {
            title:this.$t('tip.success'),
            variant: 'success',
            autoHideDelay: 7000,
          })
          setTimeout(() => {
            this.$emit("hideStakeMask");
          }, 4000)
        }
      }catch(e){
        console.log('Delegate hp fail5', e);
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.loading = false
      }
    },
  },
  mounted () {
    // get user's balance
    this.getHive().then(console.log)
    this.getVests()
  },
}
</script>

<style lang="scss" scoped>
@import "src/static/css/modal";
@import "src/static/css/form";
</style>
