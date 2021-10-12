<template>
  <div class="container scroll-content d-flex flex-column">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">
        {{ $t("community.proposalConfigLabel") }}
      </div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form text-left">
        <b-form-group
          label-cols-md="2"
          content-cols-md="5"
          :label="$t('community.remark')"
          label-for="remarkInput"
          label-class="d-flex align-items-center font16 font-bold "
        >
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input
                id="remark"
                :placeholder="$t('community.remarkInput')"
                v-model="form.remark"
                max="2046"
              ></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group
          label-cols-md="2"
          content-cols-md="5"
          :label="$t('community.proposalThreshold')"
          label-for="proposalThresholdInput"
          label-class="d-flex align-items-center font16 font-bold "
        >
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input
                id="proposalThreshold"
                :placeholder="$t('community.proposalThresholdInput')"
                v-model="form.threshold"
                type="number"
              ></b-form-input>
              <span class="c-append">{{ form.symbol }}</span>
            </div>
          </div>
        </b-form-group>
        <b-form-group
          label-cols-md="2"
          content-cols-md="5"
          :label="$t('community.proposalPassThreshold')"
          label-for="proposalPassThresholdInput"
          label-class="d-flex align-items-center font16 font-bold"
        >
          <div class="d-flex align-items-center">
            <div class="c-input-group">
              <b-form-input
                id="proposalPassThreshold"
                :placeholder="$t('community.proposalPassThresholdInput')"
                v-model="form.passThreshold"
                type="number"
              ></b-form-input>
              <!--  <span class="c-append">%</span> -->
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="5" label="">
          <button class="primary-btn" @click="submitForm" :disabled="updateing">
            <b-spinner small type="grow" v-show="updateing" />
            {{ $t("commen.update") }}
          </button>
        </b-form-group>
      </div>
    </div>

    <b-modal
      v-model="noCommunity"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center my-5">
          {{ $t("community.noCommunity") }}
        </div>
        <button class="primary-btn" @click="gotoCreate">
          {{ $t("community.gotoCreate") }}
        </button>
      </div>
    </b-modal>

    <b-modal
      v-model="notYourCommunity"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center my-5">
          {{ $t("community.notYourCommunity") }}
        </div>
        <button class="primary-btn" @click="goToHome">
          {{ $t("commen.goToHome") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  completeCommunityProposalConfigInfo,
  getMyCommunityProposalConfigInfo,
} from "@/utils/web3/communityProposalConfig";
import { handleApiErrCode } from "@/utils/helper";
import { getMyCommunityInfo, getCommunityToken } from "@/utils/web3/community";
import {
  BSC_CHAIN_ID,
  BSC_CHAIN_NAME,
  BSC_STRATEGIES_NAME,
  BSC_STRATEGIES_PARAMS,
} from "../../config";

import { nanoid } from "nanoid";

export default {
  name: "VoteSetting",
  data() {
    return {
      updateing: false,
      communityId: null,
      activeTab: 0,
      type: "insert",
      modalNetworksOpen: false,
      modalStrategyOpen: false,
      modelEditStrategyOpen: false,
      currentStrategyControlId: "",
      currentStrategyKey: "",
      currentStrategyParams: "",
      strategyControlItems: [],
      noCommunity: false,
      notYourCommunity: false,
      strategies: null,
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
        passthreshold: 0,
        validation: "basic",
        onlyMembers: 0,
        userId: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        this.updateing = true;

        this.form.strategies = JSON.stringify(
          this.strategyControlItems,
          null,
          4
        );

        const resCode = await completeCommunityProposalConfigInfo(
          this.form,
          this.type
        );

        // go to community dashboard
        this.$bvToast.toast(
          this.$t("tip.completeCommunityProposalConfigSuccess"),
          {
            title: this.$t("tip.tips"),
            variant: "success",
          }
        );
      } catch (e) {
        const handleRes = handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      } finally {
        this.updateing = false;
      }
    },
    gotoCreate() {
      this.$router.push("/community/create-economy");
    },
    goToHome() {
      this.$router.push("/");
    },
  },
  async mounted() {
    try {
      const communityInfo = await getMyCommunityInfo();

      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }

      this.form.id = communityInfo.id;
      this.form.communityId = communityInfo.id;

      const token = await getCommunityToken(communityInfo.ctoken);

      let strategyParamsObj = JSON.parse(BSC_STRATEGIES_PARAMS);
      strategyParamsObj.address = token.address;
      strategyParamsObj.symbol = token.symbol;
      strategyParamsObj.decimals = token.token_decimal;
      this.form.symbol = token.symbol;

      const currentItem = {
        strategyControlId: nanoid(),
        strategyKey: BSC_STRATEGIES_NAME,
        strategyParams: JSON.stringify(strategyParamsObj, null, 4),
        strategies: {
          name: BSC_STRATEGIES_NAME,
          params: strategyParamsObj,
        },
      };

      this.strategyControlItems.push(currentItem);
      this.form.network = BSC_CHAIN_ID;
      this.form.networkName = BSC_CHAIN_NAME;

      const communityProposalConfigInfo =
        await getMyCommunityProposalConfigInfo(communityInfo.id);

      if (communityProposalConfigInfo) {
        this.form = communityProposalConfigInfo;
      }

      if (this.form.strategies)
        this.strategyControlItems = JSON.parse(this.form.strategies);
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem, white, none, auto);
  flex: 1;
}
</style>
