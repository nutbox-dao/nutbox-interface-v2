<template>
  <div class="page-container">
    <div class="page-view-sidebar">
      <b-nav vertical>
        <b-nav-item to="/community">Community List</b-nav-item>
        <b-nav-item to="#">Community Tokens</b-nav-item>
      </b-nav>
    </div>
    <div class="side-page-view-content">
      <div class="container scroll-content">
        <div class="view-top-header p-view-top-header flex-between-center">
          <div class="nav-box nav-box-bg">
            <div class="nav">
              <span v-for="(item, index) of tabOptions" :key="index"
                    :class="activeTab===index?'active':''"
                    @click="activeTab = index">{{item}}</span>
            </div>
          </div>
          <div class="c-btn-group" v-show="!loadingCommunity">
            <button v-if="communityId"
                    @click="$router.push('/community/pool-dashboard')">{{ $t('community.communityDashboard') }}</button>
            <button v-else @click="$router.push('/community/tutorials')">
              <i class="add-icon"></i>
              <span>{{ $t('community.createYourCommunity') }}</span>
            </button>
          </div>
        </div>
        <div class="view-top-header m-view-top-header flex-between-center">
          <div class="nav-box nav-box-bg">
            <div class="nav">
              <b-nav-item to="/community">Community List</b-nav-item>
              <b-nav-item to="#">Community Tokens</b-nav-item>
            </div>
          </div>
          <b-dropdown variant="text" class="m-0 top-header-dropdown" toggle-class="c-icon-toggle" right no-caret>
            <template #button-content>
              <i class="add-icon"></i>
            </template>
            <b-dropdown-item v-for="(item, index) of tabOptions" :key="index"
                  :class="activeTab===index?'active':''"
                  @click="activeTab = index">{{item}}</b-dropdown-item>
          </b-dropdown>
        </div>
        <!-- <b-input-group class="search-input">
          <b-form-input :placeholder="$t('commen.search')"></b-form-input>
          <template #append>
            <i class="search-icon"></i>
          </template>
        </b-input-group> -->
        <div class="loading-bg" v-if="loading">
          <img src="~@/static/images/loading.gif" alt="" />
          <p class="font16">{{ $t("tip.loading") }}</p>
        </div>
        <template v-else>
          <div class="empty-bg" v-if="communityCard && communityCard.length === 0">
            <img src="~@/static/images/empty-data.png" alt="" />
            <p>{{ $t("tip.noCommunities") }}</p>
          </div>
          <div class="row">
            <div class="col-xl-4 col-md-6 mb-4" v-for="(cItem, index) of communityCard" :key="index">
              <CommunityCard :card-info="cItem"/>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CommunityCard from '@/components/Community/CommunityCard'
import { mapGetters, mapState } from 'vuex'
import { getMyCommunityInfo, getAllCommunities } from '@/utils/web3/community'
import { handleApiErrCode } from '../../utils/helper'
import { errCode } from '@/config'

export default {
  name: 'Community',
  components: { CommunityCard },
  data () {
    return {
      loading: false,
      activeTab: 0,
      tabOptions: ['All', 'Joined', 'Created', 'Other']
    }
  },
  computed: {
    ...mapState({
      allCommunities: state => state.web3.allCommunities,
      communityId: state => state.web3.stakingFactoryId,
      loadingCommunity: state => state.web3.loadingCommunity
    }),
    ...mapGetters('web3', ['communityCard']),
  },
  watch: {
    loadingCommunity(newValue, oldValue) {
      console.log('loadingCommunity', newValue);
    }
  },
  mounted () {
    getMyCommunityInfo().catch(e => {
      if (e === errCode.NO_STAKING_FACTORY) return;
      handleApiErrCode(e, (tip, param) => {
        this.$bvToast.toast(tip, param)
      })
    })
    this.fetchData()
  },
  methods: {
    async fetchData () {
      if (!this.allCommunities) {
        console.log(this.allCommunities);
        try{
          this.loading = true
          await getAllCommunities()
        }catch(e){
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param)
          })
        }finally{
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search-input {
  background: white;
  @include c-flex-between-center;
  border-radius: .6rem;
  margin: 2.4rem 0;
  input {
    border: none;
    height: 2.8rem;
    outline: none;
    border-radius: .6rem;
  }
  .search-icon {
    @include icon(1.2rem, 1.2rem);
    margin: .8rem;
    background-image: url("~@/static/images/search-icon.svg");
  }
}
.add-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/add-icon.svg");
}
</style>
