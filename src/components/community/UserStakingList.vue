<template>
  <div>
    <div class="c-header-grid py-3 px-4">
      <div class="d-flex align-items-center" style="grid-area: avatar">
        <div class="logo-group mr-3">
          <img
            class="logo1"
            :src="getCommunityInfoById(pool.community.id).icon"
            alt=""
          />
          <img class="logo2" :src="tokenIcons[pool.asset]" alt="" />
        </div>
        <div class="h-100 d-flex flex-column justify-content-between">
          <div class="font-bold">
            {{ getCommunityInfoById(pool.community.id).name }}
          </div>
          <div class="font14">{{ pool.name }}</div>
        </div>
      </div>
      <div class="value-box d-flex" style="grid-area: value">
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">{{ cToken ? cToken.symbol : "" }} Earned</div>
          <div class="font-bold">{{ pendingReward | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">APR</div>
          <div class="font-bold">90.12%</div>
        </div>
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">Total Staking</div>
          <div class="font-bold">{{ totalDeposited | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">TVL</div>
          <div class="font-bold">$23413</div>
        </div>
      </div>
      <div
        class="d-flex px-3 justify-content-between align-items-center action-box"
        style="grid-area: action"
      >
        <span class="text-primary-0">{{ type }}</span>
        <div
          v-b-toggle="'accordion' + pool.id"
          class="toggle-btn text-primary-0 font14"
        >
          <span class="when-open">Hide</span>
          <span class="when-closed">Detail</span>
        </div>
      </div>
    </div>
    <b-collapse :id="'accordion' + pool.id" visible>
      <div class="collapse-content-grid font16 py-3 px-4">
        <div class="link-box text-primary-0" style="grid-area: link">
          <div class="d-flex align-items-center">
            {{ getCommunityInfoById(pool.community.id).name }}
            <i class="mx-2"></i>
            <i class="link-icon" @click="gotoCommunity"></i>
          </div>
          <div class="d-flex align-items-center">
            <span>{{ cToken ? cToken.symbol : "" }} Contract</span>
            <i class="copy-icon mx-2" @click="copy(cToken.address)"></i>
            <i class="link-icon" @click="gotoContract(cToken.address)"></i>
          </div>
          <div v-if="stakeToken.symbol" class="d-flex align-items-center">
            <span>{{ stakeToken ? stakeToken.symbol : "" }} Contract</span>
            <i class="copy-icon mx-2" @click="copy(stakeToken.address)"></i>
            <i class="link-icon" @click="gotoContract(stakeToken.address)"></i>
          </div>
        </div>
        <div
          class="content-box d-flex align-items-center justify-content-between p-2"
          style="grid-area: card1"
        >
          <div>
            <div class="font-bold">
              {{ cToken ? cToken.symbol : "" }} Earned
            </div>
            <div class="font12">{{ pendingReward | amountForm }}</div>
          </div>
          <button
            class="primary-btn w-auto px-2 mx-0"
            @click="withdraw"
            :disabled="isWithdrawing"
          >
            <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
            Harvest
          </button>
        </div>
        <div
          class="content-box d-flex align-items-center justify-content-between p-2"
          style="grid-area: card2"
        >
          <template v-if="isApproved">
            <div>
              <div class="font-bold">
                {{
                  type === homeName
                    ? stakeToken.symbol + " Staked"
                    : type === "STEEM"
                    ? "SP Delegated"
                    : "HP Delegated"
                }}
              </div>
              <div class="font12">{{ staked | amountForm }}</div>
            </div>
            <div class="content-btn-group d-flex">
              <button class="symbol-btn w-auto px-2 mx-0">-</button>
              <button
                class="symbol-btn w-auto px-2 mr-0 ml-2"
                :disabled="pool.status === 'CLOSED'"
              >
                +
              </button>
            </div>
          </template>
          <button v-else class="primary-btn mx-3">Approve</button>
        </div>
        <div
          style="grid-area: type"
          class="d-flex justify-content-center align-items-center"
        >
          <!-- <span class="type-box text-primary-0 px-2">BSC</span> -->
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { approvePool, withdrawReward, getPoolType } from "@/utils/web3/pool";
import { CHAIN_NAME } from "@/config";
import { handleApiErrCode } from "@/utils/helper";
import showToastMixin from '@/mixins/copyToast'

export default {
  name: "",
  props: {
    pool: {
      type: Object,
    },
  },
  data() {
    return {
      homeName: CHAIN_NAME,
      isWithdrawing: false,
    };
  },
  mixins: [showToastMixin],
  computed: {
    ...mapGetters("community", ["getCommunityInfoById"]),
    ...mapState("web3", ["tokenIcons", "allTokens"]),
    ...mapState("pool", [
      "totalStaked",
      "userStaked",
      "approvements",
      "userReward",
      "loadingApprovements",
    ]),
    poolStatus() {
      return this.pool.status === "OPENED" ? "active" : "";
    },
    type() {
      return getPoolType(this.pool.poolFactory, this.pool.chainId);
    },
    community() {},
    isApproved() {
      return false;
    },
    cToken() {
      const token = this.allTokens.filter(
        (t) => t.address.toLowerCase() == this.pool.community.cToken
      )[0];
      return token;
    },
    stakeToken() {
      console.log(this.type, this.allTokens);
      if (this.type !== CHAIN_NAME || !this.allTokens) return {};
      const token = this.allTokens.filter(
        (t) => t.address.toLowerCase() == this.pool.asset
      )[0];
      return token;
    },
    staked() {
      if (!this.userStaked) return 0;
      const stakedBn = this.userStaked[this.pool.id];
      if (!stakedBn) return 0;
      if (this.type === CHAIN_NAME) {
        return stakedBn.toString() / 1e18;
      } else if (this.type === "STEEM") {
        return (stakedBn.toString() / 1e6) * this.vestsToSteem;
      } else if (this.type === "HIVE") {
        return (stakedBn.toString() / 1e6) * this.vestsToHive;
      }
    },
    pendingReward() {
      if (!this.userReward) return 0;
      const pendingBn = this.userReward[this.pool.id];
      if (!pendingBn) return 0;
      if (this.type === CHAIN_NAME) {
        return pendingBn.toString() / 1e18;
      } else if (this.type === "STEEM") {
        return (pendingBn.toString() / 1e6) * this.vestsToSteem;
      } else if (this.type === "HIVE") {
        return (pendingBn.toString() / 1e6) * this.vestsToHive;
      }
    },
    totalDeposited() {
      if (!this.totalStaked) return 0;
      const total = this.totalStaked[this.pool.id];
      if (!total) return 0;
      if (this.type === CHAIN_NAME) {
        return total.toString() / 1e18;
      } else if (this.type === "STEEM") {
        return (total.toString() / 1e6) * this.vestsToSteem;
      } else if (this.type === "HIVE") {
        return (total.toString() / 1e6) * this.vestsToHive;
      }
      return 0;
    },
  },
  methods: {
    formatUserAddress(address, long = true) {
      if (!address) return "Loading Account";
      if (long) {
        if (address.length < 16) return address;
        const start = address.slice(0, 28);
        const end = address.slice(-5);
        return `${start}...`;
      } else {
        const start = address.slice(0, 6);
        const end = address.slice(-6);
        return `${start}...${end}`;
      }
    },
    copy(address) {
      this.onCopy(
        this.$t("tip.copyAddress", {
          address: this.formatUserAddress(address),
        }),
        { title: this.$t("tip.clipboard") }
      );
    },
    gotoCommunity() {
        console.log(2);
    },
    gotoContract(address) {
        window.open('https://goerli.etherscan.io/address/' + address, '_blank')
    },
    async withdraw() {
      try {
        this.isWithdrawing = true;
        await withdrawReward(this.pool.community.id, this.pool.id);
        this.$bvToast.toast(this.$t("tip.withdrawSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isWithdrawing = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(0);
}
.c-header-grid {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-areas: "avatar value action";
  .value-box .item {
    flex-direction: column;
    flex: 1;
  }
  .collapsed > .when-open,
  .not-collapsed > .when-closed {
    display: none;
  }
  .toggle-btn {
    width: 3rem;
    text-align: center;
    span {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    span:after {
      content: "";
      @include icon();
      background-image: url("~@/static/images/arrow-primary-icon.svg");
      margin: 0 0.2rem;
    }
    .when-open:after {
      transform: rotate(180deg);
    }
  }
}
.collapse-content-grid {
  background: var(--block-bg);
  display: grid;
  grid-template-columns: 34% 28% 28% 10%;
  grid-template-areas: "link card1 card2 type";
  .link-icon {
    @include icon(0.8rem, 0.8rem);
    background-image: url("~@/static/images/link-primary-icon.svg");
    cursor: pointer;
  }
  .copy-icon {
    @include icon(1rem, 1rem);
    background-image: url("~@/static/images/copy-primary-icon.svg");
    cursor: pointer;
  }
  .content-box {
    border: 1px solid var(--input-border);
    border-radius: 0.8rem;
    margin: 0 0.2rem;
    .primary-btn {
      height: 2rem;
      border-radius: 0.4rem;
    }
    .symbol-btn {
      height: 2rem;
      max-height: 2rem;
      width: 2rem;
      min-width: 2rem;
      color: white;
      border-radius: 0.4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--primary-custom);
      border: none;
      font-size: 1.4rem;
    }
  }
  .type-box {
    border: 1px solid var(--primary-custom);
    border-radius: 0.4rem;
  }
}

@media (max-width: 768px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "avatar action"
      "value value";
    .value-box {
      margin-top: 0.5rem;
    }
    .action-box {
      margin-top: 0.5rem;
    }
  }
  .collapse-content-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "link type"
      "card1 card2";
  }
}
@media (max-width: 500px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(3, auto);
    grid-template-areas:
      "avatar"
      "action"
      "value";
    .value-box {
      flex-direction: column;
      .item {
        flex-direction: row;
      }
    }
    .toggle-btn span {
      flex-direction: row;
    }
  }
  .collapse-content-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: repeat(3, auto);
    grid-template-areas:
      "link type"
      "card1 card1"
      "card2 card2";
    .content-box {
      margin: 0.2rem 0;
    }
  }
}
.logo-group {
  display: flex;
  align-items: flex-end;
  width: 3.8rem;
  margin-right: 0.4rem;
  .logo1 {
    @include card-icon;
  }
  .logo2 {
    margin-left: -0.8rem;
    @include card-icon(1.8rem, 1.8rem);
  }
}
</style>
