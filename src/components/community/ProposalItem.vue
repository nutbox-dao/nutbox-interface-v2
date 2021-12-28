<template>
  <div class="c-card">
    <div class="row">
      <div class="col-md-6">
        <div class="p-content  d-flex align-items-center hover">
          <span class="number-circle">{{index + 1}}</span>
          <div class="content-info mx-3" @click="$router.push(`/sub-community/governance/detail/${proposalItem.id}`)">
            {{ getName }}
          </div>
          <div class="content-info mx-3" style="overflow: hidden" @click="$router.push(`/sub-community/governance/detail/${proposalItem.id}`)">
            {{ proposalItem.title }}
          </div>
        </div>
      </div>
      <div class="col-md-6 mt-3 mt-md-0">
        <div class=" d-flex justify-content-between other-info">
          <div class="font18 d-flex justify-content-between info-start">
            <div style="color: #50BF00; white-space: nowrap">Agree: {{proposalItem.voteAgreeTotalScore || 0}}</div>
            <div style="color: #FF5B4D; white-space: nowrap">Disagree: {{proposalItem.voteDisagreeTotalScore || 0}}</div>
          </div>
          <div class="d-flex align-items-end info-end">
            <div class="t-flag px-1"
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
            <div class="w-auto mt-1 text-grey-7 font16" style="white-space: nowrap">
              {{ $t("nps.proposalEnd") + ":" + endTime }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { formatDate } from '@/utils/commen/util'
import { ethers } from 'ethers'
import { mapState } from 'vuex'

export default {
  name: 'ProposalItem',
  data () {
    return { voteTotalScore: 0 }
  },
  props: ['proposalItem', 'index'],
  computed: {
    ...mapState('user', ['users']),
    endTime () {
      var newDate = formatDate(this.proposalItem.end)
      return newDate
    },

    voteAgreeTotalScoreRate () {
      return this.voteTotalScore == 0
        ? 0
        : (this.proposalItem.voteAgreeTotalScore * 100) / this.voteTotalScore
    },
    voteDisagreeTotalScoreRate () {
      return this.voteTotalScore == 0
        ? 0
        : (this.proposalItem.voteDisagreeTotalScore * 100) /
            this.voteTotalScore
    },
    getName() {
      let address = this.proposalItem.userId;
      if (!address) return '--'
      address = ethers.utils.getAddress(address)
      const u = this.users[address]
      if (u && u.name) {
        return u.name;
      }
      return address.substring(0,6) + '...'
    },
  },
  mounted () {
    console.log(444, this.proposalItem);
    this.voteTotalScore =
      this.proposalItem.voteAgreeTotalScore +
      this.proposalItem.voteDisagreeTotalScore
  }
}
</script>

<style  lang="scss" scoped>
.c-card {
  position: relative;
  @include card(1.2rem, var(--card-bg-primary), hidden, fit-conent);
  margin-bottom: 1rem;
  .number-circle {
    border: 2px solid var(--primary-custom);
    width: 40px;
    height: 40px;
    border-radius: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .info-start, .info-end {
    flex-direction: column;
  }
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
@media (max-width: 560px) {
  .c-card {
    padding-top: 2.2rem;
    .other-info {
      flex-direction: column;
    }
    .info-start, .info-end {
      flex-direction: row;
    }
    .info-start {
      justify-content: space-between;
    }
    .info-end {
      margin-top: .5rem;
      justify-content: flex-end;
    }
    .t-flag {
      position: absolute;
      top: -5.2rem;
    }
  }
}
</style>
