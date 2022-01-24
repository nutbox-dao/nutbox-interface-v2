<template>
  <div class="c-card">
    <div class="box-content">
      <div class="p-content d-flex align-items-center hover">
        <span class="number-circle">{{index + 1}}</span>
        <div class="d-flex flex-column justify-content-between h-100 overflow-hidden mx-3">
          <div class="content-info name font14 line-height18" @click="$router.push(`/sub-community/governance/detail/${proposalItem.id}`)">
            {{ getName }}
          </div>
          <div class="content-info font16 line-height20 font-bold" style="overflow: hidden" @click="$router.push(`/sub-community/governance/detail/${proposalItem.id}`)">
            {{ proposalItem.title }}
          </div>
        </div>
      </div>
      <div class="other-info d-flex justify-content-between ">
        <div class="font18 d-flex justify-content-between info-start font14 line-height20">
          <div style="color: #50BF00; white-space: nowrap">Agree: {{proposalItem.voteAgreeTotalScore || 0}}</div>
          <div style="color: #FF5B4D; white-space: nowrap">Disagree: {{proposalItem.voteDisagreeTotalScore || 0}}</div>
        </div>
        <div class="d-flex align-items-end info-end">
          <div class="t-flag px-1 font14 line-height16 py-1"
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
          <div class="w-auto mt-1 text-grey-7 font12 line-height20" style="white-space: nowrap">
            {{ $t("nps.proposalEnd") + ":" + endTime }}
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
  display: flex;
  flex-direction: column;
  .number-circle {
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
    background-color: var(--input-bg);
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
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
.box-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  .p-content {
    flex: 0.7;
    overflow: hidden;
    box-sizing: border-box;
  }
  .other-info {
    flex: 0.3;
    white-space: nowrap;
  }
}
@media (max-width: 1400px) {
  .box-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .p-content {
      flex: 0.6;
    }
    .other-info {
      flex: 0.4;
    }
  }
}
@media (max-width: 960px) {
  .box-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .p-content {
      flex: 1;
    }
    .other-info {
      flex: 1;
    }
  }
}
@media (max-width: 760px) {
  .box-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .p-content {
      flex: 1;
      margin-bottom: 10px;
    }
    .other-info {
      flex: 1;
    }
    .name {
      margin-bottom: 6px;
    }
  }
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
      top: 0.5rem;
    }
  }
}
</style>
