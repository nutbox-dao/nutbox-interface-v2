<template>
  <div class="sub-member-page">
    <div class="row">
      <div class="block col-md-8 col-sm-7 px-sm-0">
        <div class="member-card">
          <b-table :fields="fields" :items="memberList"
                   thead-tr-class="asset-tr"
                   tbody-tr-class="asset-tr"
                   details-td-class="p-0"
                   class="text-white border-0" borderless>
            <template #table-colgroup="scope">
              <col v-for="field in scope.fields" :key="field.key"
                   :style="{ width: field.key === 'avatar' ? '3rem' : '' }">
            </template>
            <template #cell(avatar)="row">
              <img v-if="row.item.avatar"
                   style="width:3rem;height: 3rem"
                   :src="row.item.avatar" alt="">
              <empty-img v-else width="3rem" height="3rem" class="rounded-circle"></empty-img>
            </template>
          </b-table>
        </div>
      </div>
      <div class="block col-md-4 col-sm-5">
        <div class="user-card d-flex flex-column">
          <div class="text-center mt-3 pb-3">
            <img v-if="user.avatar" class="user-avatar hover rounded-circle"
                 :src="user.avatar" alt="">
            <img v-else class="user-avatar hover rounded-circle"
                 src="~@/static/images/home-s2-icon1.svg" alt="">
            <div class="my-1">{{user.name}}</div>
            <div class="mb-3">{{user.address}}</div>
            <div class="d-flex text-center font12" style="gap: 1rem">
              <div class="s-card">
                <div>Join Date</div>
                <div>2021/12/14</div>
              </div>
              <div class="s-card">
                <div>PNUT</div>
                <div>1000</div>
              </div>
            </div>
          </div>
          <div class="flex-fill overflow-auto">
            <div class="mt-2">Activities</div>
            <transition-group name="list-complete">
              <ActivityItem class="mt-3 list-complete-item"
                            v-for="i of activitiesList" :key="i"/>
            </transition-group>
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
        { key: 'nickname', label: 'Nickname' },
        { key: 'date', label: 'Date', class: 'text-center' },
        { key: 'value', label: 'Value', class: 'text-right' }
      ],
      memberList: [
        { avatar: '', nickname: 'user name1', date: '2021/12/141', value: 1000 },
        { avatar: '', nickname: 'user name2', date: '2021/12/142', value: 1000 },
        { avatar: '', nickname: 'user name3', date: '2021/12/143', value: 1000 },
        { avatar: '', nickname: 'user name4', date: '2021/12/14', value: 1000 },
        { avatar: '', nickname: 'user name5', date: '2021/12/14', value: 1000 },
        { avatar: '', nickname: 'user name6', date: '2021/12/14', value: 1000 },
        { avatar: '', nickname: 'user name7', date: '2021/12/14', value: 1000 },
        { avatar: '', nickname: 'user name8', date: '2021/12/14', value: 1000 }
      ],
      user: {
        avatar: '',
        name: 'user name',
        address: '0xxxxxxxxxxxx'
      },
      activitiesList: []
    }
  },
  computed: {
    ...mapState('currentCommunity', ['communityInfo', 'allUsers'])
  },
  watch: {
    allUsers(newValue, oldValue) {
        try{
          this.balanceWatcher.restart()
        }catch(e) {}
    }
  },
  async mounted () {
      this.balanceWatcher = await watchMemberBalance();


  },

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
    overflow: auto;
  }
  .s-card {
    @include card(.6rem, var(--block-bg));
  }
}
@media (max-width: 577px) {
  .sub-member-page {
    overflow: auto;
    .row, .block {
      height: auto;
    }
    .member-card, .user-card {
      height: fit-content;
      margin-bottom: 1rem;
    }
  }
}
</style>
