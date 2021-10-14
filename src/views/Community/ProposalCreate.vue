<template>
  <div class="container scroll-content">
    <div class="page-view-title-v mt-5">{{ $t("nps.nps") }}</div>
    <div class="view-top-header">
      <div class="page-back-text-icon font20" @click="$router.back()">
        {{ $t('nps.createProposal') }}
      </div>
    </div>
    <div class="c-card mb-5">
      <b-alert variant="danger" :show="!isValid">
        {{
          $t("nps.validationWarning.basic.minScore", [
            form.threshold,
            form.symbol,
          ])
        }}</b-alert
      >
      <div class="custom-form">
        <b-form-group
          :label="$t('nps.title')"
          label-for="proposalTitleInput"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalTitleInput"
            required
            :placeholder="$t('nps.proposalTitleInput')"
            v-model="proposal.title"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('community.currentBlock')"
          label-for="proposalCurrent"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalCurrent"
            required
            class="mb-2"
            :value="blockNum"
            readonly
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('nps.proposalFirst_Block')"
          label-for="proposalStart"
          :description="startTime"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalStart"
            required
            class="mb-2"
            :placeholder="$t('nps.proposalFirst_Block')"
            v-model="proposal.first_block"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('nps.proposalEnd_Block')"
          label-for="proposalEnd"
          :description="endTime"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalEnd"
            required
            class="mb-2"
            :placeholder="$t('nps.proposalEnd_Block')"
            v-model="proposal.end_block"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('nps.proposalBody')"
          label-for="proposalBodyInput"
          label-class="text-left font16"
        >
          <b-form-textarea
            id="proposalBodyInput"
            required
            :placeholder="$t('nps.proposalBodyInput')"
            rows="8"
            v-model="proposal.body"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group
          :label="$t('nps.proposalBodyPreview')"
          label-class="text-left font16"
        >
          <Markdown :body="proposal.body" class="text-left font16" />
        </b-form-group>

        <button
          class="primary-btn w-75"
          @click="submitProposal"
          :disabled="commiting"
        >
          <b-spinner small type="grow" v-show="commiting" />
          {{ $t("community.commit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { handleApiErrCode, blockTimeWithoutUTC } from "@/utils/helper";
import BSCAccount from "@/components/Accounts/BSCAccount";
import PolkadotAccount from "@/components/Accounts/PolkadotAccount";
import SteemAccount from "@/components/Accounts/SteemAccount";
import HiveAccount from "@/components/Accounts/HiveAccount";
import Markdown from "@/components/Commen/Markdown";
import { MAIN_COMMUNITY_ID } from "../../config";
import {
  getScore,
  getMyCommunityProposalConfigInfo,
} from "@/utils/web3/communityProposalConfig";

import { completeProposal } from "@/utils/web3/proposal";

export default {
  name: "ProposalCreate",
  components: {
    BSCAccount,
    PolkadotAccount,
    SteemAccount,
    HiveAccount,
    Markdown,
  },
  data() {
    return {
      url: "",
      commiting: false,
      communityId: null,
      activeTab: 0,
      proposal: {
        title: "",
        userId: "",
        communityId: "",
        network: "",
        type: "proposal",
        start: "",
        end: "",
        body: "",
        first_block: 0,
        end_block: 0,
      },
      noCommunity: false,
      isValid: false,
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
      },
    };
  },
  computed: {
    ...mapState({
      blockNum: (state) => state.web3.blockNum,
    }),
    ...mapGetters("web3", ["communityById"]),
    communityInfo() {
      const com = this.communityById(this.communityId);
      console.log("communityInfo", com);
      return com;
    },
    startTime() {
      return blockTimeWithoutUTC(this.blockNum, this.proposal.first_block);
    },
    endTime() {
      return blockTimeWithoutUTC(this.blockNum, this.proposal.end_block);
    },
  },
  watch: {
    "form.network": {
      handler(newValue, oldValue) {
        const validationName = "basic";

        const strategies = [];
        if (this.form.strategies) {
          const formStrategies = JSON.parse(this.form.strategies).forEach(
            (element) => {
              strategies.push(element.strategies);
            }
          );
        }
        var params = {
          space: "",
          strategies,
          network: this.form.network,
        };

        getScore(params).then((res) => {
          const totalScore = res;
          this.isValid = totalScore >= this.form.threshold;
          this.proposal.network = this.form.network;
          this.proposal.strategies = JSON.stringify(strategies);
          this.proposal.communityId = this.form.communityId;
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async submitProposal() {
      try {
        this.commiting = true;
        this.proposal.communityId = this.form.communityId;
        this.proposal.strategies = this.form.strategies;
        this.proposal.network = this.form.network;
        this.proposal.threshold = this.form.threshold;
        this.proposal.passthreshold = this.form.passthreshold;

        this.proposal.start = this.startTime;

        this.proposal.end = this.endTime;
        const result = await completeProposal(this.proposal);

        if (result.code == 0) {
          this.$bvToast.toast(this.$t("tip.completeProposalSuccess"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          /* this.$router.replace("/nps/proposal-space/" + this.form.communityId); */
          this.$router.back();
        }
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.commiting = false;
      }
    },
  },
  async mounted() {
    this.url =
      this.$router.currentRoute.params.key || this.$route.query.id
        ? "/specify"
        : "";
    this.form.id = this.$router.currentRoute.params.key
      ? this.$router.currentRoute.params.key
      : this.$route.query.id
      ? this.$route.query.id
      : MAIN_COMMUNITY_ID;

    this.form.communityId = this.form.id;
    try {
      const communityProposalConfigInfo =
        await getMyCommunityProposalConfigInfo(this.form.communityId);

      this.form = communityProposalConfigInfo;

      this.strategyControlItems = JSON.parse(this.form.strategies);
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
};
</script>
<style  lang="scss" scoped>
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem 4rem, white, hidden, fit-content);
}
.custom-form {
  max-width: 30rem;
  margin: auto;
}
textarea {
  min-height: 14rem;
}

.date-icon {
  @include icon();
  background-image: url("~@/static/images/list-down-arrow.svg");
}
</style>