<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="status-container text-right">
        <span :class="status">{{ $t('cl.'+status) }}</span>
      </div>
      <div class="flex-start-center">
        <div class="card-link-icons">
          <img
            class="icon1"
            :src="getCardInfo && getCardInfo.community.iconUrl"
            alt=""
          />
          <img
            class="icon2"
            :src="getCardInfo && getCardInfo.para.iconUrl"
            alt=""
          />
        </div>
        <div class="card-link-title-text font20 font-bold">
          <div class="link-title">
            <span class="font20">
              {{getCardInfo && getCardInfo.community.communityName + " " + $t('cl.community')}}
            </span>
            <i class="link-icon"></i>
          </div>
          <div class="link-title">
            <span class="font16">{{getCardInfo && getCardInfo.para.paraName}}</span>
            <i class="link-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card">
      <div class="detail-info-box">
        <div class="project-info-container">
          <span class="name"> Lease period </span>
          <div class="info">{{ leasePeriod || "test data" }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> Countdown </span>
          <div class="info">{{ countDown || "test data" }}</div>
        </div>
        <div class="project-info-container">
          <span class="name"> Fund </span>
          <div class="info">
            <RaisedLabel :paraId="paraId" />
            <ContributorsLabel :paraId="paraId" />
          </div>
        </div>
        <div class="project-info-container">
          <span class="name"> My Data </span>
          <div class="info">
            <RaisedLabel :isBalance="true" :paraId="paraId" />
          </div>
        </div>
      </div>
      <template v-if="isConnected">
        <button
          class="primary-btn"
          v-show="status === 'Active'"
          @click="showContribute = true"
        >
          {{ $t('cl.contribute') }}
        </button>
        <button
          class="primary-btn"
          v-show="status === 'Retired'"
          @click="showWithdraw = true"
        >
          {{ $t('cl.withdraw') }}
        </button>
        <button
          class="primary-btn"
          disabled
          v-show="status === 'Completed'"
        >
          {{ $t('cl.completed') }}
        </button>
      </template>
    </div>
    <!-- <ConnectWallet v-else /> -->
    <b-modal
      v-model="showContribute"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipContribute
        :communityId="communityId"
        :paraId="paraId"
        :paraName="getCardInfo && getCardInfo.para.paraName"
        :symbol='symbol'
        @hideContribute="showContribute = false"
      />
    </b-modal>
    <b-modal
      v-model="showWithdraw"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <TipWithdraw :paraId="paraId" @hideWithdraw="showWithdraw = false" />
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// import ConnectWallet from "./Buttons/ConnectWallet";
import TipContribute from "./TipBoxes/TipContribute";
import TipWithdraw from "./TipBoxes/TipWithdraw";
import ContributorsLabel from "./Label/ContributorsLabel";
import RaisedLabel from "./Label/RaisedLabel";
import { PARA_STATUS } from "@/config";
import { BLOCK_SECOND, TIME_PERIOD } from "@/constant";
import { calStatus } from "@/utils/kusama/crowdloan";

export default {
  data() {
    return {
      showContribute: false,
      showWithdraw: false,
      status: PARA_STATUS.COMPLETED,
    };
  },
  props: {
    paraId: {
      type: Number,
    },
    communityId: {
      type: String,
    },
    symbol:{
      type: String,
      default:'kusama'
    }
  },
  components: {
    TipContribute,
    TipWithdraw,
    ContributorsLabel,
    RaisedLabel,
  },
  watch: {
    async currentBlockNum(newValue, _) {
      const fund = this.getFundInfo;
      const end = fund.end;
      const raised = fund.raised;
      const cap = fund.cap;
      const firstSlot = fund.firstSlot;
      const [status] = await calStatus(
        end,
        firstSlot,
        raised,
        cap,
        this.paraId,
        newValue
      );
      this.status = status;
    },
  },
  computed: {
    ...mapState('kusama', ["isConnected", "clProjectFundInfos"]),
    ...mapState(['lang']),
    ...mapGetters('kusama', [
      "fundInfo",
      "currentBlockNum",
      "cardInfo",
    ]),
    getFundInfo() {
      return this.fundInfo(this.paraId);
    },
    getCardInfo() {
      const card = this.cardInfo(this.paraId, this.communityId);
      return card;
    },
    leasePeriod() {
      try {
        const first = parseInt(this.getFundInfo.firstSlot);
        const last = parseInt(this.getFundInfo.lastSlot);
        return first === last
          ? first + ""
          : parseInt(this.getFundInfo.firstSlot) +
              " - " +
              parseInt(this.getFundInfo.lastSlot);
      } catch (e) {
        return "0";
      }
    },
    countDown() {
      try {
        if (!this.getFundInfo) return;
        const end = parseInt(this.getFundInfo.end);
        const diff = end - parseInt(this.currentBlockNum);
        const timePeriod = TIME_PERIOD;
        if (diff > 0) {
          const secs = diff * BLOCK_SECOND;
          const month = Math.floor(secs / timePeriod["MONTH"]);
          const day = Math.floor(
            (secs % timePeriod["MONTH"]) / timePeriod["DAY"]
          );
          const hour = Math.floor(
            (secs % timePeriod["DAY"]) / timePeriod["HOUR"]
          );
          const min = Math.floor(
            (secs % timePeriod["HOUR"]) / timePeriod["MINUTES"]
          );
          const sec = Math.floor(secs % timePeriod["MINUTES"]);
          if (secs >= timePeriod["MONTH"]) {
            return month + "mons" + day + "days" + hour + "hrs";
          } else if (secs >= timePeriod["DAY"]) {
            return day + "days" + hour + "hrs" + min + "mins";
          } else if (secs >= timePeriod["HOUR"]) {
            return hour + "hrs" + min + "mins";
          } else {
            return min + "mins" + sec + "sec";
          }
        }
        return "Completed";
      } catch (e) {
        console.error("err", e);
        return "";
      }
    },
    completion() {
      try {
        const raised = parseFloat(this.getFundInfo.raised);
        const cap = parseFloat(this.getFundInfo.cap);
        return parseFloat((raised * 100) / cap).toFixed(2) + "%";
      } catch (e) {
        return "0.0%";
      }
    },
    contributions() {
      try {
        return this.getFundInfo.funds.length;
      } catch (e) {
        return 0;
      }
    },
    statusIcon() {
      switch (this.status) {
        case "Active":
          return this.lang === 'en' ? require("../../static/images/card-active.svg") : require("../../static/images/card-active-cn.png");
        case "Retired":
          return this.lang === 'en' ? require("../../static/images/card-retired.svg") : require('../../static/images/card-retired-cn.png');
        default:
          return this.lang === 'en' ? require("../../static/images/card-completed.svg") : require('../../static/images/card-completed-cn.png');
      }
    },
  },
  mounted() {
    this.status = this.getFundInfo.status;
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.c-card {
  flex: 1;
  margin-top: -1.2rem;
}
</style>
