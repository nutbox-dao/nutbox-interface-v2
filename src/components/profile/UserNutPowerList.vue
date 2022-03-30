<template>
  <div>
    <div class="c-header-grid py-3 px-4">
      <div class="d-flex align-items-center" style="grid-area: avatar">
        <div class="logo-group mr-3">
          <img
            class="logo1"
            :src="ctokenIcon"
            alt=""
          />
          <img class="logo2" :src="stakeIcon" alt="" />
        </div>
        <div class="h-100 d-flex flex-column justify-content-center">
          <div class="font-bold font20 line-height20">
            {{ gauge.name }}
          </div>
        </div>
      </div>
      <div class="value-box d-flex" style="grid-area: value">
        <div class="item h-100 d-flex text-center font14 line-height14">
          <div class="mb-2">{{ cToken ? cToken.symbol : "" }} Earned</div>
          <div class="font-bold">{{ pendingCtoken | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex text-center font14 line-height14">
          <div class="mb-2">NUT Earned</div>
          <div class="font-bold">{{ userRewardNut[gauge.id] | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex text-center font14 line-height14">
          <div class="mb-2">APR</div>
          <div class="font-bold d-flex align-items-center">
            <span class="mr-1">{{ (npApr + ctokenApr).toFixed(2) }}%</span>
             <i class="help-icon" v-b-popover.hover.top="detailApr"></i>
          </div>
        </div>
        <div class="item h-100 d-flex text-center font14 line-height14">
          <div class="mb-2">NP Voted</div>
          <div class="font-bold">{{ userLocked[gauge.id] | amountForm }}</div>
        </div>
        <div class="item h-100 d-flex text-center font14 line-height14">
          <div class="mb-2">TVL</div>
          <div class="font-bold">{{ tvl | formatPrice }}</div>
        </div>
      </div>
      <div
        class="d-flex align-items-center action-box"
        style="grid-area: action"
      >
        <div
          v-b-toggle="'accordion' + gauge.id"
          class="toggle-btn font14"
          style="color: #408fff"
        >
          <span class="when-open">Hide</span>
          <span class="when-closed">Detail</span>
        </div>
      </div>

    </div>
    <b-collapse :id="'accordion' + gauge.id" :visible="isFold">
      <div class="collapse-content-grid font16 py-3 px-4">
        <div
          class="
            link-box
            d-flex
            flex-column
            justify-content-center
            text-primary-0
          "
          style="grid-area: link"
        >
          <div class="d-flex align-items-center">
            {{ getCommunityInfoById(gauge.community.id).name }}
            <i class="mx-2"></i>
            <i class="link-icon link-icon-gray" @click="gotoCommunity"></i>
          </div>
          <div class="d-flex align-items-center">
            <span>{{ cToken ? cToken.symbol : "" }} Contract</span>
            <i
              class="copy-icon copy-icon-gray mx-2"
              @click="copy(cToken.address)"
            ></i>
            <i
              class="link-icon link-icon-gray"
              @click="gotoContract(cToken.address)"
            ></i>
          </div>
          <div class="d-flex align-items-center">
            <span>NUT Contract</span>
            <i
              class="copy-icon copy-icon-gray mx-2"
              @click="copy(stakeToken.address)"
            ></i>
            <i
              class="link-icon link-icon-gray"
              @click="gotoContract(stakeToken.address)"
            ></i>
          </div>
        </div>
        <div
          class="
            content-box
            d-flex
            align-items-center
            justify-content-between
            p-2
          "
          style="grid-area: card1"
        >
          <div>
            <div class="font-bold text-grey-7">
              {{ cToken ? cToken.symbol : "" }} Earned
            </div>
            <div class="font12 text-grey-7">
              {{ pendingCtoken | amountForm }}
            </div>
          </div>
          <div>
            <div class="font-bold text-grey-7">
              NUT Earned
            </div>
            <div class="font12 text-grey-7">
              {{ userRewardNut[gauge.id] | amountForm }}
            </div>
          </div>
          <button
            class="primary-btn primary-btn-40 w-auto px-2 mx-0"
            @click="withdraw"
            :disabled="isWithdrawing"
          >
            <b-spinner small type="grow" v-show="isWithdrawing"></b-spinner>
            Harvest
          </button>
        </div>
        <div
          class="
            content-box
            d-flex
            align-items-center
            justify-content-between
            p-2
          "
          style="grid-area: card2"
        >
          <ConnectMetaMask
            class="primary-btn-40 w-100"
            v-if="!metamaskConnected"
          />
          <template v-else>
            <div>
              <div class="font-bold text-grey-7">
                NP Voted
              </div>
              <div class="font12 text-grey-7">{{ userLocked[gauge.id] | amountForm }}</div>
            </div>
            <div class="content-btn-group d-flex">
              <button
                class="symbol-btn symbol-btn-40 symbol-btn-bg hover mr-2"
                @click="decrease"
              >
                <i class="sub-icon sub-icon-white"></i>
              </button>
              <button
                class="symbol-btn symbol-btn-40 symbol-btn-bg hover"
                @click="increase"
              >
                <i class="add-icon add-icon-white"></i>
              </button>
            </div>
          </template>
        </div>
        <div
          style="grid-area: type"
          class="d-flex justify-content-end align-items-center"
        >
          <!-- <span class="text-primary-0 px-1 font14 line-height24 font-bold">{{ type }}</span> -->
        </div>
      </div>
    </b-collapse>
    <!-- vote gauge modal -->
    <b-modal
      v-model="updateVoing"
      modal-class="custom-modal sub-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <VotingGaugeByNpModal
        :operate="operate"
        :card="gauge"
        @hideStakeMask="updateVoing = false"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VotingGaugeByNpModal from '@/components/common/VotingGaugeByNpModal'
import {
  userWithdrawReward
} from '@/utils/nutbox/gauge'
import { getCommunityRewardPerBlock } from '@/utils/web3/community'
import { CHAIN_NAME, NutAddress } from '@/config';
import { handleApiErrCode, formatBalance } from '@/utils/helper'
import showToastMixin from '@/mixins/copyToast'
import ConnectMetaMask from '@/components/common/ConnectMetaMask'
import { BLOCK_SECOND, ASSET_LOGO_URL, YEAR_BLOCKS } from '@/constant'
import { BLOCK_CHAIN_BROWER } from '@/config'

export default {
  name: '',
  props: {
    gauge: {
      type: Object
    },
    isFold: {
      type: Boolean
    }
  },
  components: {
    ConnectMetaMask,
    VotingGaugeByNpModal
  },
  data () {
    return {
      isWithdrawing: false,
      updateVoing: false,
      operate: '',
      updateStaking: false,
      chainName: CHAIN_NAME
    }
  },
  mixins: [showToastMixin],
  computed: {
    ...mapState('np', ['npApr', 'npPrice', 'balance']),
    ...mapState('gauge', ['userLocked', 'totalLocked', 'userRewardNut', 'userRewardCtoken', 'gaugeRatio', 'distributionRatio']),
    ...mapState("currentCommunity", ["cToken", 'feeRatio']),
    ...mapGetters("web3", ["tokenDecimals", "tokenByKey"]),
    ...mapState('community', ['rewardPerBlock']),
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState(['metamaskConnected']),
    stakers() {
      return this.gauge.voters 
    },
    cToken() {
      const token = this.tokenByKey(this.gauge.community.cToken);
      return token;
    },
    stakeToken() {
      return {
        address: NutAddress,
        symbol: 'NUT'
      }
    },
    ctokenIcon() {
      if (this.cToken) {
        return this.cToken.icon
      }
    },
    stakeIcon() {
      return ASSET_LOGO_URL['nut']
    },
    pendingCtoken() {
      if (this.userRewardCtoken[this.gauge.id]){
        return this.userRewardCtoken[this.gauge.id].toString() / this.ctokenDecimals
      }
      return 0
    },
    totalLockedNp() {
      return this.totalLocked ? this.totalLocked[this.gauge.id] : 0
    },
    tvl() {
      if (this.totalLocked && this.npPrice) {
        return this.totalLockedNp * this.npPrice
      }
      return 0
    },
    ctokenDecimals() {
      if (this.cToken) {
        return 10 ** this.cToken.decimal
      }
      return 1e18
    },
    ctokenApr() {
      if (!this.rewardPerBlock || !this.rewardPerBlock[this.gauge.community.id] || !this.npPrice || this.tvl === 0  || this.totalLockedNp === 0 || this.gaugeRatio === 0 || !this.cToken) {
        return 0
      }
      const ctokenPrice = this.cToken.price
      const apr = this.rewardPerBlock[this.gauge.community.id] * (10000 - this.feeRatio) * this.gauge.ratio * this.gaugeRatio * ctokenPrice * YEAR_BLOCKS / this.tvl / 1e14
      return apr;
    },
    detailApr() {
      return 'NUT: ' + this.npApr.toFixed(2) + '% + ' + this.cToken?.name + ': ' + this.ctokenApr.toFixed(2) + '%'
    }
  },
  methods: {
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },
    copy (address) {
      this.onCopy(
        this.$t('tip.copyAddress', {
          address: this.formatUserAddress(address)
        }),
        { title: this.$t('tip.clipboard') },
        address
      )
    },
    gotoCommunity () {
      this.$store.commit(
        'currentCommunity/saveCommunityId',
        this.gauge.community.id
      )
      this.$router.push('/sub-community/home/?id=' + this.gauge.community.id)
    },
    gotoContract (address) {
      window.open(BLOCK_CHAIN_BROWER + 'address/' + address, '_blank')
    },
    async increase () {
      this.operate = 'add'
      this.updateVoing = true;
    },
    async decrease () {
      this.operate = 'minus'
      this.updateVoing = true;
    },
    async withdraw () {
      try {
        this.isWithdrawing = true
        await userWithdrawReward(this.gauge.id)
        this.$bvToast.toast(this.$t('tip.withdrawSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.isWithdrawing = false
      }
    }
  },
  mounted () {
    getCommunityRewardPerBlock()
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(0);
}
.c-header-grid {
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: grid;
  grid-template-columns: 25% 70% 5%;
  grid-template-areas: "avatar value action";
  .value-box .item {
    flex-direction: column;
    flex: 1;
    justify-content: center;
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
  .action-box {
    justify-content: flex-end;
  }
  .action-box .type {
    border: 1px solid var(--primary-custom);
    border-radius: 6px;
    padding: 2px 4px;
    white-space: nowrap;
  }
}
.collapse-content-grid {
  background: var(--input-bg);
  display: grid;
  grid-template-columns: 26% 36% 28% 10%;
  grid-template-areas: "link card1 card2 type";
  .content-box {
    min-height: 72px;
    border: 1px solid var(--text-47);
    border-radius: 0.8rem;
    margin: 0 0.2rem;
  }
}
@media (max-width: 1200px) {
  .c-header-grid {
    grid-template-columns: 25% 65% 10%;
  }
}
@media (max-width: 868px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "avatar action"
      "value value";
    .value-box {
      margin-top: 1rem;
    }
    .action-box {
      margin-top: 0.5rem;
    }
  }
  .collapse-content-grid {
    display: grid;
    grid-template-columns: 55% 45%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      "link type"
      "card1 card2";
  }
}
@media (max-width: 557px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(3, auto);
    grid-template-areas:
      "avatar"
      "value"
      "action";
    .value-box {
      flex-direction: column;
      .item {
        flex-direction: row;
        flex: 1;
        justify-content: space-between;
      }
    }
    .toggle-btn span {
      flex-direction: row;
    }
    .action-box {
      margin-top: 10px;
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
  img {
    border: 2px solid white;
    background-color: var(--card-bg-primary);
  }
  .logo1 {
    @include card-icon(56px, 56px);
  }
  .logo2 {
    margin-left: -0.8rem;
    @include card-icon(32px, 32px);
  }
}
</style>
