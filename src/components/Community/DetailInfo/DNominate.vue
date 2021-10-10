<template>
  <div class="nominate-block">
    <div class="loading-bg" v-if="loadingAllPools">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="nominatePools.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of nominatePools" :key="idx">
            <DNominateCard :nomination="card"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DNominateCard from '@/components/Community/DetailInfo/Cards/DNominateCard'
import { mapState } from 'vuex'

export default {
  name: 'DCrowdStaking',
  components: {
    DNominateCard
  },
  props: {
    nominatePools: {
      type: Array,
    },
  },
  computed: {
    ...mapState('web3', ['loadingAllPools'])
  }
}
</script>

<style lang="scss" scoped>
</style>
