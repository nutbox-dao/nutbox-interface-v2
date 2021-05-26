<template>
  <div>
    <div class="loading-bg" v-if="isLoading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <div class="row" v-else>
      <div
        class="col-lg-4 col-md-6"
        v-for="(item, index) of items"
        :key="index"
      >
        <div class="c-card">
          <div class="card-title-box flex-start-center">
            <div class="icons">
              <img class="icon1" :src="item.community.iconUrl" alt="" />
            </div>
            <div class="title-text font20 font-bold">
              <span>{{ item.community.communityName }} {{$t('cs.community')}}</span>
            </div>
          </div>
          <div class="h-line"></div>
          <div class="detail-info-box">
            <div class="project-info-container">
              <span class="name"> {{ $t("dashboard.nominators") }} </span>
              <div class="info">{{ item.nominatorCount }}</div>
            </div>
          </div>
          <button class="primary-btn" @click="downloadCsv(index)">
            <b-spinner small type="grow" v-show="isDownloading"></b-spinner>
            {{ $t("dashboard.export") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CsvExportor from "csv-exportor";
import { getDarshboardCard, getNominationSummary } from "@/apis/api";
import { formatBalance } from "@/utils/polkadot/polkadot";
import { mapState } from 'vuex'

export default {
  data() {
    return {
      items: [],
      isLoading: true,
      isDownloading: false,
      csvHeader: ["communityName", "communityId", "nominator", "createAt"],
    };
  },
  computed: {
    ...mapState('polkadot', ['account'])
  },
  methods: {
    async getRaised(raise) {
      const raised = await formatBalance(raise);
      return raised;
    },
    downloadCsv(index) {
      const card = this.items[index];
      const projectId = card.projectId;
      const communityId = card.communityId;
      this.isDownloading = true
      getNominationSummary({
        communityId,
        projectId,
      })
        .then(async (res) => {
          this.isDownloading = false
          let result = [];
          console.log("csv1", res);
          if (res.lenght === 0){
            return
          }
          result = res.map((n) => ({
            communityName: n.community.communityName,
            communityId: n.communityId,
            nominator: n.nominator,
            createAt: n.createAt,
          }));
          console.log("csv", result);
          CsvExportor.downloadCsv(
            result,
            { header: this.csvHeader },
            card.community.communityName + ".csv"
          );
        })
        .catch((err) => {
          this.isDownloading = false
          console.error("down load crowdloan info fail", err);
        });
    },
  },
  created() {
    getDarshboardCard({
      projectId: '1drufsSHHS5Mt3e8xjnPYZPxXUFCpQDKozTLUikSxccRdZY'
    })
      .then((res) => {
        this.isLoading = false;
        this.items = res;
        console.log("summary", res);
      })
      .catch((e) => {
        console.log("summary error", e);
      });
  },
};
</script>

<style lang="less" scoped>
.primary-btn{
  margin-top: 1rem;
}
</style>