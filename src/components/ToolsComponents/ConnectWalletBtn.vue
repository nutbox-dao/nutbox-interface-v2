<template>
  <div class="connect-wallet">
    <b-button
      class="login-btn"
      variant="primary"
      :style="'width:'+width+'px;'"
      @click="unlock"
      :disabled="isConnecting"
      v-if="
        !steemAccount || steemAccount.length === 0
      "
    >
    <b-spinner small type="grow" v-show="isConnecting"></b-spinner>
      <!-- <b-button variant="primary" @click="unlock"> -->
      {{
        btnName
      }}
    </b-button>
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
    ...mapState(["steemAccount"]),
  },
  methods: {
    async unlock() {
      if (this.type === "STEEM") {
        this.$emit("steemLogin");
      } else {
        // loading
        this.$emit("tronLogin");
        this.isConnecting = true;
        await sleep(4);
        this.isConnecting= false;
      }
    },
  },
  mounted () {
    switch(this.type){
      case 'STEEM':
        this.btnName = this.$t("wallet.connectSteem")
        break;
      case 'HIVE':
        this.btnName = this.$t("wallet.connectTron")
    }
  },
};
</script>

<style lang="scss" scoped>
.connect-wallet {
  z-index: 999;
}
button {
  margin-top: 24px;
  width: 272px;
  height: 48px;
}
</style>