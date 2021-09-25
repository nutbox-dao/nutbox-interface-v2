<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div
        class="page-back-text-icon font20"
        style="line-height: 1rem"
        @click="$router.back()"
      >
        {{ $t("community.voteProposal") }}
      </div>
    </div>
    <b-alert variant="danger" :show="!isValid">
      {{
        $t("community.validationWarning.basic.minScore", [
          form.threshold,
          form.symbol,
        ])
      }}</b-alert
    >
    <div class="mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">
          {{ $t("community.proposalConfigLabel") }}
        </div>
        <div class="custom-form pl-md-3">
          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalTitle')"
            label-for="proposalTitleInput"
          >
            <b-form-input
              id="proposalTitleInput"
              required
              :placeholder="$t('community.proposalTitleInput')"
              v-model="proposal.title"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalTime')"
            label-for="proposalStart"
          >
            <b-form-datepicker
              id="proposalStart"
              class="mb-2"
              :placeholder="$t('community.proposalStart')"
              v-model="proposal.start"
            ></b-form-datepicker>
            -
            <b-form-datepicker
              id="proposalEnd"
              class="mb-2"
              :placeholder="$t('community.proposalEnd')"
              v-model="proposal.end"
            ></b-form-datepicker>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalBody')"
            label-for="proposalBodyInput"
          >
            <b-form-textarea
              id="proposalBodyInput"
              required
              :placeholder="$t('community.proposalBodyInput')"
              rows="8"
              v-model="proposal.body"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalBodyPreview')"
          >
            <Markdown :body="proposal.body" />
          </b-form-group>

          <b-button
            type="submit"
            variant="primary"
            @click="submitProposal"
            :disabled="!isValid"
            >{{ $t("community.commit") }}</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { handleApiErrCode, sleep } from "@/utils/helper";
import BSCAccount from "@/components/Accounts/BSCAccount";
import PolkadotAccount from "@/components/Accounts/PolkadotAccount";
import SteemAccount from "@/components/Accounts/SteemAccount";
import HiveAccount from "@/components/Accounts/HiveAccount";
import Markdown from "@/components/Commen/Markdown";
import { getBalance } from "@/utils/web3/asset.js";
import {
  getScores,
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
    ...mapGetters("web3", ["communityById"]),
    communityInfo() {
      const com = this.communityById(this.communityId);
      console.log("communityInfo", com);
      return com;
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
        getBalance().then((res) => {
          this.totalScore = parseFloat(res.toString() / 1e18);
          this.isValid = this.totalScore >= this.form.threshold;
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async submitProposal() {
      try {
        this.proposal.communityId = this.form.communityId;
        this.proposal.strategies = this.form.strategies;
        this.proposal.network = this.form.network;
        this.proposal.threshold = this.form.threshold;
        const result = await completeProposal(this.proposal);

        if (result.code == 0) {
          this.$bvToast.toast(this.$t("tip.deployFactorySuccess"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          this.$router.replace(
            "/community/proposal-space/" + this.form.communityId
          );
        }
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.deploying = false;
      }
    },
  },
  async mounted() {
    this.form.id = this.$router.currentRoute.params.key;
    this.form.communityId = this.$router.currentRoute.params.key;

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
.community-info-card {
  @include card(1.6rem 1.2rem, white, none, auto);
  @include single-color-bg(0.3rem 1rem);
  background-position: left 1.6rem;
  .title {
    font-size: 1rem;
    line-height: 1rem;
    margin-bottom: 2rem;
  }
}
@import "src/static/css/form";
.cover-preview {
  width: 100%;
}
.edit-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  span {
    position: absolute;
    display: inline-block;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    text-align: center;
  }
}
.close-icon {
  position: absolute;
  right: -1.4rem;
  top: -1.4rem;
  @include icon(1.4rem, 1.4rem);
  background-image: url("~@/static/images/circle-close.png");
}
.cropper-container {
  height: 500px;
  max-height: 100%;
}
.crop-btn-group {
  padding: 1.2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  button {
    box-shadow: none;
    width: fit-content;
    padding: 0 2rem;
  }
}
@media (max-width: 576px) {
  .close-icon {
    top: auto;
    bottom: -2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>