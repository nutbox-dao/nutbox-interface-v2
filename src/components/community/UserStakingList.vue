<template>
  <div>
    <div class="c-header-grid py-3 px-4">
      <div class="d-flex align-items-center" style="grid-area: avatar">
        <div class="logo-group mr-3">
          <img v-if="getCommunityInfoById(pool.community.id).icon"
            class="logo1"
            :src="getCommunityInfoById(pool.community.id).icon || './default.png'"
            alt=""
          />
          <img class="logo2" :src="stakeIcon || './default.png'" alt="" />
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
          <div class="font-bold">{{ apr }}</div>
        </div>
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">Total {{ type === chainName ? 'Staking' : 'Delegated' }}</div>
          <div class="font-bold">{{ totalDeposited | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex justify-content-between text-center">
          <div class="font14">TVL</div>
          <div class="font-bold">{{ tvl | formatPrice }}</div>
        </div>
      </div>
      <div
        class="d-flex px-3 justify-content-between align-items-center action-box"
        style="grid-area: action"
      >
        <span class="text-primary-0">{{ type }}</span>
        <div
          v-b-toggle="'accordion' + pool.id"
          class="toggle-btn font14" style="color: #408fff"
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
            <i class="link-icon link-icon-gray" @click="gotoCommunity"></i>
          </div>
          <div class="d-flex align-items-center">
            <span>{{ cToken ? cToken.symbol : "" }} Contract</span>
            <i class="copy-icon copy-icon-gray mx-2" @click="copy(cToken.address)"></i>
            <i class="link-icon link-icon-gray" @click="gotoContract(cToken.address)"></i>
          </div>
          <div v-if="stakeToken.symbol" class="d-flex align-items-center">
            <span>{{ stakeToken ? stakeToken.symbol : "" }} Contract</span>
            <i class="copy-icon copy-icon-gray mx-2" @click="copy(stakeToken.address)"></i>
            <i class="link-icon link-icon-gray" @click="gotoContract(stakeToken.address)"></i>
          </div>
        </div>
        <div
          class="content-box d-flex align-items-center justify-content-between p-2"
          style="grid-area: card1"
        >
          <div>
            <div class="font-bold text-grey-7">
              {{ cToken ? cToken.symbol : "" }} Earned
            </div>
            <div class="font12 text-grey-7">{{ pendingReward | amountForm }}</div>
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
          <ConnectMetaMask
            :disable="pool.status === 'CLOSED'"
            v-if="!metamaskConnected"
          />
          <template v-else>
            <template v-if="approved && !needLogin">
              <div>
                <div class="font-bold text-grey-7">
                  {{
                    type === chainName
                      ? stakeToken.symbol + " Staked"
                      : type === "STEEM"
                      ? "SP Delegated"
                      : "HP Delegated"
                  }}
                </div>
                <div class="font12 text-grey-7">{{ staked | amountForm }}</div>
              </div>
              <div class="content-btn-group d-flex">
                <button
                  class="symbol-btn symbol-btn-outline hover mr-2"
                  @click="decrease"
                  :disabled="isCheckingAccount"
                >
                  <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
                  <i v-else class="sub-icon sub-icon-primary"></i>
                </button>
                <button
                  class="symbol-btn symbol-btn-outline hover"
                  :disabled="pool.status === 'CLOSED' || isCheckingAccount"
                  @click="increase"
                >
                  <i v-if="isCheckingAccount" class="loading-icon-gray"></i>
                  <i v-else class="add-icon add-icon-primary"></i>
                </button>
              </div>
            </template>
            <template v-else>
                <button
                class="primary-btn"
                v-if="needLogin"
                @click="showLogin = true"
                >
                {{
                    type === "STEEM"
                    ? $t("wallet.connectSteem")
                    : $t("wallet.connectHive")
                }}
                </button>
                <button
                v-else
                class="primary-btn"
                @click="approve"
                :disabled="approved || isApproving || pool.status === 'CLOSED'"
                >
                <b-spinner
                    small
                    type="grow"
                    v-show="isApproving || loadingApprovements"
                ></b-spinner>
                {{ $t("operation.approve") }}
                </button>
            </template>
          </template>
        </div>
        <!-- <div
          style="grid-area: type"
          class="d-flex justify-content-center align-items-center"
        >
          <span class="type-box text-primary-0 px-2">BSC</span>
        </div> -->
      </div>
    </b-collapse>
    <!-- main chain stake -->
    <b-modal
      v-model="updateStaking"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <StakingHomeChainAssetModal
        :operate="operate"
        :card="pool"
        @hideStakeMask="updateStaking = false"
      />
    </b-modal>
      <!-- sp stake  -->
    <b-modal
      v-model="showSpStake"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <SPStakingModal
        :operate="operate"
        :pool="pool"
        @hideStakeMask="showSpStake = false"
      />
    </b-modal>

      <!-- hp stake  -->
    <b-modal
      v-model="showHpStake"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <HPStakingModal
        :operate="operate"
        :pool="pool"
        @hideStakeMask="showHpStake = false"
      />
    </b-modal>

    <!-- wrong steem account -->
    <b-modal
      v-model="showWrongSteem"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form text-center">
        <i
          class="modal-close-icon-right"
          @click="showWrongSteem = false"
        ></i>
        <div class="mt-2 mb-4">Please change {{type}} Account</div>
        <div>
          Your {{type}} account haven't binding with current {{ chainName }} address, please
          change {{type}} account in your wallet first.
        </div>
        <div class="mt-3 mb-1">Your binding {{type}} account is:</div>
        <div class="c-input-group c-input-group-bg">
          <input
            class="text-center"
            disabled
            type="text"
            :value="bindSteem"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3" style="margin: 0 -1rem">
        <button
          class="primary-btn primary-btn-outline mx-3"
          @click="showWrongSteem = false"
        >
          Cancel
        </button>
        <button class="primary-btn mx-3" @click="showWrongSteem = false, showLogin = true">
          OK
        </button>
      </div>
    </b-modal>
    <!-- wrong main chain account -->
    <b-modal
      v-model="showWrongAccount"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form text-center">
        <i
          class="modal-close-icon-right"
          @click="showWrongAccount = false"
        ></i>
        <div class="mt-2 mb-4">Please change {{ chainName }} address</div>
        <div>
          Your {{ chainName }} address haven't binding with current {{type}} account, please
          change {{ chainName }} address in your wallet first.
        </div>
        <div class="mt-3 mb-1">Your binding address is:</div>
        <div class="c-input-group c-input-group-bg">
          <input
            class="text-center"
            disabled
            type="text"
            :value="bindAddress"
          />
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3" style="margin: 0 -1rem">
        <button class="primary-btn mx-3" @click="showWrongAccount = false">
          OK
        </button>
        <button class="primary-btn mx-3" @click="showWrongAccount = false, showLogin = true">
          Change {{type}}
        </button>
      </div>
    </b-modal>
    <!-- Login -->
    <b-modal
      v-model="showLogin"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <Login :type="type" @hideMask="showLogin = false" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { approvePool, withdrawReward, getPoolType, getBindSteemAccount } from "@/utils/web3/pool";
import { getCommunityRewardPerBlock } from '@/utils/web3/community'
import { CHAIN_NAME } from "@/config";
import { handleApiErrCode, formatBalance } from "@/utils/helper";
import showToastMixin from "@/mixins/copyToast";
import ConnectMetaMask from "@/components/common/ConnectMetaMask";
import { BLOCK_SECOND, ASSET_LOGO_URL } from '@/constant'
import Login from "@/components/common/Login";
import StakingHomeChainAssetModal from "@/components/common/StakingHomeChainAssetModal";
import SPStakingModal from "@/components/common/SPStakingModal";
import HPStakingModal from "@/components/common/HPStakingModal";

export default {
  name: "",
  props: {
    pool: {
      type: Object,
    },
  },
  components: {
    ConnectMetaMask,
    Login,
    StakingHomeChainAssetModal,
    SPStakingModal,
    HPStakingModal
  },
  data() {
    return {
      isWithdrawing: false,
      isApproving: false,
      operate: '',
      updateStaking: false,
      rewardPerBlock: 0,
      showLogin: false,
      showWrongSteem: false,
      showWrongAccount: false,
      showSpStake: false,
      showHpStake: false,
      isCheckingAccount: false,
      bindSteem: '',
      bindAddress:'',
      chainName: CHAIN_NAME
    };
  },
  mixins: [showToastMixin],
  computed: {
    ...mapGetters("community", ["getCommunityInfoById"]),
    ...mapState(["prices", "metamaskConnected"]),
    ...mapState("web3", ["tokenIcons", "allTokens"]),
    ...mapState("steem", ["steemAccount", "vestsToSteem"]),
    ...mapState("hive", ["hiveAccount", "vestsToHive"]),
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
    needLogin() {
      if (this.type === "STEEM") {
        return !this.steemAccount;
      } else if (this.type === "HIVE") {
        return !this.hiveAccount;
      }
      return false;
    },
    stakeIcon() {
      if (this.type === CHAIN_NAME) {
        return this.stakeToken.icon
      } else if (this.type === "STEEM") {
        return ASSET_LOGO_URL['steem']
      } else if (this.type === "HIVE") {
        return ASSET_LOGO_URL['hive']
      }
    },
    approved() {
      if (this.type !== CHAIN_NAME) return true;
      if (!this.approvements) return false;
      return this.approvements[this.pool.id];
    },
    cToken() {
      const token = this.allTokens.filter(
        (t) => t.address.toLowerCase() == this.pool.community.cToken
      )[0];
      return token;
    },
    stakeToken() {
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
      return pendingBn.toString() / 1e18;
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
    stakePrice(){
      if(!this.prices) return 0
      let price
      if (this.type === CHAIN_NAME) {
        price = this.stakeToken.price
      } else if (this.type === "STEEM") {
        price = this.prices['STEEMETH'] * this.prices['ETHUSDT']
      } else if (this.type === "HIVE") {
        price = this.prices['HIVEUSDT']
      }
      return price ? price : 0
    },
    apr() {
      if(!this.prices || !this.tvl) return '--';
      const cTokenPrice = this.cToken.price
      const stakePrice = this.stakePrice;
      if (!cTokenPrice || cTokenPrice == 0 || stakePrice == 0) return '--';
      const blocksPerYear = 365 * 24 * 60 * 60 / BLOCK_SECOND
      const fundRatio = this.pool.community.feeRatio
      const poolRatio = this.pool.ratio
      const reward = this.rewardPerBlock * blocksPerYear * (10000 - fundRatio) * poolRatio * stakePrice;
      const stake = this.tvl;
      return parseFloat(reward / 1e6 / stake).toFixed(2) + '%';
    },
    tvl() {
      return this.totalDeposited * this.stakePrice
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
        { title: this.$t("tip.clipboard") },
        address
      );
    },
    gotoCommunity() {
      this.$store.commit('currentCommunity/saveCommunityId', this.pool.community.id)
      this.$router.push('/sub-community/home/' + this.pool.community.id.substring(0, 10))
    },
    gotoContract(address) {
      window.open("https://goerli.etherscan.io/address/" + address, "_blank");
    },
    async checkAccount() {
      this.isCheckingAccount = true;
      try {
        const bindInfo = await getBindSteemAccount(this.pool);
        const steemAcc = parseInt(this.pool.chainId) === 1 ? this.steemAccount : this.hiveAccount
        if(bindInfo.account[1] === steemAcc) return true;
        if(bindInfo.account[1] === '') {
          if(bindInfo.bindAccount[1] === "0x0000000000000000000000000000000000000000") return true;
          if(bindInfo.bindAccount[1].toLowerCase() !== this.account.toLowerCase()) {
            this.bindAddress = bindInfo.bindAccount[1];
            this.showWrongAccount = true;
            return;
          }
        }
        if(bindInfo.account[1] !== steemAcc) {
          this.bindSteem = bindInfo.account[1]
          this.showWrongSteem = true;
          return;
        }
        return true
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isCheckingAccount = false;
      }
    },
    async increase() {
      this.operate = "add";
      if (this.type === CHAIN_NAME) {
        this.updateStaking = true;
      } else if (this.type === "STEEM") {
        // check account first
        if(await this.checkAccount()){
          this.showSpStake = true;
        }
      } else if (this.type === "HIVE") {
        if(await this.checkAccount()){
          this.showHpStake = true;
        }
      }
    },
    async decrease() {
      this.operate = "minus";
      if (this.type === CHAIN_NAME) {
        this.updateStaking = true;
      } else if (this.type === "STEEM") {
        // check account first
        if(await this.checkAccount()){
          this.showSpStake = true;
        }
      } else if (this.type === "HIVE") {
        if(await this.checkAccount()){
          this.showHpStake = true;
        }
      }
    },
    // Approve contract
    async approve() {
      try {
        this.isApproving = true;
        const hash = await approvePool(this.pool);
        this.$bvToast.toast(this.$t("tip.approveSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.isApproving = false;
      }
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
  mounted () {
    getCommunityRewardPerBlock(this.pool.community.id).then(res => {
      this.rewardPerBlock = res
    }).catch(e => {
      console.log('Get community reward fail', e);
    });
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
      background-image: url("~@/static/images/arrow-blue-icon.svg");
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
  .content-box {
    border: 1px solid var(--input-border);
    border-radius: 0.8rem;
    margin: 0 0.2rem;
    .primary-btn {
      height: 2rem;
      border-radius: 0.4rem;
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
