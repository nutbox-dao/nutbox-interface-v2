<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div
        class="page-back-text-icon font20"
        style="line-height: 1rem"
        @click="$router.back()"
      >
        {{ $t("community.communityInfo") }}
      </div>
    </div>
    <div class="mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">
          {{ $t("community.proposalConfigLabel") }}
        </div>
        <div class="custom-form pl-md-3">
          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalNetwork')"
            label-for="proposalNetwork"
          >
            <b-form-input
              id="proposalNetwork"
              required
              :placeholder="$t('community.proposalNetworkInput')"
              v-model="form.networkName"
              readonly
              @click="selectNetWork"
            ></b-form-input>
            <b-form-input hidden required v-model="form.network"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalSymbol')"
            label-for="proposalSymbol"
          >
            <b-form-input
              id="proposalSymbol"
              required
              :placeholder="$t('community.proposalSymbolInput')"
              v-model="form.symbol"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalSkin')"
            label-for="proposalSkin"
            v-show="false"
          >
            <b-form-input
              id="proposalSkin"
              required
              :placeholder="$t('community.proposalSkinInput')"
              v-model="form.skin"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalAdmins')"
            label-for="proposalAdmins"
            v-show="false"
          >
            <b-form-textarea
              id="proposalAdmins"
              required
              :placeholder="$t('community.proposalAdminsInput')"
              rows="4"
              v-model="form.admins"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalMembers')"
            label-for="proposalMembers"
            v-show="false"
          >
            <b-form-textarea
              id="proposalMembers"
              required
              :placeholder="$t('community.proposalMembersInput')"
              rows="4"
              v-model="form.members"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalStrategies')"
            label-for="proposalStrategies"
          >
            <b-input-group
              v-for="(item, index) in strategyControlItems"
              :key="item.strategyControlId"
            >
              <b-form-input
                :placeholder="$t('community.proposalStrategiesInput')"
                readonly
                @click="selectStrategy(item)"
                v-model="item.strategyKey"
              ></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" @click="editStrategy(item)">{{
                  $t("community.edit")
                }}</b-button>
                <b-button
                  variant="primary"
                  v-show="index == 0"
                  @click="addStrategy()"
                  >{{ $t("commen.add") }}</b-button
                >
                <b-button
                  variant="primary"
                  v-show="index > 0"
                  @click="removeStrategy(item.strategyControlId)"
                  >{{ $t("commen.remove") }}</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalThreshold')"
            label-for="proposalThresholdInput"
          >
            <b-form-input
              id="proposalThreshold"
              :placeholder="$t('community.proposalThresholdInput')"
              v-model="form.threshold"
              type="number"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.proposalValidation')"
            label-for="proposalValidationInput"
            v-show="false"
          >
            <b-form-input
              id="proposalValidation"
              required
              :placeholder="$t('community.proposalValidationInput')"
              v-model="form.validation"
            ></b-form-input>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="5" v-show="false">
            <b-form-checkbox switch size="sm">{{
              $t("community.proposalOnlyMembers")
            }}</b-form-checkbox>
          </b-form-group>

          <b-button type="submit" variant="primary" @click="submitForm">{{
            $t("community.commit")
          }}</b-button>
        </div>
      </div>
    </div>
    <b-modal
      id="modal-network"
      scrollable
      :title="$t('community.proposalNetwork')"
      v-model="modalNetworksOpen"
      hide-footer
      ><Networks :chooseNetWork="chooseNetWork"></Networks>
    </b-modal>

    <b-modal
      id="modal-strategy"
      scrollable
      :title="$t('community.proposalStrategies')"
      v-model="modalStrategyOpen"
      hide-footer
      ><Strategies
        :chooseStrategy="chooseStrategy"
        :strategies="strategies"
        :currentStrategyControlId="currentStrategyControlId"
      ></Strategies>
    </b-modal>

    <b-modal
      id="modal-editStrategy"
      v-model="modelEditStrategyOpen"
      modal-class="custom-modal"
      size="lg"
      :title="$t('community.editStrategy')"
      centered
      hide-footer
    >
      <div class="tip-modal">
        <b-card :title="currentStrategyKey" class="mb-3">
          <div>
            <b-form-textarea
              id="textarea"
              v-model="currentStrategyParams"
              rows="10"
              max-rows="20"
            ></b-form-textarea>
          </div>
        </b-card>
        <button class="primary-btn" @click="saveStrategy" :disabled="!isValid">
          {{ $t("commen.update") }}
        </button>
      </div>
    </b-modal>

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
import Networks from "../../components/Community/Proposal/Networks.vue";
import Strategies from "../../components/Community/Proposal/Strategies.vue";
import { handleApiErrCode, sleep } from "@/utils/helper";
import {
  completeCommunityProposalConfigInfo,
  getStrategies,
  getMyCommunityProposalConfigInfo,
} from "@/utils/web3/communityProposalConfig";
import BSCAccount from "@/components/Accounts/BSCAccount";
import PolkadotAccount from "@/components/Accounts/PolkadotAccount";
import SteemAccount from "@/components/Accounts/SteemAccount";
import HiveAccount from "@/components/Accounts/HiveAccount";
import { getMyCommunityInfo } from "@/utils/web3/community";

import { nanoid } from "nanoid";

export default {
  name: "ProposalCreate",
  components: {
    BSCAccount,
    PolkadotAccount,
    SteemAccount,
    HiveAccount,
    Networks,
    Strategies,
  },
  data() {
    return {
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
        validation: "basic",
        onlyMembers: 0,
        userId: "",
      },
    };
  },
  computed: {
    wallet() {
      switch (this.activeTab) {
        case 0:
          return "BSCAccount";
        case 1:
          return "SteemAccount";
        case 2:
          return "HiveAccount";
        case 3:
          return "PolkadotAccount";
        case 4:
          return "PolkadotAccount";
        default:
          break;
      }
    },
    isValid() {
      return this.validStrategy(this.currentStrategyParams);
    },
  },
  methods: {
    validStrategy(strategyParams) {
      try {
        const params = JSON.parse(strategyParams);
        return !!params.symbol;
      } catch (e) {
        return false;
      }
    },
    selectNetWork() {
      this.modalNetworksOpen = true;
    },
    selectStrategy(item) {
      this.currentStrategyControlId = item.strategyControlId;
      this.modalStrategyOpen = true;
    },
    chooseNetWork(item) {
      this.form.network = item.chainId;
      this.form.networkName = item.name;
      this.$bvModal.hide("modal-network");
    },
    chooseStrategy(item, currentStrategyControlId) {
      for (let index in this.strategyControlItems) {
        if (
          this.strategyControlItems[index].strategyControlId ==
          currentStrategyControlId
        ) {
          this.strategyControlItems[index].strategyKey = item.key;
          this.strategyControlItems[index].strategyParams = JSON.stringify(
            item.examples[0].strategy.params,
            null,
            4
          );
          this.strategyControlItems[index].strategies = {
            name: item.key,
            params: item.examples[0].strategy.params,
          };

          break;
        }
      }
      this.$bvModal.hide("modal-strategy");
    },
    editStrategy(item) {
      this.currentStrategyControlId = item.strategyControlId;
      this.currentStrategyKey = item.strategyKey;
      this.currentStrategyParams = item.strategyParams;
      this.modelEditStrategyOpen = true;
    },
    addStrategy() {
      const currentItem = {
        strategyControlId: nanoid(),
        strategyKey: "",
        strategyPara: "",
        strategies: null,
      };

      this.strategyControlItems.push(currentItem);
    },
    removeStrategy(strategyControlId) {
      this.strategyControlItems = this.strategyControlItems.filter(
        (strategyControlItems) => {
          return strategyControlItems.strategyControlId != strategyControlId;
        }
      );
    },
    saveStrategy() {
      for (let index in this.strategyControlItems) {
        if (
          this.strategyControlItems[index].strategyControlId ==
          this.currentStrategyControlId
        ) {
          this.strategyControlItems[index].strategyParams =
            this.currentStrategyParams;

          this.strategyControlItems[index].strategies = {
            name: this.currentStrategyKey,
            params: JSON.parse(this.currentStrategyParams),
          };

          break;
        }
      }
      this.$bvModal.hide("modal-editStrategy");
    },
    async submitForm() {
      try {
        this.uploading = true;

        for (let index in this.strategyControlItems) {
          if (
            !this.validStrategy(this.strategyControlItems[index].strategyParams)
          ) {
            // go to community dashboard
            this.$bvToast.toast(this.$t("tip.strategyError"), {
              title: this.$t("tip.tips"),
              variant: "danger",
            });
            return;
          }
        }

        this.form.strategies = JSON.stringify(
          this.strategyControlItems,
          null,
          4
        );
        debugger;
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
    this.form.id = this.$router.currentRoute.params.key;
    this.form.communityId = this.$router.currentRoute.params.key;

    this.strategies = await getStrategies();

    const currentItem = {
      strategyControlId: nanoid(),
      strategyKey: "",
    };

    this.strategyControlItems.push(currentItem);

    try {
      const communityInfo = await getMyCommunityInfo();

      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }
      if (communityInfo.id != this.$router.currentRoute.params.key) {
        this.notYourCommunity = true;
        return;
      }

      const communityProposalConfigInfo =
        await getMyCommunityProposalConfigInfo(communityInfo.id);

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