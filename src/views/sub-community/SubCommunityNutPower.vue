<template>
  <div class="sub-staking-page h-100 position-relative">
    <div class="scroll-content position-relative">
      <div class="top-card">
        <div class="desc-info font20 line-height32 font-bold">
          Nut Power introduction Nut Power introduction
          Nut Power introduction Nut Power introduction Nut Power introduction
        </div>
        <div class="v-line"></div>
        <NPAssetCard/>
      </div>
      <div class="c-loading my-5" v-if="loading"></div>
      <template v-else>
        <div class="empty-bg" v-if="gauges.length === 0">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('tip.noProject') }} </p>
        </div>
        <div v-else class="cards-container">
          <div class="cards-box cards-box-col3" :class="'col3-items-'+gauges.length">
            <div class="card-item" v-for="(gauge) of gauges" :key="gauge.id">
              <CommunityNPCard :card="gauge"/>
            </div>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import CommunityNPCard from '@/components/community/CommunityNPCard'
import NPAssetCard from '@/components/community/NPAssetCard'
import { mapState, mapGetters } from 'vuex';
import { updateBalanceByPolling } from '@/utils/nutbox/nutpower'

export default {
  name: 'SubCommunityStaking',
  components: { CommunityNPCard, NPAssetCard },
  computed: {
    ...mapState('currentCommunity', ['communityId', 'communityInfo', 'loadingCommunityInfo', 'allPools', 'feeRatio', 'cToken', 'specifyDistributionEras', 'operationHistory']),
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('np', ['balance']),
    gauges() {
      if(this.allPools && this.allPools.length > 0){
        return this.allPools.filter(p => p.hasCreateGauge == 1)
      }
      return []
    }
  },
  data () {
    return {
      loading: false,
    }
  },
  mounted () {
    const polling = updateBalanceByPolling()
    this.$once('hook:beforeDestroy', () => {
        polling.stop();
    });
  },
}
</script>

<style scoped lang="scss">
.sub-staking-page {
  overflow: auto;
}
.card-item {
  width: 354px;
  height: 434px;
}
.top-card {
  @include card();
  height: fit-content;
  display: flex;
  margin-bottom: 1rem;
  .v-line {
    width: 2px;
    height: 8rem;
    background-color: var(--dividers);
    margin: auto 2.4rem;
  }
}
.asset-card {
  height: fit-content;
  flex: 1;
}
.desc-info {
  flex: 1;
}
@media  (max-width: 1060px) {
  .top-card {
    flex-direction: column;
  }
  .top-card .v-line {
    display: none;
  }
}
</style>
