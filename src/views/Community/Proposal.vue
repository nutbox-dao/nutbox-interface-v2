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

    <div class="mt-3">
      <div class="community-info-card row text-left">
        <div class="custom-form col-8">
          <div>
            <h3>{{ proposal.title }}</h3>
          </div>

          <div><Markdown :body="proposal.body" /></div>
          <div
            style="margin-top: 10px"
            class="row"
            v-show="!isVoted && proposal.status == 1"
          >
            <div class="col-6">
              <b-button
                type="submit"
                variant="primary"
                @click="onVote('agree')"
                :disabled="!isValid || isVoted"
                >{{ $t("community.proposalAgreeBtn") }}</b-button
              >
            </div>
            <div class="col-6">
              <b-button
                type="submit"
                variant="primary"
                @click="onVote('disagree')"
                :disabled="!isValid || isVoted"
                >{{ $t("community.proposalDisagreeBtn") }}</b-button
              >
            </div>
          </div>
        </div>
        <div class="col-4">
          <div style="margin-top: 10px">
            <b-card no-body>
              <template v-slot:header>
                <h4 class="mb-0">{{ $t("community.proposalInfo") }}</h4>
              </template>

              <b-list-group flush>
                <b-list-group-item
                  ><div class="row">
                    <div class="col-6">
                      {{ $t("community.proposalFirst_Block") }}
                    </div>
                    <div class="col-6">
                      {{ proposal.first_block }}
                    </div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  ><div class="row">
                    <div class="col-6">
                      {{ $t("community.proposalEnd_Block") }}
                    </div>
                    <div class="col-6">
                      {{ proposal.end_block }}
                    </div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  ><div class="row">
                    <div class="col-6">
                      {{ $t("community.proposalStart") }}
                    </div>
                    <div class="col-6">{{ formatDate(proposal.start) }}</div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  ><div class="row">
                    <div class="col-6">
                      {{ $t("community.proposalEnd") }}
                    </div>
                    <div class="col-6">{{ formatDate(proposal.end) }}</div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  ><div class="row">
                    <div class="col-6">
                      {{ $t("community.proposalStatus") }}
                    </div>
                    <div class="col-6">
                      {{
                        proposal.status == 0
                          ? $t("community.propsalVoteStatusWaitStart")
                          : proposal.status == 1
                          ? $t("community.propsalVoteStatusDoing")
                          : $t("community.propsalVoteStatusEnd")
                      }}
                    </div>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </div>

          <div style="margin-top: 10px">
            <b-card no-body>
              <template v-slot:header>
                <h4 class="mb-0">{{ $t("community.proposalVoteResult") }}</h4>
              </template>

              <b-list-group flush>
                <b-list-group-item>
                  <div class="row">
                    <div class="col-4">
                      {{ $t("community.proposalAgreeBtn") }}
                    </div>
                    <div class="col-8">
                      <b-progress
                        :value="voteAgreeTotalScoreRate"
                        variant="success"
                        :striped="true"
                        class="w-100"
                      ></b-progress>
                    </div>
                  </div>
                </b-list-group-item>

                <b-list-group-item>
                  <div class="row">
                    <div class="col-4">
                      {{ $t("community.proposalDisagreeBtn") }}
                    </div>
                    <div class="col-8">
                      <b-progress
                        :value="voteDisagreeTotalScoreRate"
                        variant="danger"
                        :striped="true"
                        class="w-100"
                      ></b-progress>
                    </div></div
                ></b-list-group-item>
                <b-list-group-item v-show="proposal.status == 2">
                  <div class="row">
                    <div class="col-4">
                      {{ $t("community.proposalVoteResult") }}
                    </div>
                    <div class="col-8">
                      {{ $t("nps.pass") }}
                    </div>
                  </div></b-list-group-item
                >
              </b-list-group>
            </b-card>
          </div>

          <div style="margin-top: 10px">
            <b-card no-body>
              <template v-slot:header>
                <h4 class="mb-0">{{ $t("community.proposalVoteNum") }}</h4>
              </template>

              <b-list-group flush>
                <b-list-group-item v-for="item in voteItems" :key="item.id"
                  ><div class="row">
                    <div class="col-5">{{ cutString(item.userId, 10) }}</div>
                    <div class="col-5">
                      {{ item.voteScore }}
                    </div>
                    <div class="col-2">
                      {{
                        item.voteType == 1
                          ? $t("community.proposalAgreeBtn")
                          : $t("community.proposalDisagreeBtn")
                      }}
                    </div>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="modal-vote"
      v-model="modelVoteOpen"
      modal-class="custom-modal"
      size="lg"
      :title="$t('community.propsalSureVote')"
      centered
      hide-footer
    >
      <div class="tip-modal">
        <b-card class="mb-3">
          <div>
            {{
              $t("community.propsalVoteRemind", [
                type == "agree"
                  ? $t("community.proposalAgreeBtn")
                  : $t("community.proposalDisagreeBtn"),
              ])
            }}
          </div>
          <div>
            {{ $t("community.propsalVoteRight") }}:{{ totalScore
            }}{{ form.symbol }}
          </div>
        </b-card>
        <button
          class="primary-btn"
          @click="ConfirmVote"
          :disabled="!isValid || isVoted"
        >
          {{  type == "agree"
                  ? $t("community.proposalAgreeBtn")
                  : $t("community.proposalDisagreeBtn"), }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { handleApiErrCode, sleep } from "@/utils/helper";
import BSCAccount from "@/components/Accounts/BSCAccount";
import PolkadotAccount from "@/components/Accounts/PolkadotAccount";
import SteemAccount from "@/components/Accounts/SteemAccount";
import HiveAccount from "@/components/Accounts/HiveAccount";
import { getProposal } from "@/utils/web3/proposal";
import { completeVote, getAllVote } from "@/utils/web3/vote";
import { formatDate as fd } from "@/utils/commen/util";
import Markdown from "@/components/Commen/Markdown";
import { getAccounts } from "@/utils/web3/account";

import {
  getScores,
  getScore,
  getMyCommunityProposalConfigInfo,
} from "@/utils/web3/communityProposalConfig";
export default {
  name: "Proposal",
  components: {
    BSCAccount,
    PolkadotAccount,
    SteemAccount,
    HiveAccount,
    Markdown,
  },
  data() {
    return {
      id: null,
      modelVoteOpen: false,
      totalScore: 0,
      type: "",
      proposal: {
        id: "",
        ipfs: "",
        userId: "",
        created: "",
        communityId: "",
        network: "",
        type: "",
        strategies: "",
        title: "",
        body: "",
        start: "",
        end: "",
        first_block: 0,
        end_block: 0,
        passThreshold: 0,
      },
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
      vote: {
        id: "",
        ipfs: "",
        userId: "",
        created: "",
        communityId: "",
        proposalId: "",
        voteType: "",
        voteScore: 0,
      },
      isVoted: true,
      voteItems: [],
      currentUserId: "",
      voteTotalScore: 0,
      voteAgreeTotalScore: 0,
      voteDisagreeTotalScore: 0,
    };
  },
  computed: {
    voteAgreeTotalScoreRate() {
      return this.voteTotalScore == 0
        ? 0
        : (this.voteAgreeTotalScore * 100) / this.voteTotalScore;
    },
    voteDisagreeTotalScoreRate() {
      return this.voteTotalScore == 0
        ? 0
        : (this.voteDisagreeTotalScore * 100) / this.voteTotalScore;
    },
  },
  watch: {
    "proposal.network": {
      handler(newValue, oldValue) {
        const strategies = [];
        if (this.proposal.strategies) {
          const formStrategies = JSON.parse(this.proposal.strategies).forEach(
            (element) => {
              strategies.push(element.strategies);
            }
          );
        }
        var params = {
          space: "",
          strategies,
          network: this.proposal.network,
          isSingle: 1,
        };

        getScore(params).then((res) => {
          this.totalScore = res;
          this.isValid = this.totalScore >= this.proposal.threshold;
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    cutString(srcValue, length) {
      return (
        (srcValue.length > length ? srcValue.substring(0, length) : srcValue) +
        "..."
      );
    },
    formatDate(date) {
      return fd(date);
    },
    onVote(type) {
      this.type = type;
      this.modelVoteOpen = true;
    },
    async ConfirmVote() {
      try {
        this.vote.communityId = this.form.communityId;
        this.vote.proposalId = this.proposal.id;
        this.vote.voteType = this.type == "agree" ? 1 : 0;
        this.vote.voteScore = this.totalScore;
        const result = await completeVote(this.vote);
        this.isVoted = true;
        if (result.code == 0) {
          this.$bvToast.toast(this.$t("tip.completeVoteSuccess"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          await this.loadAllVote();
          this.modelVoteOpen = false;
        }
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.deploying = false;
      }
    },
    async loadAllVote() {
      this.voteItems = await getAllVote(this.proposal.id);

      if (this.voteItems) {
        var list = this.voteItems.filter((t) => t.userId == this.currentUserId);

        var addresses = [];
        this.voteItems.forEach((value, index) => {
          /*  if (value.voteType == 1) {
            this.voteAgreeTotalScore += value.voteScore;
          } else {
            this.voteDisagreeTotalScore += value.voteScore;
          }
          this.voteTotalScore += value.voteScore; */
          addresses.push(value.userId);
        });

        const strategies = [];
        if (this.proposal.strategies) {
          const formStrategies = JSON.parse(this.proposal.strategies).forEach(
            (element) => {
              strategies.push(element.strategies);
            }
          );
        }

        let params = {
          space: "",
          strategies,
          network: this.proposal.network,
          addresses,
          snapshot: this.proposal.end_block,
          proposalId: this.proposal.id,
        };

        let scores = await getScores(params);
        this.voteItems = this.voteItems
          .map((vote) => {
            vote.voteScore = strategies.map(
              (strategy, i) => scores[i][vote.userId] || 0
            );
            vote.voteScore = vote.voteScore.reduce((a, b) => a + b, 0);
            return vote;
          })
          .sort((a, b) => b.voteScore - a.voteScore)
          .filter((vote) => vote.voteScore > 0);
        this.voteAgreeTotalScore = 0;
        this.voteDisagreeTotalScore = 0;
        this.voteTotalScore = 0;
        this.voteItems.forEach((vote, voteIndex) => {
          if (vote.voteType == 1) {
            this.voteAgreeTotalScore += vote.voteScore;
          } else {
            this.voteDisagreeTotalScore += vote.voteScore;
          }
          this.voteTotalScore += vote.voteScore;
        });

        /*  getScores(params).then((res) => {
          const totalScores = res;

          totalScores.forEach((value, index) => {
            let tempVoteType = 0;
            let tempVoteScore = 0;
            this.voteItems.forEach((vote, voteIndex) => {
              if (value[vote.userId]) {
                vote.voteScore = value[vote.userId];

                tempVoteScore = vote.voteScore;
                tempVoteType = vote.voteType;
              }
            });

            if (tempVoteType == 1) {
              this.voteAgreeTotalScore += tempVoteScore;
            } else {
              this.voteDisagreeTotalScore += tempVoteScore;
            }
            this.voteTotalScore += tempVoteScore;
          });
        });
 */

        if (list.length > 0) {
          this.isVoted = true;
        } else {
          this.isVoted = false;
        }
      } else {
        this.isVoted = false;
      }
    },
  },
  async mounted() {
    this.id = this.$router.currentRoute.params.key;

    try {
      this.currentUserId = await getAccounts();

      var proposalList = await getProposal(this.id);

      this.proposal = proposalList[0];

      const communityProposalConfigInfo =
        await getMyCommunityProposalConfigInfo(this.proposal.communityId);

      await this.loadAllVote();
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