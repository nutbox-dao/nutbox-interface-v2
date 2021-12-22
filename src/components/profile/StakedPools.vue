<template>
  <div class="staked-pools">
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
      <!-- <div class="col-md-6">
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
      </div> -->
    </div>
    <div class="c-card mt-3" v-if="joinedPool.length>0">
      <div v-for="(pool, index) of joinedPool" :key="index">
        <UserStakingList v-if="getCommunityInfoById(pool.community.id)" :pool="pool" />
      </div>
    </div>
    <div class="c-loading my-5" v-else></div>
  </div>
</template>

<script>
import { CHAIN_NAME } from '@/config'
import { mapGetters, mapState } from 'vuex'
import { getPoolFactoryAddress, updatePoolsByPolling } from '@/utils/web3/pool'
import UserStakingList from '@/components/community/UserStakingList'
import { sleep } from '@/utils/helper'

export default {
  name: 'StakedPools',
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Steem', 'Hive', 'Inactive'],
      searchText: '',
      poolStatus: 'active',
      isApprove: false
    }
  },
  components: {
    UserStakingList,
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('web3', ['userGraphInfo', 'tokenIcons']),
    joinedPool() {
      switch(this.activeTab) {
        case 4:
          return this.inActivedPools;
        case 0:
          return this.activedPools;
        case 1:
          return this.activedPools.filter(p => p.poolFactory.toLowerCase() === getPoolFactoryAddress('main'))
        case 2:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('steem')) && parseInt(p.chainId) == 1)
        case 3:
          return this.activedPools.filter(p => (p.poolFactory.toLowerCase() === getPoolFactoryAddress('hive')) && parseInt(p.chainId) == 2)
      }
    },
    activedPools() {
      if (!this.userGraphInfo || !this.userGraphInfo.inPools || this.userGraphInfo.inPools.length === 0) return [];
      return this.userGraphInfo.inPools.filter(p => p.status === 'OPENED')
    },
    inActivedPools() {
      if (!this.userGraphInfo || !this.userGraphInfo.inPools || this.userGraphInfo.inPools.length === 0) return [];
      return this.userGraphInfo.inPools.filter(p => p.status === 'CLOSED')
    }
  },
  async mounted () {
    while(true) {
      if (this.userGraphInfo && this.userGraphInfo.inPools) {
        break;
      }
      await sleep(0.3)
    }
    // update pools data
    const [stake, total, reward, approve] = updatePoolsByPolling(this.userGraphInfo.inPools)
    this.$once('hook:beforeDestroy', () => {
        stake.stop();
        total.stop();
        reward.stop();
        approve.stop();
    });
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(0);
}
.c-header-grid {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-areas: 'avatar value action';
  .value-box .item {
    flex-direction: column;
    flex: 1;
  }
  .collapsed > .when-open,
  .not-collapsed > .when-closed {
    display: none;
  }
  .toggle-btn {
    width: 3rem;
    text-align: center;
    span {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    span:after{
      content: '';
      @include icon();
      background-image: url("~@/static/images/arrow-primary-icon.svg");
      margin: 0 .2rem;
    }
    .when-open:after {
      transform: rotate(180deg);
    }
  }
}
.link-icon {
  @include icon(.8rem, .8rem);
  background-image: url("~@/static/images/link-primary-icon.svg");
}
.copy-icon {
  @include icon(1rem, 1rem);
  background-image: url("~@/static/images/copy-primary-icon.svg");
}
.collapse-content-grid {
  background: var(--block-bg);
  display: grid;
  grid-template-columns: 34% 28% 28% 10%;
  grid-template-areas: 'link card1 card2 type';
  .link-icon {
    @include icon(1rem, 1rem);
    background-image: url("~@/static/images/link-primary-icon.svg");
  }
  .copy-icon {
    @include icon(1rem, 1rem);
    background-image: url("~@/static/images/copy-primary-icon.svg");
  }
  .content-box {
    border: 1px solid var(--input-border);
    border-radius: .8rem;
    margin: 0 .2rem;
    .primary-btn {
      height: 2rem;
      border-radius: .4rem;
    }
    .symbol-btn {
      height: 2rem;
      max-height: 2rem;
      width: 2rem;
      min-width: 2rem;
      color: white;
      border-radius: .4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--primary-custom);
      border: none;
      font-size: 1.4rem;
    }
  }
  .type-box {
    border: 1px solid var(--primary-custom);
    border-radius: .4rem;
  }
}

@media (max-width: 768px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      'avatar action'
      'value value';
    .value-box {
      margin-top: .5rem;
    }
    .action-box {
      margin-top: .5rem;
    }
  }
  .collapse-content-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(2, auto);
    grid-template-areas:
      'link type'
      'card1 card2';
  }
}
@media (max-width: 500px) {
  .c-header-grid {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: repeat(3, auto);
    grid-template-areas:
      'avatar'
      'action'
      'value';
    .value-box {
      flex-direction: column;
      .item {
        flex-direction: row;
      }
    }
    .toggle-btn span {
      flex-direction: row;
    }
  }
  .collapse-content-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: repeat(3, auto);
    grid-template-areas:
      'link type'
      'card1 card1'
      'card2 card2';
    .content-box {
      margin: .2rem 0;
    }
  }
}
.logo-group {
  display: flex;
  align-items: flex-end;
  width: 3.8rem;
  margin-right: .4rem;
  .logo1 {
    @include card-icon;
  }
  .logo2 {
    margin-left: -.8rem;
    @include card-icon(1.8rem, 1.8rem);
  }
}
</style>
