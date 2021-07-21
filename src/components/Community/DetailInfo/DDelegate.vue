<template>
  <div class="k-page delegate-page">
    <div class="loading-bg" v-if="isLoading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t('tip.loading') }}</p>
    </div>
    <template v-else>
      <div v-if="delegateDataList.length > 0"></div>
      <div class="empty-bg" v-else>
        <img src="~@/static/images/empty-data.png" alt="" />
        <p> {{ $t('tip.noProject') }} </p>
      </div>
      <div class="cards-container">
        <div class="row">
          <div class="col-xl-4 col-md-6 mb-4" v-for="(card, idx) of 2" :key="idx">
            <DDelegateCard />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DDelegateCard from '@/components/Community/DetailInfo/Cards/DDelegateCard'

export default {
  name: 'DDelegate',
  components: {
    DDelegateCard
  },
  data () {
    return {
      isLoading: false,
      delegateDataList: ['']
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
