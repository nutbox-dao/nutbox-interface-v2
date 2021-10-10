<template>
  <div class="k-page crowdstaking-page">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="stakingCards.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="card, idx of stakingCards" :key="idx">
            <CrowdStakingCard
              :card="card"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CrowdStakingCard from "../../components/CrowdStaking/CrowdStakingCard";
import { mapState, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    CrowdStakingCard,
  },
  computed: {
    ...mapState('web3', ['loadingAllPools']),
    ...mapGetters('web3', ['poolCards']),
    stakingCards() {
      return this.poolCards ? this.poolCards.filter(pool => pool.type === 'HomeChainAssetRegistry') : []
    }
  },
  mounted () {
  },
};
</script>

<style lang="scss" scoped>
</style>
