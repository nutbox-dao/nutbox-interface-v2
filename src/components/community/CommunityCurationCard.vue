<template>
    <div class="multi-card">
      <StakingCardHeader :card="card" :hideToken="true"/>
      <div class="c-card border-0">
        test

        {{ pendingReward }}
        <button class="primary-btn" @click="withdraw">
            {{ $t('operation.harvest') }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import StakingHomeChainAssetModal from "@/components/common/StakingHomeChainAssetModal";
  import { mapState, mapGetters } from "vuex";
  import { withdrawRewardsToRecipient, getPoolType } from "@/utils/web3/pool";
  import { formatUserAddress, handleApiErrCode } from "@/utils/helper";
  import StakingCardHeader from "@/components/common/StakingCardHeader";
  import showToastMixin from "@/mixins/copyToast";
  import { BLOCK_CHAIN_BROWER } from "@/config";
  import PoolOperation from "@/components/community/PoolOperation";
  import PoolOperationForERC1155 from "@/components/community/PoolOperationForERC1155";
  import PoolOperationForCosmos from "@/components/community/PoolOperationForCosmos";
  
  import { BLOCK_SECOND, YEAR_BLOCKS } from "@/constant";
  import { getUserBaseInfo } from "@/utils/web3/account";
  import { ethers } from 'ethers'
  import {
    accBech32ToAddress,
    addressAccToAccBech32
  } from "@/utils/cosmos/cosmos";
  
  export default {
    name: "CommunityStakingCard",
    components: {
      StakingHomeChainAssetModal,
      StakingCardHeader,
      PoolOperation,
      PoolOperationForCosmos,
      PoolOperationForERC1155
    },
    props: {
      card: {
        type: Object,
      },
    },
    computed: {
      ...mapState("currentCommunity", ["allPools", "cToken", "communityBalance"]),
      ...mapState('community', ['rewardPerBlock']),
      ...mapState("web3", ["allTokens"]),
      ...mapState(["prices"]),
      ...mapState("pool", [
        "totalStaked",
        "userStaked",
        "approvements",
        "userReward",
        "loadingApprovements",
      ]),
      ...mapState("steem", ["vestsToSteem"]),
      ...mapState("hive", ["vestsToHive"]),
      ...mapGetters("web3", ["tokenDecimals", "tokenByKey"]),
      type() {
        return getPoolType(this.card.poolFactory, this.card.chainId);
      },
      stakeToken() {
        if (this.type !== "erc20staking" || !this.allTokens) return {};
        const token = this.tokenByKey(this.card.asset);
        return token ?? {};
      },
      assetToken() {
        if (this.type === 'steem' || this.type === 'hive') {
          return ethers.utils.parseBytes32String(this.card.asset)
        } else if (this.type === 'atom' || this.type === 'osmo' || this.type === 'juno') {
          return addressAccToAccBech32(this.card.asset, this.type)
        } else if (this.type === 'erc20staking') {
          return this.card.asset
        }
      },
      assetToken() {
        if (this.type === 'steem' || this.type === 'hive') {
          return ethers.utils.parseBytes32String(this.card.asset)
        } else if (this.type === 'atom' || this.type === 'osmo' || this.type === 'juno') {
          return addressAccToAccBech32(this.card.asset, this.type)
        } else if (this.type === 'erc20staking') {
          return this.card.asset
        }
      },
      pendingReward() {
        if (!this.userReward) return 0;
        const pendingBn = this.userReward[this.card.id];
        if (!pendingBn || !this.cToken) return 0;
        return parseFloat(
          pendingBn.toString() / 10 ** this.cToken.decimal
        ).toFixed(3);
      },
      totalDeposited() {
        if (!this.totalStaked) return 0;
        const total = this.totalStaked[this.card.id];
        if (!total) return 0;
        if (this.type === "erc20staking") {
          return (
            total.toString() /
            10 ** (this.stakeToken ? this.stakeToken.decimal : 18)
          );
        } else if (this.type === "steem") {
          return (total.toString() / 1e6) * this.vestsToSteem;
        } else if (this.type === "hive") {
          return (total.toString() / 1e6) * this.vestsToHive;
        } else if (this.type === "atom" || this.type === 'osmo' || this.type === 'juno') {
          return total.toString() / 1e6;
        } else if (this.type === 'erc1155') {
          return total.toNumber()
        }
        return 0;
      },
      stakePrice() {
        if (!this.prices) return 0;
        let price;
        if (this.type === "erc20staking") {
          price = this.stakeToken.price;
        } else {
          price = this.prices[this.type];
        }
        return price ? parseFloat(price) : 0;
      },
      apr() {
        if (!this.prices || !this.cToken || !this.tvl) return "--";
        const cTokenPrice = this.cToken.price;
        const stakePrice = this.stakePrice;
        if (!cTokenPrice || cTokenPrice == 0 || stakePrice == 0) return "--";
        const blocksPerYear = YEAR_BLOCKS;
        const fundRatio = this.card.community.feeRatio;
        const poolRatio = this.card.ratio;
        const _rewardPerBlock = this.rewardPerBlock[this.card.community.id.toLowerCase()]
        
        const reward =
          (_rewardPerBlock ?? 0) *
          blocksPerYear *
          (10000 - fundRatio) *
          poolRatio *
          cTokenPrice;
        const stake = this.tvl;
        return parseFloat(reward / 1e6 / stake).toFixed(2) + "%";
      },
      tvl() {
        return this.totalDeposited * this.stakePrice;
      },
    },
    data() {
      return {
        isWithdrawing: false,
        stakers: [],
        showAttention: false,
      };
    },
    mixins: [showToastMixin],
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
            address: formatUserAddress(address),
          }),
          { title: this.$t("tip.clipboard") },
          address
        );
      },
      gotoToken(address) {
        window.open(BLOCK_CHAIN_BROWER + "token/" + address, "_blank");
      },
      async withdraw() {
        try {
          if (!this.cToken.isMintable) {
            if (this.userReward[this.card.id].gt(this.communityBalance)) {
              this.showAttention = true;
              return;
            }
          }
          this.isWithdrawing = true;
          await withdrawRewardsToRecipient(this.card.id);
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
    async mounted() {
      const len = Math.min(7, this.card.stakers.length);
      const ids = this.card.stakers.slice(0, len).map((a) => a.id);
      this.stakers = await Promise.all(ids.map((id) => getUserBaseInfo(id)));
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "src/static/css/card/common-card";
  .c-card {
    padding: 22px 20px;
    margin-top: -24px;
    height: 330px;
    min-height: 330px;
  }
  </style>
  