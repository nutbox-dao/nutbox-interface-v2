<template>
  <div class="container scroll-content">
    <div class="c-card mb-5">
      <b-alert variant="danger" :show="!isValid">
        {{
          $t("nps.validationWarning.basic.minScore", [
            form.threshold,
            form.symbol,
          ])
        }}</b-alert
      >
      <div class="custom-form col-md-9">
        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('nps.title')"
          label-for="proposalTitleInput"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalTitleInput"
            required
            :placeholder="$t('nps.proposalTitleInput')"
            v-model="proposal.title"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('community.currentBlock')"
          label-for="proposalCurrent"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalCurrent"
            required
            class="mb-2"
            :value="blockNum"
            readonly
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('nps.proposalFirst_Block')"
          label-for="proposalStart"
          :description="startTime"
          label-class="text-left font16"
        >
          <b-form-input
            label-cols-md="3"
            content-cols-md="9"
            id="proposalStart"
            required
            class="mb-2"
            type="number"
            :step="1"
            :placeholder="$t('nps.proposalFirst_Block')"
            v-model="proposal.first_block"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('nps.proposalEnd_Block')"
          label-for="proposalEnd"
          :description="endTime"
          label-class="text-left font16"
        >
          <b-form-input
            id="proposalEnd"
            required
            class="mb-2"
            type="number"
            :step="1"
            :placeholder="$t('nps.proposalEnd_Block')"
            v-model="proposal.end_block"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('nps.proposalBody')"
          label-for="proposalBodyInput"
          label-class="text-left font16"
        >
          <b-form-textarea
            id="proposalBodyInput"
            required
            :placeholder="$t('nps.proposalBodyInput')"
            rows="8"
            v-model="proposal.body"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group
          label-cols-md="3"
          content-cols-md="9"
          :label="$t('nps.proposalBodyPreview')"
          label-class="text-left font16"
        >
          <Markdown :body="proposal.body" class="text-left font16" />
        </b-form-group>
        <b-form-group label-cols-md="3" content-cols-md="6">
          <button
            class="primary-btn"
            @click="submitProposal"
            :disabled="commiting || isLoading"
          >
            <b-spinner small type="grow" v-show="commiting" />
            {{ $t("operation.commit") }}
          </button>
        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { handleApiErrCode, blockTimeWithoutUTC, sleep } from '@/utils/helper'
import Markdown from '@/components/common/Markdown'
import { getERC20Balance } from '@/utils/web3/asset'
import { completeProposal } from '@/utils/web3/proposal'

export default {
  name: 'ProposalCreate',
  components: {
    Markdown
  },
  data () {
    return {
      url: '',
      commiting: false,
      activeTab: 0,
      proposal: {
        title: '',
        userId: '',
        communityId: '',
        network: '',
        type: 'proposal',
        start: '',
        end: '',
        body: '',
        first_block: '',
        end_block:''
      },
      noCommunity: false,
      isValid: false,
      isLoading: true,
      form: {
        communityId: '',
        network: '',
        networkName: '',
        symbol: '',
        skin: '',
        admins: '',
        members: '',
        strategies: '',
        threshold: 0,
        validation: 'basic',
        onlyMembers: 0,
        userId: ''
      }
    }
  },
  computed: {
    ...mapState({
      blockNum: (state) => state.web3.blockNum
    }),
    ...mapState('currentCommunity', ['communityId', 'cToken']),
    ...mapState('web3', ['account']),
    ...mapGetters('community', ['getCommunityInfoById']),
    startTime () {
      return blockTimeWithoutUTC(this.blockNum, this.proposal.first_block)
    },
    endTime () {
      return blockTimeWithoutUTC(this.blockNum, this.proposal.end_block)
    }
  },
  methods: {
    async submitProposal () {
      try {
        if(!this.proposal.title || this.proposal.title.length === 0 || !this.proposal.body || this.proposal.body.length === 0 || !this.proposal.first_block || !this.proposal.end_block) {
          this.$bvToast.toast(this.$t('nps.completeContent'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.proposal.end_block <= this.proposal.start_block) {
          this.$bvToast.toast(this.$t('nps.endLtStart'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
        }
        this.commiting = true
        const b = await getERC20Balance(this.cToken.address);
        if (b.toString() / (10 ** this.cToken.decimal) < this.form.threshold) {
          this.$bvToast.toast(this.$t("nps.validationWarning.basic.minScore", [
            this.form.threshold,
            this.form.symbol,
          ]), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          this.commiting = false
          return;
        }
        this.proposal.communityId = this.form.communityId
        this.proposal.strategies = this.form.strategies
        this.proposal.network = this.form.network
        this.proposal.threshold = this.form.threshold
        this.proposal.passthreshold = this.form.passthreshold
        this.proposal.start = this.startTime
        this.proposal.end = this.endTime
        const result = await completeProposal(this.proposal)

        if (result.code == 0) {
          this.$bvToast.toast(this.$t('tip.completeProposalSuccess'), {
            title: this.$t('tip.tips'),
            variant: 'success'
          })
          await sleep(3)
          /* this.$router.replace("/nps/proposal-space/" + this.form.communityId); */
          this.$router.back()
        }
      } catch (e) {
        console.log('Post proposal fail:', e);
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.commiting = false
      }
    }
  },
  async mounted () {
    if (!this.account) return;
    console.log(this.account);
    while(!this.cToken || !this.cToken.address){
      await sleep(0.3)
    }
    const community = await this.getCommunityInfoById(this.communityId)
    this.form = {
      communityId: this.communityId,
      symbol: this.cToken.symbol,
      threshold: community.threshold,
      validation: 'basic',
      userId: this.account,
      strategies: community.strategies,
      passthreshold: community.passthreshold
    }
    this.isLoading = false
  }
}
</script>
<style  lang="scss" scoped>
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem 4rem, var(--card-bg-primary), hidden, fit-content);
}
textarea {
  min-height: 14rem;
}

.date-icon {
  @include icon();
  background-image: url("~@/static/images/list-down-arrow.svg");
}
</style>
