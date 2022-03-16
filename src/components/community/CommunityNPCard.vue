<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="d-flex align-items-center">
        <div class="card-link-title-text font-bold">
          <div class="text-grey-7 font14 line-height14 mb-1">Vote for</div>
          <div class="link-title font20 line-height24">
            <span>{{ card.name }}</span>
          </div>
          <!-- <div class="link-title font16 line-height20">
            <span>Earn Monns & NUT</span>
          </div> -->
        </div>
        <div class="card-link-icons">
          <img class="icon1" :src="ctokenIcon" alt="">
          <img class="icon2" :src="nutIcon" alt="">
        </div>
      </div>
    </div>
    <div class="c-card">
      <div>
        <div class="font12 text-grey-7 mb-1">EARNED</div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="flex-1">
            <div class="d-flex align-items-center">
              <div class="d-flex justify-content-between align-items-center font-bold flex-1">
                <span class="font18 line-height18">{{ cToken ? cToken.name : '' }}</span>
                <span class="font24 line-height24">{{ pendingCtoken | amountForm }}</span>
              </div>
              <div class="d-flex align-items-center icons-group">
                <i class="copy-icon copy-icon-gray mr-1" @click="copy(cToken ? cToken.address : '')"></i>
                <i class="link-icon link-icon-gray" @click="gotoToken(cToken ? cToken.address : '')"></i>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="d-flex justify-content-between align-items-center font-bold flex-1">
                <span class="font18 line-height18">Nut</span>
                <span class="font24 line-height24">{{ userRewardNut[card.id] | amountForm }}</span>
              </div>
              <div class="d-flex align-items-center icons-group">
                <i class="copy-icon copy-icon-gray mr-1" @click="copy(nutAddress)"></i>
                <i class="link-icon link-icon-gray" @click="gotoToken(nutAddress)"></i>
              </div>
            </div>
          </div>
          <button class="primary-btn m-0 w-auto d-flex align-items-center" :disabled="harvesting || userRewardNut[card.id]==0" @click="harvest">
            <b-spinner small type='grow' v-show="harvesting"></b-spinner>
            {{ $t("operation.harvest") }}
          </button>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-between align-items-center font12 mb-1">
          <div class="text-grey-7">
            <span class="font-bold text-grey-47">NP</span>
            VOTED
          </div>
          <div class="text-grey-47 font-bold">Available：{{ balance.freeNp | amountForm }}</div>
        </div>
        <!-- operate area -->
        <div
          class="d-flex justify-content-between align-items-center "
        >
        <ConnectMetaMask
            class="primary-btn-40 w-100"
            v-if="!metamaskConnected"
          />
          <template v-else>
            <span class="value flex-fill">
              {{ userLocked[card.id] | amountForm }}
            </span>
            <div class="d-flex">
              <!-- decrease -->
              <button
                class="symbol-btn symbol-btn-outline hover mr-2"
                @click="operate = 'minus'; updateVoing = true"
              >
                <i class="sub-icon sub-icon-primary"></i>
              </button>
              <!-- increase -->
              <button
                class="symbol-btn symbol-btn-outline hover"
                :disabled="card.status === 'CLOSED'"
                @click="operate = 'add'; updateVoing = true"
              >
                <i class="add-icon add-icon-primary"></i>
              </button>
            </div>
          </template>
        </div>
      </div>
      <div class="detail-info-box text-grey-7 font14 font-bold">
        <div class="project-info-container">
          <span class="name">APR</span>
          <div class="info d-flex align-items-center">
            <i class="help-icon mr-1" v-b-popover.hover.top="detailApr"></i>
            <span>{{ (npApr + ctokenApr).toFixed(2) }}%</span>
          </div>
        </div>
        <div class="project-info-container">
          <span class="name">Total Staking</span>
          <div class="info">{{ totalLockedNp | amountForm }}</div>
        </div>
        <div class="project-info-container">
          <span class="name">TVL</span>
          <div class="info">{{ tvl | formatPrice }}</div>
        </div>
        <div class="project-info-container">
          <span class="name">Voters</span>
          <div class="info d-flex align-items-center">
            <div :id="user.id + card.id" v-for="(user, index) of voters" :key="user.id"
                 :style="{zIndex: voters.length-index}">
              <img class="info-icon" v-if="user.avatar && user.avatar.length > 0" :src="user.avatar" alt="">
              <img v-else class="info-icon" src="~@/static/images/avatars/default.png" alt="">
              <b-popover class="primary-bg" :target="user.id + card.id" triggers="hover focus" placement="top">
                {{ user.name ? user.name : (user.id.slice(0, 6) + '...' + user.id.slice(36, 42)) }}
              </b-popover>
            </div>
            <span class="ml-1" style="line-height: 28px">{{ card.votersCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- vote modal -->
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
        :card="card"
        @hideStakeMask="updateVoing = false"
      />
    </b-modal>
  </div>
</template>

<script>
import VotingGaugeByNpModal from '@/components/common/VotingGaugeByNpModal'
import { mapState } from 'vuex'
import { ASSET_LOGO_URL, YEAR_BLOCKS } from '@/constant'
import showToastMixin from "@/mixins/copyToast";
import { NutAddress, BLOCK_CHAIN_BROWER } from '@/config'
import { formatUserAddress, handleApiErrCode, sleep } from "@/utils/helper";
import { getUserBaseInfo } from "@/utils/web3/account";
import { userWithdrawReward } from '@/utils/nutbox/gauge'

export default {
  name: 'CommunityNPCard',
  components: { VotingGaugeByNpModal },
  props: {
    card: {
      type: Object
    },
  },
  computed: {
    ...mapState('np', ['npApr', 'npPrice', 'balance']),
    ...mapState('gauge', ['userLocked', 'totalLocked', 'userRewardNut', 'userRewardCtoken', 'gaugeRatio', 'distributionRatio']),
    ...mapState("currentCommunity", ["cToken", 'feeRatio']),
    ...mapState('community', ['rewardPerBlock']),
    ...mapState(['metamaskConnected']),
    stakers() {
      return this.card.voters
    },
    ctokenIcon() {
      if (this.cToken) {
        return this.cToken.icon
      }
    },
    pendingCtoken() {
      if (this.userRewardCtoken[this.card.id]){
        return this.userRewardCtoken[this.card.id].toString() / this.ctokenDecimals
      }
      return 0
    },
    totalLockedNp() {
      return this.totalLocked ? this.totalLocked[this.card.id] : 0
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
      if (!this.rewardPerBlock || !this.npPrice || this.tvl === 0  || this.totalLockedNp === 0 || this.gaugeRatio === 0 || !this.cToken) {
        return 0
      }
      const ctokenPrice = this.cToken.price
      const apr = this.rewardPerBlock[this.card.community.id] * (10000 - this.feeRatio) * this.card.ratio * this.gaugeRatio * ctokenPrice * YEAR_BLOCKS / this.tvl / 1e14
      return apr;
    },
    detailApr() {
      return 'NUT: ' + this.npApr.toFixed(2) + '% + ' + this.cToken?.name + ': ' + this.ctokenApr.toFixed(2) + '%'
    }
  },
  mixins: [showToastMixin],
  data () {
    return {
      nutIcon: ASSET_LOGO_URL['nut'],
      nutAddress: NutAddress,
      updateVoing: false,
      operate: 'add',
      harvesting: false,
      voters:[]
    }
  },
  methods: {
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
    async harvest() {
      try {
        this.harvesting = true
        await userWithdrawReward(this.card.id)
        await sleep(3)
        this.updateVoing = false
      } catch(e) {
        handleApiErrCode(e, (tip, params) => {
          this.$bvToast.toast(tip, params)
        })
      } finally{
        this.harvesting = false
      }
    }
  },
  async mounted () {
    const len = Math.min(7, this.card.voters.length);
    const ids = this.card.voters.slice(0, len).map((a) => a.id);
    this.voters = await Promise.all(ids.map((id) => getUserBaseInfo(id)));
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
.icons-group {
  margin-left: 20px;
  margin-right: 10px;
}
</style>
