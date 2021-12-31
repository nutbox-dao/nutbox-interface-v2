<template>
  <div class="scroll-content">
    <div class="container mb-5">
        <div class="row text-left">
          <div class="col-md-7 mb-4 mb-md-0">
            <div class="custom-form form-card">
              <div class="font32 font-bold my-2">{{ proposal.title }}</div>
              <div class="flag"
                   :class="
                proposal.status == 0
                  ? 'proposal-pending'
                  : proposal.status == 1
                  ? 'proposal-rolling'
                  : proposal.proposalResult === 1
                  ? 'proposal-pass'
                  : 'proposal-unpass'">
                {{
                  proposal.status == 0
                    ? $t("nps.propsalVoteStatusWaitStart")
                    : proposal.status == 1
                      ? $t("nps.propsalVoteStatusDoing")
                      : proposal.proposalResult === 1
                        ? $t("nps.pass")
                        : $t("nps.unpass")
                }}
              </div>
              <Markdown :body="proposal.body" />
              <div class="row mt-4" v-show="!isVoted && proposal.status == 1">
                <div class="col-6 text-right">
                  <button class="primary-btn w-50"
                          @click="onVote('agree')"
                          :disabled="isVoted">{{ $t("nps.proposalAgreeBtn") }}</button>
                </div>
                <div class="col-6">
                  <button class="primary-btn w-50"
                          @click="onVote('disagree')"
                          :disabled="isVoted">{{ $t("nps.proposalDisagreeBtn") }}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-5 font14">
            <div class="c-card mb-4">
              <div class="c-card-header font20">{{ $t("nps.proposalInfo") }}</div>
              <div class="c-card-content">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-grey-7 font12">{{ $t("nps.proposalFirst_Block") }}</span>
                  <span>{{ proposal.first_block }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-grey-7 font12">{{ $t("nps.proposalEnd_Block") }}</span>
                  <span>{{ proposal.end_block }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-grey-7 font12">{{ $t("nps.proposalStart") }}</span>
                  <span>{{ formatDate(proposal.start) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-grey-7 font12">{{ $t("nps.proposalEnd") }}</span>
                  <span>{{ formatDate(proposal.end) }}</span>
                </div>
              </div>
            </div>
            <div class="c-card">
              <div class="c-card-header d-flex justify-content-between font20">{{ $t("nps.proposalVoteResult") }}
                <div class="flag"
                v-show="proposal.proposalResult !== 0"
                   :class="
                proposal.status == 0
                  ? 'proposal-pending'
                  : proposal.status == 1
                  ? 'proposal-rolling'
                  : proposal.proposalResult === 1
                  ? 'proposal-pass'
                  : 'proposal-unpass'">
                {{
                  proposal.status == 0
                    ? $t("nps.propsalVoteStatusWaitStart")
                    : proposal.status == 1
                      ? $t("nps.propsalVoteStatusDoing")
                      : proposal.proposalResult === 1
                        ? $t("nps.pass")
                        : $t("nps.unpass")
                }}
              </div>
              </div>
              <div class="c-card-content">
                <div class="progress-box">
                  <div class="flex-between-center">
                    <span>{{ $t("nps.proposalAgreeBtn") }}</span>
                    <span>{{ voteAgreeTotalScore | amountForm }} ({{ voteAgreeTotalScoreRate.toFixed(2) }}%)</span>
                  </div>
                  <b-progress :value="voteAgreeTotalScoreRate"
                              height=".5rem"
                              variant="success"
                              class="w-100 my-1"></b-progress>
                </div>
                <div class="progress-box">
                  <div class="flex-between-center">
                    <span>{{ $t("nps.proposalDisagreeBtn") }}</span>
                    <span>{{ voteDisagreeTotalScore | amountForm }} ({{ voteDisagreeTotalScoreRate.toFixed(2) }}%)</span>
                  </div>
                  <b-progress :value="voteDisagreeTotalScoreRate"
                              height=".5rem"
                              variant="danger"
                              class="w-100 my-1"></b-progress>
                </div>
                <!-- <div class="progress-box">
                  <div class="flex-between-center">
                    <span>{{ $t("nps.proposalVoteResult") }}</span>
                    <span>{{ voteAgreeTotalScore - voteDisagreeTotalScore | amountForm }}</span>
                  </div>
                  <b-progress :value="voteAgreeTotalScoreRate - voteDisagreeTotalScoreRate"
                              height=".5rem"
                              variant="info"
                              class="w-100 my-1"></b-progress>
                </div> -->
                <button @click="download" :disabled="loading" class="primary-btn rounded-pill w-75">{{ $t('nps.downloadReport') }}</button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <b-modal
      id="modal-vote"
      v-model="modelVoteOpen"
      modal-class="custom-modal text-center"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <div class="custom-form position-relative">
        <i class="modal-close-icon-right" @click="modelVoteOpen=false"></i>
        <div class="modal-title">{{$t('nps.propsalSureVote')}}</div>
        <div class="mt-2 font20 line-height28">
          {{
            $t("nps.propsalVoteRemind", [
              type == "agree"
                ? $t("nps.proposalAgreeBtn")
                : $t("nps.proposalDisagreeBtn"),
            ])
          }}
        </div>
        <div class="font20 line-height28">
          {{ $t("nps.propsalVoteRight") }}:
          <span class="font28 mx-2">{{ balacne | amountForm}}</span>
          {{ symbol }}
        </div>
        <button
          class="primary-btn mt-4"
          @click="ConfirmVote"
          :disabled="isVoted || voteing || loading || balacne === 0"
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
import { handleApiErrCode } from "@/utils/helper";
import CsvExportor from "csv-exportor";
import { getProposal } from "@/utils/web3/proposal";
import { completeVote, getAllVote } from "@/utils/web3/vote";
import { formatDate as fd } from "@/utils/commen/util";
import Markdown from "@/components/common/Markdown";
import { mapState, mapGetters } from "vuex";
import { getERC20Balance } from '@/utils/web3/asset'
import {
  getScores,
} from "@/utils/web3/communityProposalConfig";

export default {
  name: "Proposal",
  components: {
    Markdown,
  },
  data() {
    return {
      id: null,
      modelVoteOpen: false,
      totalScore: 0,
      type: "",
      balacne: 0,
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
      loading: false,
      voteItems: [],
      currentUserId: "",
      voteTotalScore: 0,
      voteAgreeTotalScore: 0,
      voteDisagreeTotalScore: 0,
    };
  },
  computed: {
    ...mapState('web3', ['account']),
    ...mapState('currentCommunity', ['communityId', 'cToken']),
    ...mapGetters('community', ['getCommunityInfoById']),
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
    symbol() {
      if(!this.cToken) return ''
      return this.cToken.symbol;
    }
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
      getERC20Balance(this.cToken.address).then(res => {
        this.balacne = res.toString() / 1e18
      })
    },
    async ConfirmVote() {
      try {
        this.voteing = true;
        const b = await getERC20Balance(this.cToken.address)
        const score = b.toString() / 1e18;
        this.vote.communityId = this.communityId;
        this.vote.proposalId = this.proposal.id;
        this.vote.voteType = this.type == "agree" ? 1 : 0;
        this.vote.voteScore = score;
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

        if (list.length > 0) {
          this.isVoted = true;
        } else {
          this.isVoted = false;
        }
      } else {
        this.isVoted = false;
      }
    },
    download() {
      console.log(this.voteItems);
      const header = ['communityId', 'id', 'created', 'userId', 'voteScore', 'voteType']
      try{
        CsvExportor.downloadCsv(
          this.voteItems.map(item => ({
            communityId: item.communityId,
            id: item.id,
            created: item.created,
            userId: item.userId,
            voteScore: item.voteScore,
            voteType: item.voteType
          })),
          {header},
          'Proposal-result-of-' + this.proposal.title + '.csv'
        )
        this.$bvToast.toast(this.$t('nps.exportOk'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e) {
        console.log(2345,e);
      }
    }
  },
  async mounted() {
    this.id = this.$route.params.id

    try {
      this.loading = true;
      this.currentUserId = this.account

      var proposalList = await getProposal(this.id);

      this.proposal = proposalList[0];

      await this.loadAllVote();
      this.loading = false;
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
.form-card {
  @include card();
}
.c-card {
  @include card(0, var(--card-primary-bg), none, fit-conent);
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.02);
  .c-card-header {
    padding: 1.2rem 1.2rem 2.8rem;
    background-image: linear-gradient(to bottom, #141414, #1D1E1F);
    border-radius: 1.4rem 1.4rem 0 0;
  }
  .c-card-content {
    padding: 1.2rem;
    border-radius: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: .8rem;
    background: var(--card-bg-primary);
    margin-top: -1.8rem;
  }
}
.flag {
  font-size: .7rem;
  padding: .2rem .3rem;
  line-height: .7rem;
  width: fit-content;
  margin-bottom: .5rem;
}
.progress {
  background-color: var(--block-bg);
}
</style>
