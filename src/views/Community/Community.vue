<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-4 text-left">
        <div class="page-view-title">{{$t("community.community") }}</div>
        <!-- <div class="page-view-subtitle">Choose token type you want deploy</div> -->
      </div>
      <div class="col-md-8 btn-group" v-show="!loadingCommunity">
        <button v-if="communityId"
                @click="$router.push('/community/pool-dashboard')">{{ $t('community.communityDashboard') }}</button>
        <button v-else @click="$router.push('/community/tutorials')">
          <i class="add-icon"></i>
          <span>{{ $t('community.createYourCommunity') }}</span>
        </button>
      </div>
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
.view-top-header {
  align-items: flex-end;
  margin-bottom: 2.4rem;
}
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
</style>
