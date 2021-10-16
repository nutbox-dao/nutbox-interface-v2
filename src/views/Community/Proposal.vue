<template>
  <div class="container scroll-content">
    <div class="view-top-header">
      <div class="page-back-text-icon font20" style="line-height: 1rem" @click="$router.back()">
        {{ $t("nps.voteProposal") }}
      </div>
    </div>
    <div class="row text-left">
      <div class="custom-form col-md-8 mb-5">
        <div class="font32 font-bold my-2">{{ proposal.title }}</div>
        <div class="flag"
             :class="
             proposal.status == 0
              ? 'propsalVoteStatusWaitStart'
              : proposal.status == 1
              ? 'propsalVoteStatusDoing'
              : 'propsalVoteStatusEnd'">
          {{
            proposal.status == 0
              ? $t("nps.propsalVoteStatusWaitStart")
              : proposal.status == 1
              ? $t("nps.propsalVoteStatusDoing")
              : $t("nps.propsalVoteStatusEnd")
          }}
        </div>
        <Markdown :body="proposal.body" />
        <div class="row mt-4" v-show="!isVoted && proposal.status == 1">
          <div class="col-6 text-right">
            <button class="primary-btn w-50"
                    @click="onVote('agree')"
                    :disabled="!isValid || isVoted">{{ $t("nps.proposalAgreeBtn") }}</button>
          </div>
          <div class="col-6">
            <button class="primary-btn w-50"
                    @click="onVote('disagree')"
                    :disabled="!isValid || isVoted">{{ $t("nps.proposalDisagreeBtn") }}</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="c-card">
          <div class="c-card-header font20">{{ $t("nps.proposalInfo") }}</div>
          <div class="c-card-content">
            <div class="flex-between-center">
              <span class="text-grey-light">{{ $t("nps.proposalFirst_Block") }}</span>
              <span>{{ proposal.first_block }}</span>
            </div>
            <div class="flex-between-center">
              <span class="text-grey-light">{{ $t("nps.proposalEnd_Block") }}</span>
              <span>{{ proposal.end_block }}</span>
            </div>
            <div class="flex-between-center">
              <span class="text-grey-light">{{ $t("nps.proposalStart") }}</span>
              <span>{{ formatDate(proposal.start) }}</span>
            </div>
            <div class="flex-between-center">
              <span class="text-grey-light">{{ $t("nps.proposalEnd") }}</span>
              <span>{{ formatDate(proposal.end) }}</span>
            </div>
          </div>
        </div>
        <div class="c-card">
          <div class="c-card-header font20">{{ $t("nps.proposalVoteResult") }}</div>
          <div class="c-card-content">
            <div class="progress-box">
              <div class="flex-between-center">
                <span>{{ $t("nps.proposalAgreeBtn") }}</span>
                <span>{{ voteAgreeTotalScore | amountForm }} (0%)</span>
              </div>
              <b-progress :value="voteAgreeTotalScoreRate"
                          height=".5rem"
                          variant="success"
                          class="w-100 my-1"></b-progress>
            </div>
            <div class="progress-box">
              <div class="flex-between-center">
                <span>{{ $t("nps.proposalDisagreeBtn") }}</span>
                <span>{{ voteDisagreeTotalScore | amountForm }} (0%)</span>
              </div>
              <b-progress :value="voteDisagreeTotalScoreRate"
                          height=".5rem"
                          variant="danger"
                          class="w-100 my-1"></b-progress>
            </div>
            <button class="primary-btn rounded-pill w-75">Download Report</button>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="modal-vote"
      v-model="modelVoteOpen"
      modal-class="custom-modal"
      size="lg"
      :title="$t('nps.propsalSureVote')"
      centered
      hide-footer
    >
      <div class="tip-modal">
        <b-card class="mb-3">
          <div>
            {{
              $t("nps.propsalVoteRemind", [
                type == "agree"
                  ? $t("nps.proposalAgreeBtn")
                  : $t("nps.proposalDisagreeBtn"),
              ])
            }}
          </div>
          <div>
            {{ $t("nps.propsalVoteRight") }}:{{ totalScore | amountForm
            }}{{ form.symbol }}
          </div>
        </b-card>
        <button
          class="primary-btn"
          @click="ConfirmVote"
          :disabled="!isValid || isVoted || voteing"
        >
          <b-spinner small type="grow" v-show="voteing" />
          {{  type == "agree"
                  ? $t("nps.proposalAgreeBtn")
                  : $t("nps.proposalDisagreeBtn"), }}
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
        passthreshold: 0,
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
      voteing: false,
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
        this.voteing = true;
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
        this.voteing = false;
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

        let strategies = [];
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
    this.id = this.$router.currentRoute.params.key
      ? this.$router.currentRoute.params.key
      : this.$route.query.proposalId;

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
.c-card {
  @include card(0, white, none, fit-conent);
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.02);
  margin-bottom: .6rem;
  .c-card-header {
    padding: 1.6rem 1.2rem .8rem;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(246, 247, 249, 1));
    border-radius: 1.4rem 1.4rem 0 0;
  }
  .c-card-content {
    padding: 1.2rem;
    border-radius: 0 0 1.4rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: .8rem;
  }
}
.flag {
  font-size: .7rem;
  padding: .2rem .3rem;
  line-height: .7rem;
  width: fit-content;
  margin-bottom: .5rem;
}
.propsalVoteStatusWaitStart {
  background: rgba(255, 219, 38, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 219, 38, 0.3);
  color: var(--warning);
}
.propsalVoteStatusEnd {
  background: rgba(255, 91, 77, 0.051);
  border-radius: 8px;
  border: 1px solid rgba(255, 91, 77, 0.3);
  color: var(--error);
}

.propsalVoteStatusDoing {
  background: #408fff0d;
  border-radius: 8px;
  border: 1px solid #408fff4d;
  color: var(--link);
}
</style>
