<template>
  <!--  <div class="page-view-content nps">
    <div class="text-left">
      <b-alert show variant="info">简要说明</b-alert>
    </div>
    <div class="text-left">
      <label
        ><h3>{{ $t("community.voteProposal") }}</h3></label
      >
      <b-button
        variant="warning"
        class="createproposal"
        size="sm"
        @click="
          $router.push(
            `/community/${$router.currentRoute.params.key}/proposal-create`
          )
        "
      >
        {{ $t("community.createProposal") }}</b-button
      >
    </div>

    <ProposalItem
      v-for="(proposalItem, index) in proposalitems"
      :key="proposalItem.id"
      :proposalItem="proposalItem"
      :index="index"
    ></ProposalItem>
  </div>
 -->

  <div class="page-view-content nps">
    <div class="container scroll-content">
      <div class="page-view-title-v mt-5">{{ $t("nps.nps") }}</div>
      <div class="view-top-header pb-0">
        <div class="tip-box">
          <div class="page-view-title">{{ this.$t("nps.nps") }}</div>
          <div style="text-align: left; margin-top: 1rem">
            <Markdown :body="form.remark" />
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
              @click="changeTab(index)"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="c-btn-group">
          <button @click="$router.push(`${url}/nps/proposal-create?id=${id}`)">
            <i class="add-icon"></i>
            <span>Create Proposal</span>
          </button>
        </div>
      </div>
      <div class="mb-5">
        <ProposalItem
          v-for="(proposalItem, index) in proposalitems"
          :key="proposalItem.id"
          :proposalItem="proposalItem"
          :index="index"
        ></ProposalItem>
      </div>
    </div>
  </div>
</template>

<script>
import ProposalItem from "../../components/Community/Proposal/ProposalItem.vue";
import { handleApiErrCode, sleep } from "@/utils/helper";
import { getAllProposal } from "@/utils/web3/proposal";
import { MAIN_COMMUNITY_ID } from "../../config";
import { getMyCommunityProposalConfigInfo } from "@/utils/web3/communityProposalConfig";
import { getAccounts } from "@/utils/web3/account";
import Markdown from "@/components/Commen/Markdown";
export default {
  name: "Community",
  components: {
    ProposalItem,
    Markdown,
  },
  data() {
    return {
      url: "",
      tempProposalItem: [],
      proposalitems: [],
      tabOptions: ["ALL", "Voting", "Passed", "Rejected", "My proposal"],
      activeTab: 0,
      form: {
        communityId: "",
        network: "",
        networkName: "",
        symbol: "",
        skin: "",
        admins: "",
        members: "",
        strategies: "",
        threshold: 0,
        validation: "basic",
        onlyMembers: 0,
        userId: "",
        remark: "",
      },
    };
  },
  methods: {
    changeTab(index) {
      this.activeTab = index;
      if (this.activeTab == 0) {
        this.proposalitems = this.tempProposalItem;
      } else if (this.activeTab == 1) {
        this.proposalitems = this.tempProposalItem.filter((t) => t.status == 1);
      } else if (this.activeTab == 2) {
        this.proposalitems = this.tempProposalItem.filter(
          (t) => t.proposalResult == 1
        );
      } else if (this.activeTab == 3) {
        this.proposalitems = this.tempProposalItem.filter(
          (t) => t.proposalResult == 2
        );
      } else if (this.activeTab == 4) {
        this.proposalitems = this.tempProposalItem.filter(
          (t) => t.userId == this.userId
        );
      }
    },
  },
  async mounted() {
    this.userId = await getAccounts();
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
    this.form.communityId = this.communityId;
    try {
      this.tempProposalItem = await getAllProposal(this.communityId);
      this.proposalitems = this.tempProposalItem;

      const communityProposalConfigInfo =
        await getMyCommunityProposalConfigInfo(this.form.communityId);

      this.form = communityProposalConfigInfo;
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
};
</script>

<style scoped lang="scss">
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
