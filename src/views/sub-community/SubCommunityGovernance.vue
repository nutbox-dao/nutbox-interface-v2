<template>
  <div class="page-view-content nps h-100 position-relative">
    <div class="c-loading c-loading-absolute c-loading-bg" v-if="loading"></div>
    <div class="scroll-content" v-else>
      <div class="tip-box" :style="poster ? {backgroundImage: `url(${poster})`} : ''">
        <div style="text-align: left">
          <Markdown :body="remark" />
        </div>
      </div>
      <div class="view-top-header d-flex my-3">
        <div class="nav-box nav-box-bg">
          <div class="nav">
                <span
                  v-for="(item, index) of tabOptions"
                  :key="index"
                  :class="activeTab === index ? 'active' : ''"
                  @click="activeTab = index"
                >{{ $t('nps.' + item) }}</span
                >
          </div>
        </div>
        <div class="c-btn-group">
          <button class="primary-btn d-flex align-items-center px-2 c-btn"
                  @click="$router.push(`/sub-community/governance/create`)">
            <i class="add-icon add-icon-dark mr-1"></i>
            <span>{{ $t('nps.createProposal') }}</span>
          </button>
        </div>
      </div>

      <div class="empty-bg" v-if="!proposalitems || proposalitems.length === 0">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t("nps.noProposals") }}</p>
      </div>
      <div class="mb-5" v-else>
        <ProposalItem
          v-for="(proposalItem, index) in proposalitems"
          :key="proposalItem.id"
          :proposalItem="proposalItem"
          :index="index"
        ></ProposalItem>
      </div>
    </div>
  </div>
</template>

<script>
import ProposalItem from '@/components/community/ProposalItem.vue'
import { handleApiErrCode } from '@/utils/helper'
import { getAllProposal } from '@/utils/web3/proposal'
import Markdown from '@/components/common/Markdown'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Community',
  components: {
    ProposalItem,
    Markdown
  },
  computed: {
    ...mapState({
      proposals: state => state.currentCommunity.proposals,
      account: state => state.web3.account
    }),
    ...mapState('currentCommunity', ['communityId']),
    ...mapGetters('community', ['getCommunityInfoById']),
    // status: 0 unstart,1 voting, 2 end
    // proposalresult: 0 unstart, 1 pass, 2 unpass.
    proposalitems () {
      if (!this.proposals) return []
      if (this.activeTab == 0) {
        return this.proposals
      } else if (this.activeTab == 1) {
        return this.proposals.filter((t) => t.status == 1)
      } else if (this.activeTab == 2) {
        return this.proposals.filter(
          (t) => t.proposalResult == 1
        )
      } else if (this.activeTab == 3) {
        return this.proposals.filter(
          (t) => t.proposalResult == 2
        )
      } else if (this.activeTab == 4) {
        return this.proposals.filter(
          (t) => t.userId == this.account
        )
      }
    },
    communityInfo() {
      return this.getCommunityInfoById(this.communityId)
    },
    remark() {
      if (!this.communityInfo) return;
      return this.communityInfo.remark
    },
    poster() {
      if (!this.communityInfo) return;
      return this.communityInfo.npsPoster
    }
  },
  data () {
    return {
      tabOptions: ['all', 'rolling', 'pass', 'unpass', 'mine'],
      activeTab: 0,
      loading: false
    }
  },
  async mounted () {
    this.loading = true
    try {
      getAllProposal(this.communityId)
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params)
      })
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
.nps {
  .tip-box {
    @include card(2rem 1.2rem, rgba(0, 0, 0, 0.2), hidden, fit-content);
    color: white;
    background-image: url('~@/static/images/poster.png');
    // background-image: url('https://cdn.wherein.mobi/nutbox/v2/1636692518345');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-blend-mode: color;
  }
}
.view-top-header {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 720px) {
  .view-top-header {
    flex-direction: column;
    overflow: hidden;
    .nav-box {
      width: 100%;
      overflow: auto;
    }
  }
  .c-btn {
    margin-top: 0.5rem;
    margin-right: 0;
    width: fit-content;
  }
}
@media (max-width: 560px) {
  .view-top-header {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
