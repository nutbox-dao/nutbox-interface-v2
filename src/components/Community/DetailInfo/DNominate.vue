<template>
  <div class="nominate-block">
    <div class="loading-bg" v-if="!isConnected">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="crowdstakings.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of crowdstakings" :key="idx">
            <DNominateCard :card="card"/>
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
  computed: {
    ...mapState('polkadot', ['isConnected', 'crowdstakings'])
  }
}
</script>

<style lang="scss" scoped>
</style>
