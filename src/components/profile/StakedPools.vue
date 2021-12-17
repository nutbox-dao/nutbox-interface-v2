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
    <div class="c-loading my-5"></div>
    <div class="c-card mt-3" v-if="joinedPool.length>0">
      <div v-for="(pool, index) of joinedPool" :key="index" v-show="getCommunityInfoById(pool.community.id)">
        <div class="c-header-grid py-3 px-4">
          <div class="d-flex align-items-center" style="grid-area: avatar">
            <div class="logo-group mr-3">
              <img class="logo1" src="https://cdn.wherein.mobi/nutbox/v2/1635409783017" alt="">
              <img class="logo2" src="https://cdn.wherein.mobi/nutbox/v2/1633769085901" alt="">
            </div>
            <div class="h-100 d-flex flex-column justify-content-between">
              <div class="font-bold">Pool Name</div>
              <div class="font14 ">Stake Nut Earn Moon</div>
            </div>
          </div>
          <div class="value-box d-flex" style="grid-area: value">
            <div class="item h-100 d-flex justify-content-between text-center">
              <div class="font14 ">Moons Earned</div>
              <div class="font-bold">123.0000</div>
            </div>
            <div class="item h-100 d-flex justify-content-between text-center">
              <div class="font14 ">APR</div>
              <div class="font-bold">90.12%</div>
            </div>
            <div class="item h-100 d-flex justify-content-between text-center">
              <div class="font14 ">Total Staking</div>
              <div class="font-bold">12323420</div>
            </div>
            <div class="item h-100 d-flex justify-content-between text-center">
              <div class="font14 ">TVL</div>
              <div class="font-bold">$23413</div>
            </div>
          </div>
          <div class="d-flex px-3 justify-content-between align-items-center action-box" style="grid-area: action">
            <span class="text-primary-0" :class="poolStatus">{{poolStatus}}</span>
            <div v-b-toggle="'accordion'+index" class="toggle-btn text-primary-0 font14">
              <span class="when-open">Hide</span>
              <span class="when-closed">Detail</span>
            </div>
          </div>
        </div>
        <b-collapse :id="'accordion'+index" visible>
          <div class="collapse-content-grid font16 py-3 px-4">
            <div class="link-box text-primary-0" style="grid-area: link">
              <div class="link-icon">PNUT Community</div>
              <div class="link-icon">
                <span>Nut Contract</span>
                <i class="copy-icon ml-2"></i>
              </div>
              <div class="link-icon">
                <span>Nut Contract</span>
                <i class="copy-icon ml-2"></i>
              </div>
            </div>
            <div class="content-box d-flex align-items-center justify-content-between p-2"
                 style="grid-area: card1">
              <div>
                <div class="font-bold">Moons Earned</div>
                <div class="font12">123.0000</div>
              </div>
              <button class="primary-btn w-auto px-2 mx-0">Harvest</button>
            </div>
            <div class="content-box d-flex align-items-center justify-content-between p-2"
                 style="grid-area: card2">
              <div>
                <div class="font-bold">Moons Earned</div>
                <div class="font12">123.0000</div>
              </div>
              <div class="content-btn-group d-flex">
                <button class="symbol-btn w-auto px-2 mx-0">-</button>
                <button class="symbol-btn w-auto px-2 mr-0 ml-2">+</button>
              </div>
            </div>
            <div style="grid-area: type" class="d-flex justify-content-center align-items-center">
              <span class="type-box text-primary-0 px-2">BSC</span>
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { CHAIN_NAME } from '@/config'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'StakedPools',
  data () {
    return {
      activeTab: 0,
      tabOptions: ['All', CHAIN_NAME, 'Polkadot', 'Steem', 'Hive'],
      searchText: '',
      poolStatus: 'active'
    }
  },
  computed: {
    ...mapGetters('community', ['getCommunityInfoById']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('web3', ['userGraphInfo']),
    joinedPool() {
      if (!this.userGraphInfo || !this.userGraphInfo.inPools) return [];
      return this.userGraphInfo.inPools
    }
  }
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
.collapse-content-grid {
  background: var(--block-bg);
  display: grid;
  grid-template-columns: 34% 28% 28% 10%;
  grid-template-areas: 'link card1 card2 type';
  .link-icon {
    padding-right: 1.4rem;
    background-repeat: no-repeat;
    background-size: .8rem .8rem;
    background-image: url("~@/static/images/link-primary-icon.svg");
    background-position: right center;
    width: fit-content;
    display: flex;
    align-items: center;
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
