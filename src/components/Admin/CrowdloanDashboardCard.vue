<template>
  <div class="row">
    <div class="loading-bg" v-if="isLoading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <div class="col-lg-4 col-md-6" v-for="(item, index) of items" :key="index">
      <div class="c-card">
        <div class="card-title-box flex-start-center">
          <div class="icons">
            <img class="icon2" :src="item.para.iconUrl" alt="" />
            <img class="icon1" :src="item.community.iconUrl" alt="" />
          </div>
          <div class="title-text font20 font-bold">
            <span>{{ item.community.communityName }}</span>
            <img src="~@/static/images/close.svg" alt="" />
            <span>{{ item.para.paraName }}</span>
          </div>
        </div>
        <div class="h-line"></div>
        <div class="detail-info-box">
          <div class="project-info-container">
            <span class="name"> Contributors </span>
            <div class="info">{{ item.contributorCount }}</div>
          </div>
          <div class="project-info-container">
            <span class="name"> Fund </span>
            <div class="info">{{ item.raised }}</div>
          </div>
        </div>
        <button class="primary-btn" @click="downloadCsv(index)">
          {{ $t("dashboard.export") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CsvExportor from "csv-exportor";
import { getDashboardSummary, getExportContributionInfo } from "@/apis/api";
import { formatBalance } from "@/utils/kusama/kusama";
import { formatDate } from "@/utils/polkadot/utils";

export default {
  data() {
    return {
      items: [],
      isLoading: true,
      csvHeader: [
        "communityName",
        "paraName",
        "trieIndex",
        "firstSlot",
        "lastSlot",
        "contributor",
        "nominatorId",
        "amount",
        "contributeTime",
      ],
    };
  },
  props: {
    chain: {
      type: String,
    },
  },
  methods: {
    async getRaised(raise) {
      const raised = await formatBalance(raise);
      return raised;
    },
    downloadCsv(index) {
      const card = this.items[index];
      const paraId = card.para.paraId;
      const trieIndex = card.trieIndex;
      getExportContributionInfo({
        relaychain: this.chain.toLowerCase(),
        communityId: this.$store.state.polkadot.account.address,
        paraId,
        trieIndex,
        offset: null,
        limit: null,
      })
        .then(async (res) => {
          let csv = res.data;
          let result = [];
          console.log("csv1", csv);
          for (let r of csv) {
            const amount = await formatBalance(r.amount);
            result.push({
              communityName: card.community.communityName,
              paraName: card.para.paraName,
              trieIndex,
              firstSlot: card.firstSlot,
              lastSlot: card.lastSlot,
              contributor: r.contributor,
              nominatorId: r.nominatorId,
              amount,
              contributeTime: formatDate(r.createdAt),
            });
          }
          console.log("csv", result);
          CsvExportor.downloadCsv(
            result,
            { header: this.csvHeader },
            card.community.communityName +
              "-" +
              card.para.paraName +
              "-" +
              card.trieIndex +
              ".csv"
          );
        })
        .catch((err) => {
          console.error("down load crowdloan info fail", err);
        });
    },
  },
  created() {
    getDashboardSummary({
      relaychain: "rococo",
      communityId: "5ChZmLcNRWAbvM38BKgnFPjF6uUbWWr5FKFyBBjPtsb6F4jF",
    })
      .then(async (res) => {
        this.isLoading = false;
        console.log("dashboard", res);
        let cards = [];
        for (let card of res) {
          const raised = await this.getRaised(card.raisedAmount);
          card.raised = raised;
          cards.push(card);
        }
        this.items = cards;
      })
      .catch((err) => {
        console.error("request dashboard fail", err);
      });
  },
};
</script>

<style lang="scss" scoped>
.primary-btn{
  margin-top: 1rem;
}
</style>