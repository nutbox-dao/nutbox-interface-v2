<template>
  <div class="scroll-content">
    <div class="container">
      <div class="banner-card mb-3 mb-md-0">
        <div class="row">
          <div class="col-md-7 d-flex flex-column justify-content-center">
            <div class="text-left font50 font-bold py-lg-4">
              It's easy to bring DeFi,social media and Governance to the community
            </div>
          </div>
          <div class="col-md-1 d-flex flex-column justify-content-center">
            <div class="v-line mx-auto"></div>
          </div>
          <div class="col-md-4 d-flex align-items-center flex-md-row flex-column">
            <div class="mx-3 my-md-0 my-3 font-bold">OR</div>
            <ConnectMetaMask v-if="!metamaskConnected"/>
            <button v-else class="primary-btn d-flex justify-content-center align-items-center"
                    @click="$router.push('/community/deploy-token')">
              <i class="add-icon mr-2"></i>
              <span>Create Community</span>
            </button>
          </div>
        </div>
      </div>
      <div class="view-top-header view-top-header-sticky">
        <div class="row">
          <div class="col-lg-6">
            <div class="nav-box nav-box-bg">
              <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-lg-0 mt-3">
            <div class="row">
              <div class="col-sm-7 d-flex justify-content-end">
                <div class="d-flex align-items-center">
                  <span class="mr-2 font12">Official only</span>
                  <ToggleSwitch v-model="isOfficial"/>
                </div>
                <b-dropdown variant="text" class="top-header-dropdown ml-3" toggle-class="p-0">
                  <template #button-content>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="mr-4">{{selectType}}</span>
                      <i class="dropdown-icon"></i>
                    </div>
                  </template>
                  <b-dropdown-item @click="selectType='TVL'">TVL</b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="col-sm-5 mt-sm-0 mt-3">
                <b-input-group class="search-input">
                  <b-form-input :placeholder="$t('operation.search')" v-model="searchText"></b-form-input>
                  <template #append>
                    <i class="search-icon"></i>
                  </template>
                </b-input-group>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-bg" v-if="loading">
        <img src="~@/static/images/loading.gif" alt="" />
        <p class="font16">{{ $t("tip.loading") }}</p>
      </div>
      <template v-else>
<!--        <div class="empty-bg" v-if="!filterCommunities || filterCommunities.length === 0">-->
<!--          <img src="~@/static/images/empty-data.png" alt="" />-->
<!--          <p>{{ $t("tip.noCommunities") }}</p>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <div class="col-xl-4 col-md-6 mb-4" v-for="(cItem, index) of filterCommunities" :key="index">-->
<!--            <CommunityCard :card-info="cItem"/>-->
<!--          </div>-->
<!--        </div>-->
      </template>
    </div>
  </div>
</template>

<script>
import CommunityCard from '@/components/community/CommunityCard'
import { errCode, CHAIN_NAME } from '@/config'
import { mapState } from "vuex";
import ConnectMetaMask from '@/components/common/ConnectMetaMask'
import ToggleSwitch from '@/components/common/ToggleSwitch'

export default {
  name: 'CommunityIndex',
  components: { CommunityCard, ConnectMetaMask, ToggleSwitch },
  computed: {
    ...mapState(['metamaskConnected']),
  },
  data () {
    return {
      loading: false,
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Polkadot', 'Steem', 'Hive'],
      searchText: '',
      isOfficial: false,
      selectType: 'TVL'
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.banner-card {
  @include card();
  .v-line {
    width: 1px;
    height: 3rem;
    background-color: var(--dividers);
    border-radius: 50%;
  }
}
.add-icon {
  @include icon();
  background-image: url("~@/static/images/add-white-icon.svg");
}
@media (max-width: 767px) {
  .banner-card .v-line {
    height: 0;
  }
}
</style>
