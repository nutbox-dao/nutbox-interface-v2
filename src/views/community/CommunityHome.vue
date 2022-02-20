<template>
  <div class="scroll-content">
    <div class="container">
      <div class="banner-card mb-3 mb-md-0">
        <div class="row">
          <div class="col-md-7 d-flex flex-column justify-content-center">
            <div class="text-left font20 line-height28 font-bold py-lg-4">
              It's easy to bring DeFi,social media and Governance to the community
            </div>
          </div>
          <div class="col-md-1 d-flex flex-column justify-content-center">
            <div class="v-line mx-auto"></div>
          </div>
          <div class="col-md-4 d-flex align-items-center flex-md-row flex-column">
            <div class="mx-3 my-md-0 my-3 font-bold font20 line-height28">OR</div>
            <ConnectMetaMask class="w-100" v-if="!metamaskConnected"/>
            <button v-else :disabled="loadingMyCommunityInfo" class="primary-btn d-flex justify-content-center align-items-center w-100"
                    @click="manageCommunity">
              <i class="add-icon mr-2"></i>
              <span>{{ settingStep === 3 ? 'Manage Community' : 'Create Community' }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="view-top-header view-top-header-sticky mt-5">
        <div class="row">
          <div class="col-lg-6">
            <!-- <div class="nav-box nav-box-bg">
              <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
              </div>
            </div> -->
          </div>
          <div class="col-lg-6 mt-lg-0 mt-3">
            <div class="row">
              <div class="col-sm-7 d-flex justify-content-end">
                <div class="d-flex align-items-center">
                  <span class="mr-2 font12">Official only</span>
                  <ToggleSwitch v-model="isOfficial"/>
                </div>
                <!-- <b-dropdown variant="text" class="top-header-dropdown ml-3" toggle-class="p-0">
                  <template #button-content>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="mr-4">{{selectType}}</span>
                      <i class="dropdown-icon"></i>
                    </div>
                  </template>
                  <b-dropdown-item @click="selectType='TVL'">TVL</b-dropdown-item>
                  <b-dropdown-item @click="selectType='USER'">USER</b-dropdown-item>
                  <b-dropdown-item @click="selectType='POOL'">POOL</b-dropdown-item>
                </b-dropdown> -->
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
      <div class="position-relative my-5" v-if="loading">
        <div class="c-loading"></div>
<!--        <p class="font16 text-center mt-4">{{ $t("tip.loading") }}</p>-->
      </div>
      <template v-else>
       <div class="empty-bg" v-if="!showingCommunity || showingCommunity.length === 0">
         <img src="~@/static/images/empty-data.png" alt="" />
         <p>{{ $t("tip.noCommunities") }}</p>
       </div>
        <div class="cards-box">
          <div class="card-item" v-for="(cItem, index) of showingCommunity" :key="index">
            <CommunityCard :card-info="cItem"/>
          </div>
        </div>
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
    ...mapState('web3', ['stakingFactoryId']),
    ...mapState('community', ['loadingAllCommunityInfo', 'loadingMyCommunityInfo', 'allCommunityInfo', 'communityInfo']),
    showingCommunity() {
      let communities = this.allCommunityInfo
      if (!communities || Object.keys(communities).length === 0) return [];
      communities = Object.values(communities)
      if(this.isOfficial) {
        communities = communities.filter(c => parseInt(c.isVip) == 1)
      }

      if (this.searchText && this.searchText.length > 0) {
        communities = communities.filter(c => c.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1)
      }
      switch (this.selectType) {
        case "TVL":
          break;
        case "USER":
          break;
        case "POOL":
        break;
      }
      return communities
    },
    settingStep () {
      const c = this.communityInfo
      if (!this.stakingFactoryId){
        return 1;
      }
      if (c && c.name && c.name.length > 0) {
        return 3;
      }else {
        return 2;
      }
    }
  },
  watch: {
    loadingAllCommunityInfo(newValue, oldValue) {
      if (!newValue) {
        this.loading = false
      }
    }
  },
  mounted () {
    if (!this.loadingAllCommunityInfo){
      this.loading = false
    }
  },
  data () {
    return {
      activeTab: 0,
      loading: true,
      tabOptions: ['All', CHAIN_NAME, 'Polkadot', 'Steem', 'Hive'],
      searchText: '',
      isOfficial: false,
      selectType: 'TVL'
    }
  },
  methods: {
    manageCommunity() {
      if (this.settingStep === 3) {
        this.$router.push('/manage-community')
      }else {
        this.$router.push('/create/deploy-token')
      }
    },
  },
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
.card-item {
  width: 308px;
  height: 336px;
}
@media (max-width: 767px) {
  .banner-card .v-line {
    height: 0;
  }
}
</style>
