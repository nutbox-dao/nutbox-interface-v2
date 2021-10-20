<template>
  <div class="page-view-content nps">
    <div class="container scroll-content">
      <div class="page-view-title-v mt-5">{{ $t("nps.nps") }}</div>
      <div class="view-top-header pb-0">
        <div class="tip-box">
          <div class="page-view-title">{{ this.$t("nps.nps") }}</div>
          <div style="text-align: left; margin-top: 1rem">
            {{ $t("nps.npsTemp") }}
          </div>
        </div>
      </div>
      <div class="view-top-header view-top-header-sticky flex-between-center">
        <div class="nav-box nav-box-bg">
          <div class="nav">
            <span
              v-for="(item, index) of tabOptions"
              :key="index"
              :class="activeTab === index ? 'active' : ''"
              @click="activeTab = index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="c-btn-group">
          <button @click="$router.push('create-proposal')">
            <i class="add-icon"></i>
            <span>Create Proposal</span>
          </button>
        </div>
      </div>
      <div class="mb-5">
        <div
          class="nps-card"
          v-for="(item, index) in proposalList"
          :key="item.num"
        >
          <div class="proposal">
            <p
              style="
                width: 32px;
                height: 32px;
                border-radius: 16px;
                border: 1px solid var(--primary-custom);
                font-size: 14px;
                line-height: 32px;
              "
            >
              {{ index + 1 }}
            </p>
            <a
              target="_blank"
              :href="'https://blog.nutbox.io/@' + item.author"
              style="width: 100px; text-align: left"
            >
              {{ item.author }}
            </a>
            <a
              target="_blank"
              :href="
                'https://blog.nutbox.io/@' + item.author + '/' + item.permlink
              "
              style="
                flex: 1;
                text-align: left;
                font-weight: 500;
                border-radius: 8px;
              "
            >
              {{ item.title }}
            </a>
            <p
              :class="item.status"
              style="
                font-size: 14px;
                font-weight: 600;
                line-height: 24px;
                padding: 0px 6px;
              "
            >
              <!--{{ new Date(item.timestamp+'Z') | timeFormat}} -->
              {{ statusDesc(item.status) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProposal } from "@/apis/api";
import Card from "@/components/ToolsComponents/Card";
import { getDateString } from "@/utils/helper";

export default {
  name: "Nps",
  data() {
    return {
      proposalList: [],
      tabOptions: ["ALL", "Voting", "Passed", "Rejected"],
      activeTab: 0,
    };
  },
  filters: {
    timeFormat: function (value) {
      return getDateString(value, 8);
    },
  },
  components: {
    Card,
  },
  methods: {
    statusDesc(status) {
      if (status === "pass") {
        return this.$t("nps.pass");
      } else if (status === "pending") {
        return this.$t("nps.pending");
      } else if (status === "unpass") {
        return this.$t("nps.unpass");
      } else if (status === "rolling") {
        return this.$t("nps.rolling");
      }
    },
  },
  async mounted() {
    const res = await getProposal();
    this.proposalList = res;
  },
};
</script>

<style lang="scss" scoped>
.nps {
  .tip-box {
    @include card(2rem 1.2rem, rgba(0, 0, 0, 0.2), hidden, fit-content);
    color: white;
  }
  .nps-card {
    height: 108px;
    background: white;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.02);
    border-radius: 28px;
    border: 1px solid rgba(227, 229, 232, 0.5);
  }
}
@media (max-width: 560px) {
  .view-top-header {
    flex-direction: column;
    align-items: flex-end;
  }
  .nav-box {
    margin-bottom: 0.5rem;
  }
}
</style>
