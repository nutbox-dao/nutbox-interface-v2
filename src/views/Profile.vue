<template>
  <div class="profile-page">
    <div class="scroll-content">
      <div class="container">
        <div class="user-info-box d-flex">
          <!-- header -->
          <div class="user-base-info-box text-left d-flex flex-column justify-content-center">
            <img v-if="user.avatar" @click="avatarModalVisible=true" class="user-avatar hover rounded-circle"
                 :src="user.avatar" alt="">
            <img v-else @click="avatarModalVisible=true" class="user-avatar hover rounded-circle"
                 src="~@/static/images/avatars/default.png" alt="">
            <div class="d-flex align-items-center mt-3">
              <b-input class="text-white name-input text-center"
                       :class="isEditName?'edit':''"
                       :disabled="!isEditName"
                       placeholder="Input name"
                       v-model="user.name"></b-input>
              <i v-if="!isEditName" class="edit-icon hover" @click="isEditName=true"></i>
              <span class="hover" v-else @click="updateUser">Save</span>
            </div>
          </div>
          <!-- token list -->
          <div class="user-asset-info-box">
            <div class="asset-tabs">
              <div class="tab tab0" :class="assetTab===0?'active':''" @click="assetTab=0">Token</div>
              <div class="tab tab1" :class="assetTab===1?'active':''" @click="assetTab=1">NP</div>
            </div>
            <div v-show="assetTab===0" class="asset-card">
              <div class="d-flex user-asset justify-content-between">
                <div class="font20 line-height28 font-bold">Total Asset Value</div>
                <div class="value-box">
                  <div class="value-info">
                    <div class="font20 line-height20 font-bold">{{ totalValue | formatPrice }}</div>
                  </div>
                  <button class="primary-btn px-4 mx-0" @click="assetModalVisible=true">Detail</button>
                </div>
              </div>
              <div class="chart-box position-relative">
                <PoolRatio class="asset-chart"
                           :chart-style="{width: '15rem'}"
                           :pools-data="chartToken"
                           :animation="false"
                           :show-data-label="true"
                           :show-legend-info="false"/>
              </div>
              <div class="c-loading c-loading-bg c-loading-absolute" v-if="loadingBalance"></div>
            </div>
            <NPAssetCard v-show="assetTab===1"/>
          </div>
        </div>
        <!-- community -->
        <div class="font-bold mt-5 mb-3 font20 line-height32">Joined Communities</div>
        <div class="row" v-if="joinedCommunity && joinedCommunity.length > 0">
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="(community, index) of joinedCommunity" :key="index">
            <CommunityCard :card-info="community"/>
          </div>
        </div>
        <div class="empty-bg" v-else>
          <img src="~@/static/images/empty-data.png" alt="" />
          <p> {{ $t('community.noJoinedCommunity') }} </p>
          <router-link to="/community" style="text-decoration: none;">
            <button class="primary-btn w-auto px-4">
              {{ $t('community.exploreCommunity') }}
            </button>
          </router-link>
        </div>
        <div class="c-loading" v-show="loadingCommunity"></div>
        <!-- pools -->
        <div class="font-bold mt-4 mb-3 font20 line-height32">Staked Pools</div>
          <StakedPools class="mb-3"/>
        </div>
    </div>
    <!-- token list -->
    <b-modal
      v-model="assetModalVisible"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <AssetDetailModal :tokens="balances" :totalValue="totalValue" @close="assetModalVisible=false"/>
    </b-modal>
    <!-- avatat modal -->
    <b-modal
      v-model="avatarModalVisible"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <AvatarOptionsModal @close="closeAvatar"/>
    </b-modal>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'
import StakedPools from '@/components/profile/StakedPools'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import CommunityCard from '@/components/community/CommunityCard'
import { getUserBaseInfo, updateUserInfo } from '@/utils/web3/account'
import { mapState, mapGetters } from 'vuex'
import AssetDetailModal from '@/components/profile/AssetDetailModal'
import AvatarOptionsModal from '@/components/profile/AvatarOptionsModal';
import { getCtokenBalance } from '@/utils/web3/asset'
import { rollingFunction } from '@/utils/helper'
import NPAssetCard from '@/components/community/NPAssetCard'
import { updateBalanceByPolling, getNPInfoByPolling } from '@/utils/nutbox/nutpower'

export default {
  name: 'Profile',
  components: { PoolRatio, StakedPools, CommunityCard, AssetDetailModal, AvatarOptionsModal, NPAssetCard },
  data () {
    return {
      user:{},
      userName: 'AAA',
      isEditName: false,
      assetModalVisible: false,
      avatarModalVisible: false,
      loadingBalance: true,
      loadingCommunity: true,
      balances: [],
      chartToken: [],
      assetTab: 0
    }
  },
  computed: {
    ...mapState('web3', ['account', 'allTokens']),
    ...mapState('user', ['userGraphInfo']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapGetters('web3', ['tokenByKey']),
    joinedCommunity() {
      if (!this.userGraphInfo || !this.userGraphInfo.inCommunities) return [];
      if (!this.allCommunityInfo || this.allCommunityInfo.length === 0) return [];
      let communities = []
      for (let i = 0; i < this.userGraphInfo.inCommunities.length; i++) {
        const community = this.userGraphInfo.inCommunities[i]
        const communityId = community.id.toLowerCase()
        if (this.allCommunityInfo[communityId]){
          communities.push({
            ...community,
            ...this.allCommunityInfo[communityId]
          })
        }
      }
      return communities
    },
    totalValue() {
      if (!this.balances) return 0;
      let value = 0;
      for (let i = 0; i < this.balances.length; i++){
        const t = this.balances[i]
        if (t.balance == 0 || t.price == 0 || !t.price){
          continue;
        }
        value += t.balance * t.price
      }
      return value
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
    },
    closeAvatar (avatar) {
      if (avatar) {
        this.user.avatar = avatar
      }
      this.avatarModalVisible=false
    }
  },
  async mounted () {
    getUserBaseInfo(this.account).then(user => {
      if (user) {
        this.user = user
      }
    }).catch(err => {
      console.log('get my user info fail:', err)
    })
    getMyJoinedCommunity().then(res => this.loadingCommunity = false);
    const interval = rollingFunction(getCtokenBalance, null, 15, res => {
      if(!this.allTokens) return;
      let ctokens = []
      Object.keys(res).forEach(address => {
        const token = this.tokenByKey(address)
        if (token){
          ctokens.push({
            ...token,
            balance: res[address]
          })
        }
      })
      this.balances = ctokens.sort((a, b) => b.balance - a.balance)
      let tem = this.balances.filter(t => t.balance > 0)
      const sum = tem.reduce((a, b) => a + b.balance, 0) / 100
      tem = tem.map(t => ({
        name: t.symbol,
        ratio: t.balance / sum
      }))
      if (tem.length === this.chartToken.length){
        for(let i = 0; i < tem.length; i++) {
          const t1 = tem[i]
          const t2 = this.chartToken[i]
          if (t1.name != t2.name || t1.ratio != t2.ratio){
            this.chartToken = tem
            break;
          }
        }
      }else{
        this.chartToken = tem
      }
      this.loadingBalance = false
    })
    interval.start();

    const pollingNpInfo = getNPInfoByPolling()
    const pollingNpBalance = updateBalanceByPolling()
    this.$once('hook:beforeDestroy', () => {
        pollingNpBalance.stop();
        pollingNpInfo.stop();
        interval.stop();
    });
  },
}
</script>

<style scoped lang="scss">
.profile-page {
  overflow: hidden;
  height: 100%;
}
.user-info-box {
  justify-content: space-between;
  align-items: center;
  .user-asset-info-box {
    width: 600px;
    display: flex;
  }
  .asset-tabs {
    display: flex;
    flex-direction: column;
    .tab {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      background-color: #181819;
      border-radius: .8rem 0 0 .8rem;
      font-weight: bold;
      &.active {
        background-color: var(--card-bg-primary);
        color: var(--primary-custom);
      }
    }
  }
}
.user-avatar {
  width: 6rem;
  height: 6rem;
  &:hover {
    box-shadow: 0 0 8px 2px var(--primary-custom);
  }
}
.name-input {
  width: 8rem;
  border-color: transparent;
  border-radius: .8rem;
  background-color: var(--nav-tab-bg);
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
  border-radius: 0 .8rem .8rem 0;
  height: 200px;
  display: flex;
  .chart-box {
    position: relative;
    flex: 1;
  }
  .asset-chart {
    position: absolute;
    width: 100%;
    max-width: 14rem;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
  .user-asset {
    flex-direction: column;
    .primary-btn {
      width: fit-content;
    }
  }
  .value-info {
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 960px) {
  .user-asset-info-box {
    flex-direction: column;
    .asset-tabs {
      flex-direction: row;
      .tab {
        border-radius: .8rem .8rem 0 0;
        height: 40px;
      }
    }
  }
  .asset-card {
    border-radius: 0 0 .8rem .8rem;
  }
}
@media (max-width: 880px) {
  .user-info-box {
    flex-direction: column;
    .user-base-info-box {
      align-items: center;
    }
    .user-asset-info-box {
      margin-top: 1rem;
      width: 100%;
    }
  }
  .asset-card {
    height: fit-content;
  }
}
@media (max-width: 576px) {
  .asset-card {
    //height: 24rem;
    display: flex;
    flex-direction: column;
    .asset-chart {
      position: relative;
      margin: auto;
      top: 0;
      right: 0;
      width: 16rem;
    }
    .value-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .value-info {
      margin-bottom: 0;
    }
  }
}
@media (max-width: 576px) {
  .asset-card .asset-chart {
    transform: translateY(0);
  }
}
</style>
