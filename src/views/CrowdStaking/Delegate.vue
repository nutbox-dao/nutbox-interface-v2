<template>
    <div>
      <div class="view-top-header view-top-header-sticky view-top-header-pt0 p-view-top-header flex-between-center">
        <div class="nav-box nav-box-bg">
          <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
          </div>
        </div>
        <component :is="tabOptions[activeTab] + 'Account'"/>
      </div>
      <component :is="tabOptions[activeTab] + 'Delegate'"/>
    </div>
</template>

<script>
import SteemAccount from '@/components/Accounts/SteemAccount'
import HiveAccount from '@/components/Accounts/HiveAccount'
import HiveDelegate from '@/views/CrowdStaking/HiveDelegate'
import SteemDelegate from '@/views/CrowdStaking/SteemDelegate'

export default {
    name: 'Delegate',
    components: {
        SteemAccount,
        HiveAccount,
        SteemDelegate,
        HiveDelegate
    },
    data() {
        return {
            activeTab: 0,
            tabOptions: ['Steem', 'Hive']
        }
    },
}
</script>

<style lang="scss" scoped>

</style>