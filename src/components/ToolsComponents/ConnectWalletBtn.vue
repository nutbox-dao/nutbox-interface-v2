<template>
  <div class="connect-wallet">
    <button
      class="login-btn primary-btn"
      style="width:90%"
      @click="unlock"
      :disabled="isConnecting"
      v-if="showBtn"
    >
    <b-spinner small type="grow" v-show="isConnecting"></b-spinner>
      {{
        btnName
      }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { sleep } from '@/utils/helper'

export default {
  name: "ConnectWalletBtn",
  data() {
    return {
      isConnecting:false,
      btnName: ''
    };
  },
  props: {
    type: {
      type: String,
      default: "STEEM",
    },
    width: {
      type: String,
      default: "272"
    }
  },
  computed: {
    ...mapState('steem', ["steemAccount"]),
    ...mapState('hive', ['hiveAccount']),
    showBtn(){
      switch (this.type){
        case 'STEEM':
          return !this.steemAccount || this.steemAccount.length === 0
        case 'HIVE':
          return !this.hiveAccount || this.hiveAccount.length === 0
        default:
          return true
      }
    }
  },
  methods: {
    async unlock() {
      if (this.type === "STEEM") {
        this.$emit("steemLogin");
      } else if (this.type === 'HIVE') {
        // loading
        this.$emit("hiveLogin");
      }
    },
  },
  mounted () {
    switch(this.type){
      case 'STEEM':
        this.btnName = this.$t("wallet.connectSteem")
        break;
      case 'HIVE':
        this.btnName = this.$t("wallet.connectHive")
    }
  },
};
</script>

<style lang="scss" scoped>
button {
  margin-top: 24px;
  width: 272px;
  height: 48px;
}
</style>
