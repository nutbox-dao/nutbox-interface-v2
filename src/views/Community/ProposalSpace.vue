<template>
  <div class="page-view-content nps">
    <div class="container scroll-content">
      <div class="page-view-title-v mt-5">{{ $t("nps.nps") }}</div>
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <template v-else>
      <div class="view-top-header pb-0">
        <div class="tip-box">
          <div style="text-align: left">
            <Markdown :body="form ? form.remark : ''" />
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
              >{{ $t('nps.' + item) }}</span
            >
          </div>
        </div>
        <div class="c-btn-group">
          <button @click="$router.push(`${url}/nps/proposal-create?id=${id}`)">
            <i class="add-icon"></i>
            <span>{{ $t('nps.createProposal') }}</span>
          </button>
        </div>
      </div>

      <div class="empty-bg" v-if="!proposalitems || proposalitems.length === 0">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t("nps.noProposals") }}</p>
      </div>
      <div class="mb-5" v-else>
        <ProposalItem
          v-for="(proposalItem, index) in proposalitems"
          :key="proposalItem.id"
          :proposalItem="proposalItem"
          :index="index"
        ></ProposalItem>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import ProposalItem from "../../components/Community/Proposal/ProposalItem.vue";
import { handleApiErrCode } from "@/utils/helper";
import { getAllProposal } from "@/utils/web3/proposal";
import { MAIN_COMMUNITY_ID } from "../../config";
import { getMyCommunityProposalConfigInfo } from "@/utils/web3/communityProposalConfig";
import Markdown from "@/components/Commen/Markdown";
import { mapState } from 'vuex'

export default {
  name: "Community",
  components: {
    ProposalItem,
    Markdown,
  },
  computed: {
    ...mapState({
      form: state => state.web3.communityProposalConfig,
      proposals: state => state.web3.proposals,
      account: state => state.web3.account
    }),
    // status: 0 unstart,1 voting, 2 end
    // proposalresult: 0 unstart, 1 pass, 2 unpass.
    proposalitems(){
      if (!this.proposals) return []
      if (this.activeTab == 0) {
        return this.proposals;
      } else if (this.activeTab == 1) {
        return this.proposals.filter((t) => t.status == 1);
      } else if (this.activeTab == 2) {
        return this.proposals.filter(
          (t) => t.proposalResult == 1
        );
      } else if (this.activeTab == 3) {
        return this.proposals.filter(
          (t) => t.proposalResult == 2
        );
      } else if (this.activeTab == 4) {
        return this.proposals.filter(
          (t) => t.userId == this.account
        );
      }
    }
  },
  data() {
    return {
      url: "",
      tabOptions: ["all", "rolling", "pass", "unpass", "mine"],
      activeTab: 0,
      loading: false
    };
  },
  async mounted() {
    this.loading = true
    this.url =
      this.$router.currentRoute.params.key || this.$route.query.id
        ? "/specify"
        : "";

    this.id = this.$router.currentRoute.params.key
      ? this.$router.currentRoute.params.key
      : this.$route.query.id
      ? this.$route.query.id
      : MAIN_COMMUNITY_ID;

    this.communityId = this.id;
    try {
      getAllProposal(this.communityId);
      getMyCommunityProposalConfigInfo(this.communityId).then(console.log);
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }finally{
      this.loading = false
    }
  },
};
</script>

<style scoped lang="scss">
.nps {
  .tip-box {
    @include card(2rem 1.2rem, rgba(0, 0, 0, 0.2), hidden, fit-content);
    color: white;
    background-image: url('~@/static/images/poster.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
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
  .proposal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
    p,
    a {
      margin: 0 10px;
      color: var(--primary-text);
      font-size: 16px;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      max-height: 60px;
      font-weight: 600;
      line-height: 20px;
    }
    a:hover {
      color: var(--link);
    }

    .pass {
      background: rgba(80, 191, 0, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(80, 191, 0, 0.3);
      color: var(--success);
    }
    .pending {
      background: rgba(255, 219, 38, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 219, 38, 0.3);
      color: var(--warning);
    }
    .unpass {
      background: rgba(255, 91, 77, 0.051);
      border-radius: 8px;
      border: 1px solid rgba(255, 91, 77, 0.3);
      color: var(--error);
    }
    .rolling {
      background: #408fff0d;
      border-radius: 8px;
      border: 1px solid #408fff4d;
      color: var(--link);
    }
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
