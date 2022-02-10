<template>
  <div class="sub-member-page">
    <div class="row">
      <div class="block col-md-7  pr-sm-0">
        <div class="member-card position-relative">
          <div class="c-loading c-loading-bg c-loading-absolute" v-if="allUsers && allUsers.length == 0"></div>
          <b-table :fields="fields" :items="allUsers"
                    v-else
                   ref="selectableTable"
                   thead-tr-class="asset-tr text-grey-7 px-3"
                   tbody-tr-class="asset-tr tr-light font-bold font14 tr-hover-block-bg"
                   details-td-class="p-0"
                   selectable
                   select-mode="single"
                   no-select-on-click
                   @row-clicked="onSelectUser"
                   class="text-white border-0 font14" borderless>
<!--            <template #table-colgroup="scope">-->
<!--              <col v-for="field in scope.fields" :key="field.key" colspan="2"-->
<!--                   :style="{ width: field.key === 'avatar' ? '40px' : '' }">-->
<!--            </template>-->
            <template #cell(address)="row">
              <div class="d-flex align-items-center">
                <div style="position: relative">
                  <img v-if="getAvatar(row.item.address)"
                       class="avatar rounded-circle"
                       :src="getAvatar(row.item.address)" alt="">
                  <img v-else class="avatar rounded-circle"
                       src="~@/static/images/avatars/default.png" alt="">
                  <img src="~@/static/images/avatars/admin-icon.png" class="admin-tag"
                       v-show="row.item && (row.item.address.toLowerCase() === communityInfo.owner.id)" alt="">
                </div>
                <span class="ml-2" :id="row.item.address">{{ getName(row.item.address) }}</span>
                <b-popover
                  :target="row.item.address"
                  triggers="hover focus"
                  placement="top"
                >
                  {{ row.item.address }}
                </b-popover>
              </div>
            </template>
            <template #cell(createdAt)="row">
              <span>
                {{ getDateString(row.item.createdAt) }}
              </span>
            </template>
            <template #cell(value)="row">
              <span>
                {{ row.item.balance | amountForm(2) }}
              </span>
            </template>
          </b-table>
        </div>
      </div>
      <!-- right part -->
      <div class="block col-md-5 ">
        <div class="user-card d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center">
            <span></span>
            <div class="user-type-tag text-black" v-show="user && (user.address.toLowerCase() === communityInfo.owner.id)">Administor</div>
          </div>
          <div class="text-center mt-3 pb-3">
            <div class="avatar-bg">
              <img v-if="getAvatar(user && user.address)" class="user-avatar rounded-circle" style="height:4.8rem;width:4.8rem"
                   :src="getAvatar(user && user.address)" alt="">
              <img v-else class="user-avatar rounded-circle" style="height:4.8rem;width:4.8rem"
                   src="~@/static/images/avatars/default.png" alt="">
            </div>
            <div class="my-1 font20 font-bold">{{ getName(user ? user.address : null) }}</div>
            <div class="mb-3 font12 text-grey-7 d-flex align-items-center justify-content-center">
              <span>{{ user ? (user.address.substring(0, 6) + '...' + user.address.substring(user.address.length - 6, user.address.length)) : '--' }}</span>
              <i class="copy-icon ml-2" @click="copy"></i>
            </div>
            <div class="s-card d-flex text-center font12">
              <div class="flex-1 overflow-hidden">
                <div class="font14 line-height14 text-grey-7">Join Date</div>
                <div class="font24 line-height24 font-bold mt-4">{{ user ? getDateString(user.createdAt).substring(0, 10) : '--' }}</div>
              </div>
              <div class="flex-1">
                <div class="font14 line-height14 text-grey-7">{{ cToken && cToken.symbol || '&nbsp' }}</div>
                <div class="font24 line-height24 font-bold mt-4">{{ (user ? user.balance : 0) | amountForm(2) }}</div>
              </div>
            </div>
          </div>
          <div class="mt-2 font14 line-height14 text-grey-7 d-flex justify-content-between align-items-center">
              <span>{{ activitiesList ? activitiesList.length : '' }} Activities</span>
          </div>
          <div class="flex-fill overflow-auto">
            <div class="c-loading" v-if="activitiesLoading"></div>
            <transition-group v-show="!activitiesLoading" name="list-complete">
              <ActivityItem class="mt-3 list-complete-item"
                            :operation="active"
                            :showName="false"
                            v-for="(active, i) of activitiesList" :key="active.tx + i"/>
            </transition-group>
            <div v-if="!activitiesLoading && activitiesList.length===0"
                 class="text-grey-5 text-center mt-4">no data</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityItem from '@/components/community/ActivityItem'
import { mapState } from 'vuex'
import { sleep } from '@/utils/helper'
import { watchMemberBalance } from '@/utils/web3/community'
import { ethers } from 'ethers'
import { getNewUserStakingHistory } from '@/utils/graphql/user'

export default {
  name: 'SubCommunityMember',
  components: { ActivityItem },
  data () {
    return {
      balanceWatcher: {},
      fields: [
        // { key: 'avatar', label: 'Nickname' },
        { key: 'address', label: 'Nickname' },
        { key: 'createdAt', label: 'Joined At', class: 'text-center' },
        { key: 'value', label: 'Balance', class: 'text-right' }
      ],
      activitiesList: [],
      activitiesLoading: true,
      selectIndex: 0
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityInfo', 'allUsers', 'communityId', 'cToken']),
    ...mapState('user', ['users']),
    user() {
      if (this.allUsers && this.allUsers.length > 0) {
        return this.allUsers[this.selectIndex]
      }
    }
  },
  async mounted () {
    if (!this.communityId) {
      return;
    }
    while (!this.communityInfo) {
      await sleep(0.3)
    }
    const interval = watchMemberBalance((res) => {
      if (!res) return;
      const allUsers = this.allUsers.map(u => ({
        ...u,
        balance: res[u.address.toLowerCase()] ? res[u.address.toLowerCase()] : 0
      }))
      this.$store.commit('currentCommunity/saveAllUsers', allUsers)
    })
    this.getUserActive().then(res => {
      this.activitiesList = res
    })
    this.selectIndex = 0
    this.$refs.selectableTable.selectRow(0)
    this.$once('hook:beforeDestroy', () => {
      window.clearInterval(interval)
    })
  },
  methods: {
    onSelectUser (data, index) {
      if (this.activitiesLoading || this.selectIndex === index) return
      this.selectIndex = index
      this.$refs.selectableTable.selectRow(index)
      this.getUserActive().then(res => {
        this.activitiesList = res
      })
    },
    getDateString(timestamp) {
      try {
        return new Date(parseInt(timestamp) * 1e3).toISOString().replace("T", " ").substring(0, 19)
      }catch(e) {
        return '--'
      }
    },
    getAvatar(address) {
      if (!address) return null
      if (!this.users) return null
      address = ethers.utils.getAddress(address);
      const u = this.users[address]
      if (u) {
        return u.avatar;
      }
      return null;
    },
    getName(address) {
      if (!address) return '--'
      if (!this.users) return '--'
      address = ethers.utils.getAddress(address)
      const u = this.users[address]
      if (u && u.name) {
        return u.name;
      }
      return address.substring(0,6) + '...'
    },
    async getUserActive() {
      try{
        if (!this.user) return [];
        this.activitiesLoading = true
        const res = await getNewUserStakingHistory(this.user.id, this.communityId)
        return res
      } catch (e){

      } finally {
        this.activitiesLoading = false
      }
    },
    copy(){
      let address = this.user.id
      address = ethers.utils.getAddress(address)
      navigator.clipboard.writeText(address).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: address
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
  }

}
</script>

<style scoped lang="scss">
.avatar{
  width: 40px;
  height: 40px;
}
.admin-tag {
  width: 16px;
  height: 16px;
  position: absolute;
  bottom: 0;
  right: 0;
}
.sub-member-page {
  flex: 1;
  height: 100%;
  overflow: hidden;
  .row{
    height: 100%;
    overflow: hidden;
    padding-bottom: 0.8rem;
  }
  .block {
    height: 100%;
    overflow: hidden;
  }
  .avatar-bg {
    background-image: url("~@/static/images/member-avatar-bg.svg");
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
    img {
      margin: 8px auto;
    }
  }
  .user-type-tag {
    background: var(--sub-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    height: 1.8rem;
    padding: 0 0.8rem;
    border-radius: 0.6rem;
    font-size: .8rem;
    line-height: 24px;
  }
  .member-card {
    @include card(1.2rem 0);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .user-card {
    @include card();
    overflow-x: hidden;
    overflow-y: auto;
  }
  .s-card {
    @include card(.6rem, var(--block-bg), hidden, fit-content);
  }
}
.copy-icon {
  @include icon(1rem, 1rem);
  background-image: url("~@/static/images/copy.svg");
  cursor: pointer
}
@media (min-width: 768px) and (max-width: 1140px) {
  .sub-member-page .s-card {
    flex-direction: column;
  }
}
@media (max-width: 767px) {
  .sub-member-page {
    overflow: auto;
    .row, .block {
      height: auto;
    }
    .member-card {
      margin-bottom: 1rem;
      max-height: 50vh;
    }
    .user-card {
      height: fit-content;
    }
  }
}
@media (max-width: 500px) {
  .sub-member-page{
    overflow-x: hidden;
  }
  .sub-member-page .member-card {
    overflow-x: scroll;
  }
  .sub-member-page .s-card {
    flex-direction: column;
  }
}
</style>
