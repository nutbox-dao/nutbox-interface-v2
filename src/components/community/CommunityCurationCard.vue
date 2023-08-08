<template>
    <div class="multi-card">
      <StakingCardHeader :card="card" :hideToken="true"/>
      <div class="c-card border-0">
        <div>
          <div class="d-flex align-items-center">
          <span class="font-bold text-grey-47 mr-2 font14">
            {{cToken ? cToken.symbol : "" }}
          </span>
            <div class="d-flex align-items-center">
              <span class="font14 text-grey-7">{{ $t('commen.earned') }}</span>
              <i class="copy-icon copy-icon-gray mx-1"
                 @click="copy(cToken ? cToken.address : '')"></i>
              <i class="warning-icon warning-icon-gray" :id="card['id'] + 'earn-tip'"></i>
              <b-popover :target="card['id'] + 'earn-tip'" :delay="{ show: 500 }"
                         custom-class="sub-popover"
                         triggers="hover" placement="top">
                {{ $t('pool.harvestCurationPoolTip') }}
              </b-popover>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
          <span class="value flex-fill font-bold font24 line-height24">
            {{ pendingReward | amountForm }}
          </span>
            <button class="primary-btn m-0 w-auto d-flex align-items-center"
                    :disabled="isWithdrawing || parseFloat(pendingReward) === 0"
                    @click="withdraw">
              <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
              {{ $t("operation.harvest") }}
            </button>
          </div>
          <div class="mt-1 mb-1 d-flex align-items-center">
            <div class="d-flex align-items-center">
              <span class="font14 text-grey-7">
                {{ $t('pool.recipient') }}</span>
              <template>
                <i
                  class="copy-icon copy-icon-gray mx-1"
                  @click="copy(assetToken)"
                ></i>
                <i class="warning-icon warning-icon-gray" :id="card['id'] + 'receive-tip'"></i>
                <b-popover :target="card['id'] + 'receive-tip'" :delay="{ show: 500 }"
                           custom-class="sub-popover"
                           triggers="hover" placement="top">
                  {{ $t('pool.recipientTip') }}
                </b-popover>
              </template>
            </div>
          </div>
        </div>
        <div class="detail-info-box font16 font-bold mt-2">
            <span class="crop mx-auto">
                {{ formatUserAddress(assetToken) }}
            </span>
        </div>
        <div class="detail-info-box text-grey-7 font14 font-bold mt-2" :id="card['id'] + card['name']">
          {{ poolDesc }}
        </div>
        <b-popover :target="card['id'] + card['name']" :delay="{ show: 500 }"
                   custom-class="sub-popover-outline"
                   triggers="hover focus" placement="top">
          <div class="font12">
            {{ poolDesc }}
          </div>
        </b-popover>
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
  import { getPoolDesc } from '@/apis/api'
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
      assetToken() {
        return this.card.asset
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
      }
    },
    data() {
      return {
        isWithdrawing: false,
        stakers: [],
        showAttention: false,
        poolDesc: ''
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
      const descs = await getPoolDesc([this.card.id]);
      if (descs && descs.length > 0) {
        this.poolDesc = descs[0].description;
      }
    },
  };
  </script>

  <style lang="scss" scoped>
  @import "src/static/css/card/common-card";
  .c-card {
    padding: 22px 20px;
    margin-top: -24px;
    height: 240px;
    min-height: 240px;
    // justify-content: flex-start;
  }
  .detail-info-box {
    @include text-multi-line(3);
    flex:1;
  }

  .crop {
    text-overflow: hidden;
    width: 70%;
  }
  </style>
