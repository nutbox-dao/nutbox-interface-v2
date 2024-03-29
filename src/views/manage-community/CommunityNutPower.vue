<template>
  <div class="scroll-content">
    <div class="view-top-header view-top-header-sticky">
      <div class="row">
        <div class="col-xl-7 d-flex flex-column justify-content-center">
          <div class="font24 line-height28 font-bold mb-2">{{ $t('np.nutPower') }}</div>
          <div class="font16 line-height24 font-bold mb-4">
            {{ $t('np.npDesc') }}
          </div>
        </div>
        <div class="col-xl-5">
          <div class="c-btn-group m-2">
            <button class="primary-btn primary-btn-outline w-auto mx-0 px-3"
                    style="height: 2rem"
                    @click="claimModal=true">
              {{ $t('np.claimNut') }}
            </button>
            <button class="primary-btn w-auto mx-0 d-flex align-items-center px-3"
                    style="height: 2rem"
                    @click="addPoolModal=true">
              <i class="add-icon add-icon-white mr-2"></i>
              <span>{{ $t('operation.addPool') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="gauges && gauges.length===0"
         class="empty-card mb-5 d-flex flex-column justify-content-center">
      <div class="empty-bg">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t('pool.noPools') }}</p>
      </div>
    </div>
    <template v-else>
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4" v-for="gauge of gauges" :key="gauge.id">
          <ManageNPCard :gauge="gauge" :totalVotedNP="totalVotedNP"/>
        </div>
      </div>
    </template>
    <b-modal
      v-model="claimModal"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <div class="custom-form text-center">
        <div class="font20 line-height24 mt-2 mb-4">{{ $t('np.availabeClaimNut', {amount: formAmount(communityPendingNut)}) }}</div>
        <div class="d-flex justify-content-between mt-3" style="margin: 0 -1rem">
          <button class="dark-btn primary-btn-outline mx-3" :disabled="harvestingNut" @click="claimModal = false">
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" :disabled="harvestingNut" @click="harvest">
            <b-spinner small type="grow" v-show="harvestingNut"/>
            {{ $t('operation.claim') }}
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="addPoolModal"
      modal-class="custom-modal"
      size="xl"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <AddNPPool :pendingPool="waitingForGauge" @close="addPoolModal=false"/>
    </b-modal>
  </div>
</template>

<script>
import ManageNPCard from '@/components/community/ManageNPCard'
import AddNPPool from '@/components/community/AddNPPool'
import { mapState } from 'vuex';
import { getGaugeVoteInfo, getGaugeParams, getCommunityPendingRewardNut } from '@/utils/nutbox/gauge'
import { getNPInfoByPolling } from '@/utils/nutbox/nutpower'
import { sleep } from '@/utils/helper'
import { handleApiErrCode, formatAmount } from '../../utils/helper';

export default {
  name: 'CommunityNutPower',
  components: { ManageNPCard, AddNPPool },
  data () {
    return {
      claimModal: false,
      addPoolModal: false,
      harvestingNut: false
    }
  },
  computed: {
    ...mapState('community', ['communityData']),
    ...mapState('gauge', ['communityPendingRewardNut']),
    waitingForGauge() {
      return this.communityData ? this.communityData.pools.filter(p => p.hasCreateGauge === 0 && p.status === 'OPENED') : []
    },
    gauges() {
      return this.communityData ? this.communityData.pools.filter(p => p.hasCreateGauge === 1) : []
    },
    communityPendingNut() {
      if (this.communityPendingRewardNut){
        return this.communityPendingRewardNut.toString() / 1e18;
      }
      return 0
    },
    totalVotedNP() {
      if (this.gauges.length > 0) {
        return this.gauges.reduce((a,b) => a + (b.votedAmount.toString() /1e18), 0)
      }
      return 0
    }
  },
  async mounted () {
    getGaugeParams()
    getCommunityPendingRewardNut()
    const polling = getNPInfoByPolling()
    this.$once('hook:beforeDestroy', () => {
        polling.stop();
    });
  },
  methods: {
    formAmount(a) {
      return formatAmount(a)
    },
    async harvest() {
      try{
        if(this.communityPendingNut <= 0){
          this.$bvToast.toast('No more NUT to claim', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        this.harvestingNut = true
        await communityWithdrawNut()
        this.$bvToast.toast(this.$t('tip.harvestSuccess'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
        await sleep(3)
        this.claimModal = false
      }catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.harvestingNut = false
      }
    }
  }
}
</script>

<style scoped>

</style>
