<template>
  <div class="tab-card">
    <div class="tabs tabs-3 font16">
      <span v-for="item of tabOptions" :key="item.id"
            :class="activeTab===item.id?'active':''"
            @click="activeTab=item.id">{{ $t('asset.' + item.name) }}</span>
    </div>
    <div class="h-line"></div>
    <div class="text-left form-box">
      <component :is="tabOptions[activeTab]['cName']"></component>
    </div>
  </div>
</template>

<script>
import DelegationForm from '@/components/RegisterAsset/DelegationForm'
export default {
  name: 'CrossChainAsset',
  components: { DelegationForm },
  data () {
    return {
      activeTab: 0,
      tabOptions: [
        { name: 'registerSteemTab', id: 0, cName: 'DelegationForm' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/tab-card";
.tab-card {
  min-height: 27rem;
  .tabs {
    padding-top: 1.2rem;
    span {
      padding-top: .3rem;
      padding-bottom: .3rem;
    }
  }
}
.tab-card .tabs span {
  padding-left: 2.4rem;
  padding-right: 2.4rem;
}
@media (max-width: 960px) {
  .tab-card .tabs span{
    padding-left: .2rem;
    padding-right: .2rem;
  }
}
</style>
