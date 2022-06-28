<template>
  <div class="card-link-top-box">
    <div class="status-container">
      <span
        class="font14 font-bold"
        :class="card.status == 'OPENED' ? 'Active' : 'Completed'"
        >{{ $t("pool." + card.status.toLowerCase()) }}</span
      >
    </div>
    <div class="d-flex align-items-center">
      <div class="card-link-icons">
        <img class="icon1" :src="communityInfo.icon" alt="" />
        <img class="icon2" :src="icon" alt="" />
      </div>
      <div class="card-link-title-text font20 font-bold">
        <div class="link-title font20 line-height24">
          <span :id="communityId + card.id + 'com'">{{
            communityInfo.name
          }}</span>
          <b-popover
            :target="communityId + card.id + 'com'"
            triggers="hover focus"
            placement="top"
          >
            {{ communityInfo.name }}
          </b-popover>
          <i class="link-icon"></i>
        </div>
        <div class="link-title font16 line-height20">
          <span :id="card.id">{{ card.name }}</span>
          <b-popover
            :target="card.id"
            triggers="hover focus"
            placement="bottom"
          >
            {{ card.name }}
          </b-popover>
        </div>
      </div>
      <span class="chain-type mt-2" v-show="poolType">{{ poolType }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getPoolType } from "@/utils/web3/pool";
import { getPoolFactory } from "@/utils/web3/contract";
import { ASSET_LOGO_URL } from "@/constant";
import { CHAIN_NAME } from "@/config";
import { ethers } from 'ethers'

export default {
  name: "StakingCardHeader",
  props: {
    card: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("community", ["getCommunityInfoById"]),
    ...mapGetters('web3', ['tokenByKey', 'erc1155ByKey']),
    ...mapState("currentCommunity", ["communityId", "cToken"]),
    ...mapState("web3", ["tokenIcons", 'allErc1155s']),
    communityInfo() {
      if (!this.communityId || !this.getCommunityInfoById(this.communityId))
        return {};
      return this.getCommunityInfoById(this.communityId);
    },
    icon() {
      switch (this.card.poolFactory.toLowerCase()) {
        case getPoolFactory("erc20staking").toLowerCase():
          return this.tokenIcons[this.card.asset.toLowerCase()];
        case getPoolFactory("steem").toLowerCase(): {
          const chainId = this.card.chainId;
          return ASSET_LOGO_URL[chainId === 1 ? "steem" : "hive"];
        }
        case getPoolFactory("cosmos").toLowerCase(): {
          const chainId = this.card.chainId;
          return ASSET_LOGO_URL[this.type];
        }
        case getPoolFactory('erc1155').toLowerCase(): {
          try {
            const address = ethers.utils.getAddress(this.card.asset.substring(0, 42));
            const id = this.card.asset.substring(42, this.card.asset.length)
            return this.erc1155ByKey(address, id)?.icon
          }catch (e) {

          }
        }
      }
    },
    type () {
      return getPoolType(this.card.poolFactory, this.card.chainId);
    },
    poolType() {
      if (this.type === "erc20staking") {
        const t = this.tokenByKey(this.card.asset)
        if (t && t.is_lp) return 'LP'
        return;
      }
      return this.type.toUpperCase();
    },
  },
  methods: {
    openNewTab(id) {},
  },
  async mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.status-container {
  position: absolute;
  top: 8px;
  right: 8px;
  box-sizing: border-box;
  span {
    box-sizing: border-box;
  }
}
.chain-type {
  border-radius: 24px;
  color: var(--sub-primary);
  border: 1px solid var(--sub-primary);
  font-size: 14px;
  line-height: 22px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
</style>
