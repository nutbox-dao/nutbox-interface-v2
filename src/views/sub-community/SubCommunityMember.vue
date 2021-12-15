<template>
  <div class="sub-member-page">
    <div class="row">
      <div class="block col-md-7 col-sm-7 pr-sm-0">
        <div class="member-card">
          <b-table :fields="fields" :items="allUsers"
                   ref="selectableTable"
                   thead-tr-class="asset-tr text-grey-7"
                   tbody-tr-class="asset-tr tr-light"
                   details-td-class="p-0"
                   selectable
                   select-mode="single"
                   no-select-on-click
                   @row-clicked="onSelectUser"
                   class="text-white border-0 font14" borderless>
            <template #table-colgroup="scope">
              <col v-for="field in scope.fields" :key="field.key"
                   :style="{ width: field.key === 'avatar' ? '2rem' : '' }">
            </template>
            <template #cell(address)="row">
              <span>
                {{ getName(row.item.address) }}
              </span>
            </template>
            <template #cell(createdAt)="row">
              <span>
                {{ getDateString(row.item.createdAt) }}
              </span>
            </template>
            <template #cell(avatar)="row">
              <img v-if="row.item.avatar"
                   style="width:2rem;height: 2rem"
                   :src="row.item.avatar" alt="">
              <empty-img v-else width="2rem" height="2rem" class="rounded-circle"></empty-img>
            </template>
          </b-table>
        </div>
      </div>
      <div class="block col-md-5 col-sm-5">
        <div class="user-card d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center">
            <span class="font20 font-bold">001</span>
            <button class="primary-btn w-auto text-black mx-0" style="height: 1.8rem">Creator</button>
          </div>
          <div class="text-center mt-3 pb-3">
            <img v-if="user && user.avatar" class="user-avatar hover rounded-circle"
                 :src="user.avatar" alt="">
            <img v-else class="user-avatar hover rounded-circle"
                 src="~@/static/images/home-s2-icon1.svg" alt="">
            <div class="my-1 font20 font-bold">{{ getName(user.address) }}</div>
            <div class="mb-3 font12 text-grey-7 d-flex align-items-center justify-content-center">
              <span>{{ user ? (user.address.substring(0, 6) + '...' + user.address.substring(user.address.length - 6, user.address.length)) : '--' }}</span>
              <i class="copy-icon ml-2" @click="copy"></i>
            </div>
            <div class="s-card d-flex text-center font12">
              <div class="flex-1 overflow-hidden">
                <div class="font14 text-grey-7">Join Date</div>
                <div class="font24 font-bold mt-2">{{ user ? getDateString(user.createdAt) : '--' }}</div>
              </div>
              <div class="flex-1">
                <div class="font14 text-grey-7">PNUT</div>
                <div class="font24 font-bold mt-2">1000</div>
              </div>
            </div>
          </div>
          <div class="flex-fill overflow-auto">
            <div class="mt-2">{{ user ? user.operationCount : '' }} Activities</div>
            <div v-if="activitiesLoading" class="mt-4 text-center">
              <b-spinner></b-spinner>
            </div>
            <transition-group name="list-complete">
              <ActivityItem class="mt-3 list-complete-item"
                            v-for="i of activitiesList" :key="i"/>
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

export default {
  name: 'SubCommunityMember',
  components: { ActivityItem },
  data () {
    return {
      balanceWatcher: {},
      fields: [
        { key: 'avatar', label: '' },
        { key: 'address', label: 'Nickname' },
        { key: 'createdAt', label: 'Joined At', class: 'text-center' },
        { key: 'value', label: 'Balance', class: 'text-right' }
      ],
      memberList: [
        { avatar: '', name: 'user name1', date: '2021/12/141', value: 1000 },
        { avatar: '', name: 'user name2', date: '2021/12/142', value: 1000 },
        { avatar: '', name: 'user name3', date: '2021/12/143', value: 1000 },
        { avatar: '', name: 'user name4', date: '2021/12/14', value: 1000 },
        { avatar: '', name: 'user name5', date: '2021/12/14', value: 1000 },
        { avatar: '', name: 'user name6', date: '2021/12/14', value: 1000 },
        { avatar: '', name: 'user name7', date: '2021/12/14', value: 1000 },
        { avatar: '', name: 'user name8', date: '2021/12/14', value: 1000 }
      ],
      user: {
        avatar: '',
        name: 'user name',
        address: '0xxxxxxxxxxxx'
      },
      activitiesList: [],
      activitiesLoading: false,
      selectIndex: -1
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityInfo', 'allUsers'])
  },
  watch: {
    allUsers (newValue, oldValue) {
      try {
        this.user = newValue[0]
        this.selectIndex = 0
        this.$refs.selectableTable.selectRow(0)
        this.balanceWatcher.restart()
      } catch (e) {}
    }
  },
  async mounted () {
    this.balanceWatcher = await watchMemberBalance()
    if (this.allUsers && this.allUsers.length > 0){
      this.user = this.allUsers[0]
      this.selectIndex = 0
      this.$refs.selectableTable.selectRow(0)
    }
  },
  methods: {
    onSelectUser (data, index) {
      if (this.activitiesLoading || this.selectIndex === index) return
      this.user = data
      this.selectIndex = index
      this.$refs.selectableTable.selectRow(index)
      this.activitiesLoading = true
      setTimeout(() => {
        this.activitiesLoading = false
      }, 1500)
    },
    getName(address) {
      if (!address) return '--'
      return address.substring(0,6) + '...'
    },
    getDateString(timestamp) {
      try {
        return new Date(parseInt(timestamp) * 1e3).toISOString().replace("T", " ").substring(0, 19)
      }catch(e) {
        return '--'
      }
    },
    copy(){
      console.log(55);
    }
  }

}
</script>

<style scoped lang="scss">
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
  .member-card, .user-card {
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
@media (max-width: 577px) {
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
</style>
