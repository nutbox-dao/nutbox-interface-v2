<template>
  <div class="container scroll-content d-flex flex-column">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">
        {{ $t("nps.proposalConfigLabel") }}
      </div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form text-left">
        <b-form-group
          label-cols-md="2"
          content-cols-md="10"
          :label="$t('nps.remark')"
          label-for="remarkInput"
          label-class="d-flex font16 font-bold "
        >
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-textarea
                id="remark"
                :placeholder="$t('nps.remarkInput')"
                v-model="form.remark"
                rows="10"
                max="2046"
              ></b-form-textarea>
            </div>
          </div>
        <div class="mt-3">{{ $t('nps.markdownTip') }}</div>
        </b-form-group>
        <b-form-group
          label-cols-md="2"
          content-cols-md="10"
          :label="$t('nps.proposalBodyPreview')"
          label-for="remarkInput"
          label-class="d-flex font16 font-bold "
        >
          <div class="d-flex">
            <div class="c-input-group p-3" style="min-height: 2.4rem">
              <Markdown :body="form.remark" />
            </div>
          </div>
        </b-form-group>

        <b-form-group
          label-cols-md="2"
          content-cols-md="5"
          :label="$t('nps.proposalThreshold')"
          label-for="proposalThresholdInput"
          label-class="d-flex align-items-center font16 font-bold "
        >
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input
                id="proposalThreshold"
                :placeholder="$t('nps.proposalThresholdInput')"
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
          :label="$t('nps.proposalPassThreshold')"
          label-for="proposalPassThresholdInput"
          label-class="d-flex align-items-center font16 font-bold"
        >
          <div class="d-flex align-items-center">
            <div class="c-input-group">
              <b-form-input
                id="proposalPassThreshold"
                :placeholder="$t('nps.proposalPassThresholdInput')"
                v-model="form.passthreshold"
                type="number"
              ></b-form-input>
               <span class="c-append">{{ form.symbol }}</span>
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
import { getCToken } from '@/utils/web3/asset'
import { getMyCommunityInfo } from "@/utils/web3/community";
import {
  BSC_CHAIN_ID,
  BSC_CHAIN_NAME,
  BSC_STRATEGIES_NAME,
} from "../../config";
import Markdown from "@/components/Commen/Markdown";
import { nanoid } from "nanoid";
import { mapState } from 'vuex'

export default {
  name: "VoteSetting",
  components: {
    Markdown,
  },
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
  computed: {
    ...mapState('web3', ['communityProposalConfig'])
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

      const token = await getCToken(communityInfo.id);

      let strategyParamsObj = {};
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
      this.form = this.communityProposalConfig ?? this.form
      getMyCommunityProposalConfigInfo(communityInfo.id).then(res => {
        if (res){
          this.form = res
          this.strategyControlItems = JSON.parse(this.form.strategies);
        }
      });

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
