<template>
    <div class="scroll-content">
      <div class="view-top-header-sticky">
        <div class="font24 line-height28 font-bold mb-2">{{ $t('router.curation') }}</div>
        <div class="font16 line-height24 font-bold mb-4">
                {{ $t('desc.curation') }}
        </div>
        <div class="row" style="width: 100%">
          <div class="col-md-6 d-flex flex-column justify-content-center">
            <div class="nav-box nav-box-bg mb-3 mb-md-0">
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
            <button class="primary-btn w-auto mx-0 d-flex align-items-center px-3"
                    style="height: 2rem"
                    @click="poolTypeModal=true, createPoolStep=1">
              <i class="add-icon add-icon-white mr-2"></i>
              <span>{{ $t('operation.addPool') }}</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="stakingPools && stakingPools.length===0"
           class="empty-card mb-5 d-flex flex-column justify-content-center">
        <div class="empty-bg">
          <img src="~@/static/images/empty-data.png" alt="" />
          <p>{{ $t('pool.noPools') }}</p>
        </div>
      </div>
      <template v-else>
        <div class="row curation-card-container">
          <div class="col-xl-4 col-md-6 mb-4" v-for="pool of stakingPools" :key="pool.id">
            <ManageCurationCard :pool="pool"/>
          </div>
        </div>
      </template>
      <b-modal
        v-model="poolTypeModal"
        modal-class="custom-modal"
        size="lg"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop>
        <CreateCurationPool v-if="createPoolStep===1"
                        @confirm="selectPoolToken"
                        @close="poolTypeModal=false"/>
        <StakingPoolConfig v-if="createPoolStep===3"
                           type="create"
                           :needIcon="needIcon"
                           :token="selectToken"
                           @back="createPoolStep=1"
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
  import { addPool, updatePoolsRatio, getPoolFactoryAddress, updatePoolDesc } from '@/utils/web3/pool'
  import { handleApiErrCode, sleep } from '@/utils/helper'
  import StakingPoolType from '@/components/community/StakingPoolType'
  import CreateCurationPool from '@/components/community/CreateCurationPool'
  import StakingDelegatePool from '@/components/community/StakingDelegatePool'
  import StakingPoolConfig from '@/components/community/StakingPoolConfig'
  import { mapState } from 'vuex'
  import { ethers } from 'ethers'
  import { errCode } from '@/config'

  export default {
    name: 'CurationPool',
    components: { ManageCurationCard, StakingPoolType, CreateCurationPool, StakingDelegatePool, StakingPoolConfig },
    data () {
      return {
        tabOptions: ['Active', 'Inactive'],
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
        provideDesc: ''
      }
    },
    computed: {
      ...mapState('community', ['communityData']),
      pools() {
        console.log(this.communityData);
        return this.communityData ? this.communityData.pools : []
      },
      activePool() {
        return this.pools.filter(p => p.status === 'OPENED')
      },
      activeCurationPool() {
        console.log(354, this.activePool)
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
      }
    },
    async mounted () {
      this.tabOptions = [
        this.$t('pool.opened'),
        this.$t('pool.closed')
      ]
    },
    methods: {
      selectPoolType (type) {
        this.poolType = type
        this.createPoolStep = 2
      },
      selectPoolToken (form) {
        const { provideDesc, provideAddress } = form;
        if (!ethers.utils.isAddress(provideAddress)) {
          return handleApiErrCode(errCode.WRONG_ETH_ADDRESS, (tip, params) => {
            this.$bvToast.toast(tip, params)
          })
        }
        this.stakeAsset = provideAddress;
        this.provideDesc = provideDesc;
        console.log(44, form, this.stakeAsset, this.provideDesc)
        this.createPoolStep = 3
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
  .wrap-word {
    word-wrap: break-word;
  }
  @media (max-width: 991px) {
    .curation-card-container {
      padding-top: 15px;
    }
  }
  </style>
