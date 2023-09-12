<template>
    <div class="scroll-content">
      <div class="view-top-header-sticky">
        <div class="font24 line-height28 font-bold mb-2">{{ $t('router.curation') }}</div>
        <div class="font16 line-height24 font-bold mb-4">
                {{ $t('desc.curation') }}
        </div>
        <div class="row" style="width: 100%">
          <div class="col-md-6 d-flex flex-column justify-content-center">
            <div class="nav-box nav-box-bg mb-3 mb-md-0" v-if="activeCurationPool.length > 0">
              <div class="nav">
                  <span v-for="(item, index) of tabOptions" :key="index"
                        :class="activeTab===index?'active':''"
                        @click="activeTab = index">{{item}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 d-flex align-items-center justify-content-end ">
            <button class="primary-btn primary-btn-outline w-auto mr-2 px-3"
                    style="height: 2rem"
                    v-show="activePool.length > 1 && activeCurationPool.length > 0"
                    @click="configPoolModal=true">
              {{ $t('pool.updatePoolRatios') }}</button>
            <button v-if="wh3State === 1 || wh3State === 2 || wh3State === 3 || wh3State === 4" class="primary-btn w-auto mx-0 d-flex align-items-center px-3"
                    style="height: 2rem"
                    :disable="loadingCommunityInfo"
                    @click="createWh3">
              <i class="add-icon add-icon-white mr-2"></i>
              <span>{{ createBtnName }}</span>
            </button>
          </div>
        </div>
      </div>
      <template v-if="!loadingCommunityInfo && activeCurationPool.length > 0 && wh3Community.communityId">
        <div v-show="activeTab===0">
          <WH3SocialPool :community="wh3Community"></WH3SocialPool>
        </div>
        <WH3SocialCredit :community="wh3Community" v-show="activeTab===1"/>
      </template>
      <div v-else-if="accountMismatch">
        <div class="tip-info-container font16 text-primary-0 text-center mt-5">
          {{ $t('wh3.accountMismatch', {twitterUsername: wh3AccountInfo.twitterUsername, ethAddress: wh3AccountInfo.ethAddress}) }}
        </div>
      </div>
      <div v-else
         class="empty-card mb-5 d-flex flex-column justify-content-center">
      <div class="empty-bg">
        <img src="~@/static/images/empty-data.png" alt="" />
        <p>{{ $t('pool.noPools') }}</p>
      </div>
    </div>

<!--      <template v-else>-->
<!--        <div class="row curation-card-container">-->
<!--          <div class="col-xl-4 col-md-6 mb-4" v-for="pool of stakingPools" :key="pool.id">-->
<!--            <ManageCurationCard :pool="pool"/>-->
<!--          </div>-->
<!--        </div>-->
<!--      </template>-->
      <b-modal v-model="poolTypeModal" modal-class="custom-modal" :size="createPoolStep===1?'md':'lg'"
               centered hide-header hide-footer no-close-on-backdrop>
        <WH3CreatePool v-if="createPoolStep===1"
                        @confirm="depolyedCommunity"
                        @close="poolTypeModal=false"/>
        <StakingPoolConfig v-if="createPoolStep===3"
                           type="create"
                           :needIcon="needIcon"
                           :token="selectToken"
                           name="Social Module"
                           @back="poolTypeModal=false"
                           @close="poolTypeModal=false"
                           :enable-op="!creating"
                           :enable-back="!creating"
                           @create="create"/>
      </b-modal>
      <b-modal
        v-model="configPoolModal"
        modal-class="custom-modal"
        size="lg"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop>
        <StakingPoolConfig :enable-back="false"
                           type="config"
                           :my-pools="[]"
                           :enable-op="!updating"
                           @update='update'
                           @close="configPoolModal=false"/>
      </b-modal>
    </div>
  </template>

  <script>
  import ManageCurationCard from '@/components/community/ManageCurationCard'
  import { addPool, updatePoolsRatio, getPoolFactoryAddress, updatePoolDesc, startPool } from '@/utils/web3/pool'
  import { handleApiErrCode, sleep } from '@/utils/helper'
  import StakingPoolType from '@/components/community/StakingPoolType'
  import CreateCurationPool from '@/components/community/CreateCurationPool'
  import StakingDelegatePool from '@/components/community/StakingDelegatePool'
  import StakingPoolConfig from '@/components/community/StakingPoolConfig'
  import { mapState } from 'vuex'
  import { ethers } from 'ethers'
  import { errCode } from '@/config'
  import { getAccountByAddress, getCommunityByEth } from "@/apis/wh3Api"
  import WH3CreatePool from "@/components/community/WH3CreatePool.vue";
  import WH3SocialPool from "@/components/community/WH3SocialPool.vue";
  import WH3SocialCredit from "@/components/community/WH3SocialCredit.vue";
  import { createWh3Community, getWh3CommunityContract, checkCurationPoolStarted } from '@/utils/web3/community'

  export default {
    name: 'CurationPool',
    components: { ManageCurationCard, StakingPoolType, WH3CreatePool, StakingDelegatePool,
      StakingPoolConfig, WH3SocialPool, WH3SocialCredit },
    data () {
      return {
        tabOptions: ['Curation pool', 'Community credit'],
        activeTab: 0,
        poolTypeModal: false,
        createPoolStep: 1,
        poolType: '',
        configPoolModal: false,
        stakeAsset: '',
        creating: false,
        updating: false,
        needIcon: false,
        selectToken: {},
        accountMismatch: false,
        provideDesc: "点击获取后会转入到虫洞3社区社交模块专用合约地址，地址里面的代币会通过wormhole3平台分发",
        wh3State: 0, // 0: pending 1: not register 2: not create community 3: created community
        wh3Community: {},
        loadingCommunityInfo: true
      }
    },
    computed: {
      ...mapState('community', ['communityData']),
      ...mapState('web3', ['account']),
      ...mapState('user', ['wh3AccountInfo']),
      pools() {
        console.log(this.communityData);
        return this.communityData ? this.communityData.pools : []
      },
      activePool() {
        return this.pools.filter(p => p.status === 'OPENED')
      },
      activeCurationPool() {
        return this.activePool.filter(p => p.poolFactory.toLowerCase() ===
                getPoolFactoryAddress("curation"))
      },
      stakingPools() {
        switch(this.activeTab) {
          case 0:
            return this.activeCurationPool
          case 1:
            return this.pools.filter(p => p.status === 'CLOSED' && p.poolFactory.toLowerCase() ===
                getPoolFactoryAddress("curation"))
        }
      },
      createBtnName() {
        switch (this.wh3State) {
          case 0:
            return this.$t('wh3.registerWh3');
          case 1:
            return this.$t('wh3.registerWh3');
          case 2:
            return this.$t('wh3.createCommunity');
          case 3:
            return this.$t('wh3.createCurationPool');
          case 4:
            return this.$t('wh3.startPool');
          case 5:
            return '';
        }
      }
    },
    watch: {
      wh3AccountInfo(newValue, oldValue) {
        if (newValue?.twitterId) {
          if (newValue.ethAddress.toLowerCase() === this.account.toLowerCase()) {
            this.wh3State = 2;
          }else {
            this.accountMismatch = true;
          }
        }else {
          this.wh3State = 1;
          this.loadingCommunityInfo = false
        }
      },
      wh3State(newValue) {
        if (newValue === 2) {
          this.loadingCommunityInfo = true;
          getCommunityByEth(this.account).then(com => {
            if (com && com.communityId) {
              getWh3CommunityContract(com.communityId).then(res => {
                this.stakeAsset = res.storageAddr
              })
              if (this.activeCurationPool.length > 0) {
                checkCurationPoolStarted(this.activeCurationPool[0].id).then(res => {
                  if (res) {
                    this.wh3State = 5
                  }else {
                    this.wh3State = 4
                  }
                })
              }else {
                this.wh3State = 3
              }
              this.wh3Community = com;
            }
          }).finally(() => {
            this.loadingCommunityInfo = false;
          })
        }
      }
    },
    async mounted () {
      this.tabOptions = [
        this.$t('wh3.curationPool'),
        this.$t('wh3.communityCredit')
      ];

      // this.$store.commit('user/saveShowLogin', true)
      // return;
      // checkout user registered wh3
      getAccountByAddress(this.account).then(res => {
        if (res.code === 3) {
          this.$store.commit('user/saveWh3AccountInfo', res.account)
        }else if(res.code === 0) {
          this.wh3State = 1;
          this.loadingCommunityInfo = false
          return;
        }
      });
    },
    methods: {
      selectPoolType (type) {
        this.poolType = type
        this.createPoolStep = 2
      },
      async depolyedCommunity (form) {
        try {
          const { tag, tags, comm, cid } = form;
          // receiption address
          this.stakeAsset = comm.storageAddr;
          console.log(2)
          // create wormhole3 community
          await createWh3Community(cid, this.wh3AccountInfo.twitterId, tag, tags);

          // create curation pool
          const community = await getCommunityByEth(this.account);

          if (community && community.communityId) {
            this.createPoolStep = 3
            this.wh3Community = community;
          }
        } catch (e) {
          console.log('create wormhole3 fail:', e)
          if (e === 508){
            handleApiErrCode(errCode.USER_NOT_REGISTERED_WH3, (tip, params) => {
              this.$bvToast.toast(tip, params)
            })
          }
          this.poolTypeModal = false;
        }

      },
      async createWh3() {
        if (this.wh3State === 1) {
          // registry
          this.$store.commit('user/saveShowLogin', true)
        }else if(this.wh3State === 2) {
          // create community
          this.poolTypeModal = true
          this.createPoolStep = 1;
        }else if (this.wh3State === 3) {
          // create curation pool
          this.poolTypeModal = true
          this.createPoolStep = 3;
        }else if (this.wh3State === 4) {
          // start pool
          try{
            this.startingPool = true
            await startPool(this.activeCurationPool[0].id);
            this.wh3State = 5;
          } catch (e) {
            handleApiErrCode(errCode.BLOCK_CHAIN_ERR, (tip, params) => {
              this.$bvToast.toast(tip, params)
            })
          } finally {
            this.startingPool = false
          }
        }
        // poolTypeModal=true, createPoolStep=1
      },
      // create new pool
      async create (pool) {
        let form = {
          type: 'curation',
          ratios: pool.map(p => parseFloat(p.ratio)),
          name: pool[pool.length - 1].name,
          asset: this.stakeAsset
        }
        try {
          this.creating  = true
          const newPool = await addPool(form)
          await updatePoolDesc(newPool.id, this.provideDesc);
          newPool.poolIndex = form.ratios.length - 1;
          newPool.description = this.provideDesc
          this.$bvToast.toast(this.$t('tip.createPoolSuccess'), {
            title:this.$t('tip.success'),
            variant: 'success'
          })
          await startPool(newPool.id);
          this.communityData.pools.push(newPool)
          let index = 0
          this.communityData.pools.map(pool => {
            if (pool.status === 'OPENED'){
              pool.ratio = parseFloat(form.ratios[index++]) * 100
            }
          })
          // cache pools
          this.$store.commit('cache/saveMyCreatedPools', this.communityData.pools);
          await sleep(2);
          this.poolTypeModal = false
        }catch (err) {
          console.log('333', err);
          handleApiErrCode(err, (tip, params) => {
            this.$bvToast.toast(tip, params)
          })
        }finally{
          this.creating = false
        }
      },
      // update pool ratios
      async update(ratios) {
        try {
          this.updating  = true
          const res = await updatePoolsRatio(ratios)
          this.$bvToast.toast(this.$t('tip.updatePoolSuccess'), {
            title:this.$t('tip.success'),
            variant: 'success'
          })
          await sleep(2);
          // update pool ratios
          let index = 0
          this.communityData.pools.map(pool => {
            if (pool.status === 'OPENED') {
              pool.ratio = ratios[index++] * 100
            }
          })
          // cache pools
          this.$store.commit('cache/saveMyCreatedPools', this.communityData.pools);
          this.configPoolModal = false
        }catch (err) {
          handleApiErrCode(err, (tip, params) => {
            this.$bvToast.toast(tip, params)
          })
        }finally{
          this.updating = false
        }
      }
    }
  }
  </script>

  <style scoped>
  .view-top-header-sticky {
    background-color: var(--background);
  }
  .wrap-word {
    word-wrap: break-word;
  }
  @media (max-width: 991px) {
    .curation-card-container {
      padding-top: 15px;
    }
  }
  </style>
