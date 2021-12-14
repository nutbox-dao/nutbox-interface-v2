<template>
  <div class="profile-page">
    <div class="scroll-content">
      <div class="container">
        <div class="row">
          <div class="col-md-5 text-left d-flex flex-column justify-content-center">
            <img v-if="user.avatar" class="user-avatar hover rounded-circle"
                 :src="user.avatar" alt="">
            <img v-else class="user-avatar hover rounded-circle"
                 src="~@/static/images/home-s2-icon1.svg" alt="">
            <div class="d-flex align-items-center mt-2">
              <b-input class="bg-transparent text-white name-input text-center"
                       :class="isEditName?'edit':''"
                       :disabled="!isEditName"
                       placeholder="Input name"
                       v-model="user.name"></b-input>
              <i v-if="!isEditName" class="edit-icon hover" @click="isEditName=true"></i>
              <span class="hover" v-else @click="updateUser">Save</span>
            </div>
          </div>
          <div class="col-md-7">
            <div class="asset-card">
              <div class="row">
                <div class="col-sm-6 d-flex flex-column justify-content-between">
                  <div class="mb-3">
                    <div>Total Asset Value</div>
                    <div class="font28 mt-2">$850</div>
                  </div>
                  <button class="primary-btn mb-2">Detail</button>
                </div>
                <div class="col-sm-6 position-relative">
                  <PoolRatio class="asset-chart" :pools-data="assetValue" :show-legend-info="false"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="font-bold mt-5 mb-3">Joined Communities</div>
        <div class="row">
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="(community, index) of joinedCommunity" :key="index">
            <CommunityCard :card-info="community"/>
          </div>
        </div>
        <div class="font-bold mt-5 mb-3">Staked Pools</div>
          <StakedPools class="mb-3"/>
        </div>
    </div>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'
import StakedPools from '@/components/profile/StakedPools'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import CommunityCard from '@/components/community/CommunityCard'
import { getUserBaseInfo, updateUserInfo } from '@/utils/web3/account'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Profile',
  components: { PoolRatio, StakedPools, CommunityCard },
  data () {
    return {
      user:{},
      userName: 'AAA',
      isEditName: false,
      assetValue: [
        { name: 'PNUT', ratio: 20 },
        { name: 'PNUT', ratio: 20 },
        { name: 'PNUT', ratio: 20 }
      ],
    }
  },
  computed: {
    ...mapState('web3', ['account', 'userGraphInfo']),
    ...mapState('community', ['allCommunityInfo']),
    joinedCommunity() {
      if (!this.userGraphInfo || !this.userGraphInfo.inCommunities) return [];
      if (!this.allCommunityInfo || this.allCommunityInfo.length === 0) return [];
      let communities = []
      for (let i = 0; i < this.userGraphInfo.inCommunities.length; i++) {
        const community = this.userGraphInfo.inCommunities[i]
        if (this.allCommunityInfo[community.id]){
          communities.push({
            ...community,
            ...this.allCommunityInfo[community.id]
          })
        }
      }
      return communities
    }
  },
  methods: {
    async updateUser () {
      console.log(this.user);
      try {
        await updateUserInfo(this.user);
        this.$bvToast.toast(this.$t('tip.success'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e) {
        console.log(e)
      }finally{
        this.isEditName = false;
      }
    }
  },
  async mounted () {
    getUserBaseInfo(this.account).then(user => {
      console.log('get my user info', user);
      if (user) {
        this.user = user
      }
    }).catch(err => {
      console.log('get my user info fail:', err)
    })
    await getMyJoinedCommunity();

  },
}
</script>

<style scoped lang="scss">
.profile-page {
  overflow: hidden;
  height: 100%;
}
.user-avatar {
  width: 6rem;
  height: 6rem;
}
.name-input {
  width: 6rem;
  border-color: transparent;
  border-radius: 0;
  &.edit {
    border-bottom: 1px solid var(--dividers);
  }
}
.edit-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/edit-icon.svg");
}
.asset-card {
  @include card();
  height: 12rem;
  .asset-chart {
    position: absolute;
    width: 100%;
    max-width: 14rem;
    top: -3rem;
    right: 1.2rem;
  }
}
@media (max-width: 576px) {
  .asset-card {
    height: 24rem;
    .asset-chart {
      position: relative;
      margin: auto;
      top: 0;
      right: 0;
      width: 16rem;
    }
  }
}
@media (min-width: 577px) and (max-width: 991px) {
  .asset-card {
    height: 10rem;
  }
}
</style>
