<template>
  <div class="nps">
    <div class="nps-card">
      <div class="proposal">
        <div class="p-content d-flex w-100">
          <p
            style="
            width: 32px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid var(--primary-custom);
            font-size: 14px;
            line-height: 32px;
          "
          >
            {{ index + 1 }}
          </p>

          <span
            @click="
            $router.push(`${url}/nps/proposal?proposalId=${proposalItem.id}`)
          "
            style="
            flex: 1;
            text-align: left;
            font-weight: 500;
            border-radius: 8px;
          "
          >
          {{ proposalItem.title }}
        </span>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100">
          <div class="w-20">
            {{ $t("nps.proposalEnd") + ":" + endTime }}
          </div>
          <div class="flag"
             :class="
             proposalItem.status == 0
              ? 'proposal-pending'
              : proposalItem.status == 1
              ? 'proposal-rolling'
              : proposalItem.proposalResult === 1
              ? 'proposal-pass'
              : 'proposal-unpass'">
          {{
            proposalItem.status == 0
              ? $t("nps.propsalVoteStatusWaitStart")
              : proposalItem.status == 1
              ? $t("nps.propsalVoteStatusDoing")
              : proposalItem.proposalResult === 1
              ? $t("nps.pass")
              : $t("nps.unpass")
          }}
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/commen/util";
export default {
  name: "ProposalItem",
  data() {
    return { url: "", voteTotalScore: 0 };
  },
  props: ["proposalItem", "index"],
  computed: {
    endTime() {
      var newDate = formatDate(this.proposalItem.end);
      return newDate;
    },

    voteAgreeTotalScoreRate() {
      return this.voteTotalScore == 0
        ? 0
        : (this.proposalItem.voteAgreeTotalScore * 100) / this.voteTotalScore;
    },
    voteDisagreeTotalScoreRate() {
      return this.voteTotalScore == 0
        ? 0
        : (this.proposalItem.voteDisagreeTotalScore * 100) /
            this.voteTotalScore;
    },
  },
  mounted() {
    this.url =
      this.$router.currentRoute.params.key || this.$route.query.id
        ? "/specify"
        : "";
    this.voteTotalScore =
      this.proposalItem.voteAgreeTotalScore +
      this.proposalItem.voteDisagreeTotalScore;
  },
};
</script>

<style  lang="scss" scoped>
/* .proposal-item {
  padding: 20px;
  background-color: white;
  border-radius: 30px;
  font: bold;
  font-size: 18px;
}

div button {
  float: right;
}
span {
  margin-right: 10px;
}
 */
.nps {
  .nps-card {
    @include card();
    margin-bottom: 1rem;
    position: relative;
  }
  .proposal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
    .p-content {
      align-items:center;
    }
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
    .flag {
      padding: .4rem .6rem;
      font-size: .7rem;
      line-height: .8rem;
      margin-left: 1rem;
    }
  }
}
.w-25 {
  width: 20% !important;
}
@media (max-width: 960px) {
  .nps {
    .nps-card {
      padding-top: 3rem;
    }
    .proposal {
      flex-direction: column;
      .flag {
        position: absolute;
        top: .8rem;
        right: .8rem;
        margin: 0;
        font-size: .6rem;
        line-height: .8rem;
      }
    }
  }
}
@media (max-width: 760px) {
  .nps .proposal .p-content {
    align-items: flex-start;
    margin-bottom: 1rem;
  }
}
</style>
