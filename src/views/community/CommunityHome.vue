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
            <div class="mx-3 my-md-0 my-3">OR</div>
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
          <div class="col-md-6">
            <div class="nav-box nav-box-bg mb-3 mb-md-0">
              <div class="nav">
                <span v-for="(item, index) of tabOptions" :key="index"
                      :class="activeTab===index?'active':''"
                      @click="activeTab = index">{{item}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-6"></div>
              <div class="col-md-6">
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

export default {
  name: 'CommunityIndex',
  components: { CommunityCard, ConnectMetaMask },
  computed: {
    ...mapState(['metamaskConnected', 'prices']),
  },
  data () {
    return {
      loading: false,
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Polkadot', 'Steem', 'Hive'],
      searchText: ''
    }
  }
}
</script>

<style scoped lang="scss">
.banner-card {
  @include card();
  border: 1px solid var(--card-broder);
  .v-line {
    width: 1px;
    height: 3rem;
    background-color: var(--dividers);
  }
}
.search-input {
  background: var(--nav-tab-bg);
  @include c-flex-between-center;
  border-radius: .4rem;
  height: 2rem;
  input {
    border: none;
    height: 2rem;
    outline: none;
    border-radius: .4rem;
    background-color: var(--nav-tab-bg);
  }
  .search-icon {
    @include icon(1.2rem, 1.2rem);
    margin-right: .8rem;
    background-image: url("~@/static/images/search-icon.svg");
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
