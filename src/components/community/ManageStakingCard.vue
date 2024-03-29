<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="status-container text-right">
        <span v-if="pool.status === 'OPENED'" :class="'Active'">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
        <span v-else class="Completed">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
      </div>
      <div class="d-flex align-items-center">
        <div class="card-single-icon">
          <img class="icon1" :src="icon || './default.png'" alt="" />
        </div>
        <div class="card-link-title-text font-bold hover" @click="copyContract">
          <span>{{ pool.name || '--' }}</span>
        </div>
        <span class="chain-type mt-2" v-show="poolType">{{ poolType }}</span>
      </div>
    </div>
    <div class="c-card text-grey-7 font14 font-bold">
      <div class="project-info-container">
        <span class="name">{{ $t("pool.userCount") }}</span>
        <div class="info">{{ pool.stakersCount || 0 }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t("pool.totalDeposit") }}</span>
        <div class="info">{{ totalDeposited | amountForm }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t("pool.tvl") }}</span>
        <div class="info">{{ tvl | formatPrice }}</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t("pool.ratio") }}</span>
        <div class="info">{{ pool.ratio / 100 }}%</div>
      </div>
      <div class="project-info-container">
        <span class="name">{{ $t('commen.apy') }}</span>
        <div class="info">{{ apr }}</div>
      </div>

      <button class="primary-btn my-3 w-75" :disabled="updating" v-if="pool.status === 'OPENED' && !isCreateGauge" @click="showAttention=true">
        <b-spinner small type="grow" v-show="updating" />
        {{ $t("pool.closePool") }}
      </button>
    </div>
    <!-- showAttention tip -->
    <b-modal
      v-model="showAttention"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form">
        <h3 style="color: red; text-align: center">
          {{ $t("tip.attention") }}
        </h3>
        <div class="my-3 font20 line-height24 text-center">
          {{ $t("tip.stopPoolAttention") }}
        </div>
        <div class="mb-4 font20 line-height24 text-center">
          {{ `Please input pool name: "${pool.name}" to close this pool.` }}
        </div>

        <div
          class="c-input-group c-input-group-bg-dark c-input-group-border my-3"
        >
          <b-input
            class="flex-1"
            :placeholder="$t('placeHolder.confirmInfo', { info: pool.name })"
            v-model="confirmInfo"
          ></b-input>
        </div>

        <div class="d-flex justify-content-between" style="gap: 2rem">
          <button
            class="dark-btn"
            v-if="
              takeFee &&
              (approving || loadingApproveCommunity || !approvedCommunity)
            "
            @click="approve"
            :disabled="approving || loadingApproveCommunity"
          >
            <b-spinner small type="grow" v-show="approving" />
            {{ $t("operation.approve") }}
          </button>
          <button
            v-else
            class="dark-btn"
            @click="receiveAttention"
            :disabled="updating"
          >
            <b-spinner small type="grow" v-show="updating" />
            {{ $t("pool.closePool") }}
          </button>
          <button
            class="primary-btn"
            @click="confirmInfo = '';showAttention = false"
            :disabled="updating"
          >
            <b-spinner small type="grow" v-show="updating" />
            {{ $t("operation.cancel") }}
          </button>
        </div>
        <div v-if="takeFee" class="font14 my-1" style="text-align: center">
          {{ `Operation fee: ${fee} NUT` }}
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { handleApiErrCode, sleep, formatUserAddress } from '@/utils/helper'
import { closePool, getPoolType } from '@/utils/web3/pool'
import { getERC20Info, getCToken } from '@/utils/web3/asset'
import { getPoolFactory } from '@/utils/web3/contract'
import { ASSET_LOGO_URL, YEAR_BLOCKS } from '@/constant'
import { approveUseERC20 } from '@/utils/web3/community'
import { NutAddress } from '@/config'
import StakingCardHeader from '@/components/common/StakingCardHeader'
import {ethers} from 'ethers'

export default {
  name: 'ManageStakingCard',
  components: { StakingCardHeader },
  computed: {
    ...mapState("web3", ["stakingFactoryId", "allTokens", "fees", "allErc1155s"]),
    ...mapState("community", [
      "communityData",
      "loadingApproveCommunity",
      "approvedCommunity",
      'rewardPerBlock'
    ]),
    ...mapGetters("web3", ["tokenByKey", 'erc1155ByKey']),
    ...mapState({
      steemVests: (state) => state.steem.vestsToSteem,
      hiveVests: (state) => state.hive.vestsToHive,
      prices: (state) => state.prices,
    }),
    totalDeposited() {
      return this.pool.totalAmount
        ? this.pool.totalAmount.toString() / this.vert
        : 0;
    },
    type() {
      return getPoolType(this.pool.poolFactory, this.pool.chainId);
    },
    poolType() {
      if (this.type === 'erc20staking') {
        return this.stakeToken.is_lp ? 'LP' : null
      }
      return this.type.toUpperCase()
    },
    cToken() {
      return this.tokenByKey(this.communityData.cToken) ?? {}
    },
    stakeToken() {
      if (this.type !== "erc20staking" || !this.allTokens) return {};
      const token = this.tokenByKey(this.pool.asset);
      return token;
    },
    tvl() {
      if (!this.prices || !this.stakeToken) return 0;
      let price;
      if (this.type === "erc20staking") {
        price = this.stakeToken.price;
      } else  {
        price = this.prices[this.type];
      }
      price = price ? parseFloat(price) : 0;
      return this.totalDeposited * price;
    },
    apr() {
      if (!this.prices || !this.cToken || !this.tvl) return "--";
      const cTokenPrice = this.cToken.price;
      const stakePrice = this.stakePrice;
      if (!cTokenPrice || cTokenPrice == 0 || stakePrice == 0) return "--";
      const blocksPerYear = YEAR_BLOCKS;
      const fundRatio = this.communityData.feeRatio;
      const poolRatio = this.pool.ratio;
      const _rewardPerBlock = this.rewardPerBlock[this.stakingFactoryId.toLowerCase()]

      const reward =
        (_rewardPerBlock ?? 0) *
        blocksPerYear *
        (10000 - fundRatio) *
        poolRatio *
        cTokenPrice;
      const stake = this.tvl;
      return parseFloat(reward / 1e6 / stake).toFixed(2) + "%";
    },
    fee() {
      if (this.fees) {
        return this.fees["COMMUNITY"].toFixed(2);
      }
      return 0;
    },
    takeFee() {
      if (this.fees) {
        return this.fees["COMMUNITY"] > 0;
      }
      return false;
    },
  },
  data() {
    return {
      updating: false,
      minedToken: 0,
      contract: null,
      stakedERC20: {},
      showAttention: false,
      approving: false,
      icon: null,
      vert: 1e18,
      confirmInfo: "",
    };
  },
  props: {
    pool: {
      type: Object,
    },
    isCreateGauge: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async approve() {
      try {
        this.approving = true;
        const hash = await approveUseERC20(NutAddress, this.communityData.id);
        this.$bvToast.toast(this.$t("tip.approveSuccess"), {
          title: this.$t("tip.success"),
          variant: "success",
        });
        this.$store.commit("community/saveApprovedCommunity", true);
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.approving = false;
      }
    },
    receiveAttention() {
      if (this.confirmInfo !== this.pool.name) {
        this.$bvToast.toast(this.$t("error.wrongConfirmInfo"), {
          title: this.$t("error.error"),
          variant: "danger",
        });
        return;
      }
      this.closePool();
    },
    copyContract(){
      const address = ethers.utils.getAddress(this.pool.id)
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: formatUserAddress(address)
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    async closePool() {
      try {
        this.updating = true;
        if (
          this.pool.ratio === 10000 &&
          this.communityData.pools.filter(p => p.status === 'OPENED').length === 1
        ) {
          // remove only one pool
          const res = await closePool({
            poolAddress: this.pool.id,
            activedPools: [],
            ratios: [],
          });
          this.communityData.pools[0].status = "CLOSED";
          return;
        }
        if (this.pool.ratio !== 0) {
          this.$bvToast.toast(this.$t("tip.stopPoolTips"), {
            title: this.$t("tip.tips"),
            variant: "info",
          });
          return;
        }
        let pools = [];
        let activedPools = [];
        let ratios = [];
        let index = 0;
        for (let i = 0; i < this.communityData.pools.length; i++) {
          const pool = { ...this.communityData.pools[i] };
          if (pool.id !== this.pool.id) {
            if (pool.status === "OPENED") {
              pool.poolIndex = index++;
              activedPools.push(pool.id);
              ratios.push(pool.ratio);
            }
          } else {
            pool.status = "CLOSED";
          }
          pools.push(pool);
        }
        const res = await closePool({
          poolAddress: this.pool.id,
          activedPools,
          ratios,
        });
        this.$bvToast.toast(this.$t("tip.stopPoolOk"), {
          title: this.$t("tip.tips"),
          variant: "success",
        });
        this.communityData.pools = pools;
        await sleep(2);

        this.showAttention = false;
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.confirmInfo = ''
        this.updating = false;
      }
    },
  },

  async mounted() {
    const chainId = this.pool.chainId;
    switch (this.pool.poolFactory.toLowerCase()) {
      case getPoolFactory("erc20staking").toLowerCase():
        this.stakedERC20 = await getERC20Info(this.pool.asset);
        this.icon = this.stakedERC20.icon;
        this.vert = 10 ** this.stakedERC20.decimal;
        break;
      case getPoolFactory('steem').toLowerCase():
        this.icon = ASSET_LOGO_URL[this.type]
        this.vert = this.pool.chainId === 1 ? 1e6 / this.steemVests : 1e6 / this.hiveVests
        break;
      case getPoolFactory('cosmos').toLowerCase():
        this.icon = ASSET_LOGO_URL[this.type]
        this.vert = 1e6
      case getPoolFactory('erc1155').toLowerCase():
        try {
          const contract = ethers.utils.getAddress(this.pool.asset.substring(0, 42))
          const id = this.pool.asset.substring(42)
          this.icon = this.erc1155ByKey(contract, id)?.icon
        }catch (e) {
        }
        this.vert = 1
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
.status-container {
  position: absolute;
  top: 8px;
  right: 8px;
  box-sizing: border-box;
  span {
    box-sizing: border-box;
  }
}
.card-link-title-text span {
  word-break: break-word;
  @include text-multi-line(2);
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
.card-link-top-box {
  min-height: 128px;
}
.c-card {
  margin-top: -30px;
}
.project-info-container {
  margin: 10px 0;
}
</style>
