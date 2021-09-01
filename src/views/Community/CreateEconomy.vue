<template>
  <div class="page-view-content">
    <Step :current-step="1"></Step>
    <div class="view-top-header mb-4">
      <div class="page-back-text-icon page-view-title" @click="$router.back()">
        {{ $t('community.createCommunity') }}
      </div>
    </div>
    <div class="mt-3">
      <div class="form">
        <div class="primary-line-title font-bold font20">
          {{ $t('community.yourCTokenId') }}
        </div>
        <div class="form-card custom-form step-1">
          <Dropdown :menu-options="concatAddressOptions"
                    :loading="assetLoading"
                    :selected-key="selectedKey"
                    :selected-item="selectedAddressData"
                    @setSelectedData="setSelectedData">
            <template v-slot:empty0>
              <div class="text-center">
                <div class="custom-control" style="line-height: 1.5rem">
                  {{ $t('asset.notRegister') }}
                  <router-link to="/community/register-ctoken">{{ $t('asset.registerOne') }}</router-link>
                </div>
              </div>
            </template>
            <template v-slot:drop-item="slotProps">
              <img class="prefix-icon" :src="slotProps.item.icon" alt="">
              <div class="flex-full d-flex flex-column">
                <span>{{slotProps.item.symbol}}</span>
                <span class="font12 text-grey-light">{{slotProps.item.asset | formatUserAddress}}</span>
              </div>
            </template>
          </Dropdown>
<!--          <b-input class="" placeholder="Please enter" v-model="form.contractAddr"></b-input>-->
          <div id="mint-checkbox" class="mt-3 font12 flex-between-center">
            <div class="text-grey">
              <!-- <div v-show="isMint">* This is a mintable token</div>
              <div v-show="!isMint">* This is not a mintable token</div> -->
            </div>
            <div class="" style="line-height: 1.5rem">
              {{ $t('asset.notRegister') }}
              <router-link class="text-primary"
                           to="/community/register-ctoken">{{ $t('asset.registerOne') }}</router-link>
            </div>
          </div>
        </div>
        <div class="primary-line-title font-bold font20">
          {{ $t('community.settingTokenDistribution') }}
        </div>
        <div class="form-card custom-form step-2">
          <div class="flex-between-center">
            <span>{{ $t('community.tokenEra') }}</span>
<!--            <button class="add-pool-btn" @click="$router.push('/community/add-pool')">-->
<!--              <i class="add-icon"></i>-->
<!--              <span>Add Pool</span>-->
<!--            </button>-->
          </div>
          <p style="margin:0;">
            {{ $t('community.currentBlock') }} {{blockNum}}
          </p>
          <Progress :is-edit="progressData.length>0"
                    @delete="deleteData"
                    :progress-data="progressData"></Progress>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold px-3">{{ $t('community.startBlock') }}</span>
            <b-input @keyup="startChange($event)" type="number" placeholder="输入起始区块高度" :disabled="progressData.length>0"
                     v-model="poolForm.start"></b-input>
          </div>
          <span class="block-tip">
            {{ startTime }}
          </span>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold px-3">{{ $t('community.stopBlock') }}</span>
            <b-input-group class="d-flex flex-between-center">
              <b-input class="flex-full" @keyup="stopChange($event)" type="number" :placeholder="$t('community.inputStopBlock')" v-model="poolForm.end"></b-input>
              <span @click="max" class="append-input-btn">{{ $t('commen.max') }}</span>
            </b-input-group>
          </div>
          <span class="block-tip">
            {{ stopTime }}
          </span>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold px-3">{{ $t('community.rewardAmount') }}</span>
            <b-input :placeholder="$t('community.inputBlockReward')" v-model="poolForm.reward"></b-input>
          </div>
          <button class="primary-btn" :disabled="!poolForm.end || !poolForm.reward || progressData.length>=6 || poolForm.start >= maxBlock"
                  @click="confirmAdd">{{ $t('community.comfirmAdd') }}</button>
          <span v-show="progressData.length>=6" class="block-tip">
            {{ $t('community.distributionLimit') }}
          </span>
        </div>
        <button class="primary-btn" :disabled="progressData.length===0 || deploying" @click="confirmDeploy">
          <b-spinner small type="grow" v-show="deploying" />
          {{ $t('asset.deploy') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from '@/components/Community/Progress'
import Dropdown from '@/components/ToolsComponents/Dropdown'
import { mapState, mapGetters } from 'vuex'
import { getRegitryAssets, isMintableAsset } from '@/utils/web3/asset'
import { createStakingFeast } from '@/utils/web3/community'
import { handleApiErrCode, blockTime } from '../../utils/helper'
import { MaxBlockNum, MAX_DISTRIBUTION_COUNT } from '@/constant'
import { OfficialAssets } from '@/config'
import Step from "@/components/ToolsComponents/Step";

export default {
  name: 'CreateEconomy',
  components: { Progress, Dropdown, Step },
  data () {
    return {
      selectedKey: 'name',
      selectedAddressData: {},
      assets: null,
      deploying: false,
      maxBlock: MaxBlockNum,
      isMint: false,
      startTime: '',
      stopTime: '',
      concatAddressOptions: [
        {
          categoryName: 'personal',
          items: []
        },
        {
          categoryName: 'official',
          items: OfficialAssets
        }
      ],
      assetLoading: true,
      progressData: [],
      form: {
        assetId: null,
        isMint: false,
        decimal: null,
        poolData: []
      },
      poolForm: {
        start: '1001',
        end: '',
        reward: ''
      }
    }
  },
  computed: {
    ...mapState({
      userDeployTokens: state => state.web3.allAssetsOfUser,
      blockNum: state => state.web3.blockNum
    }),
    ...mapGetters('web3', ['createState'])
  },
  watch: {
    userDeployTokens (val) {
      this.concatAddressOptions[0].items = val.filter(asset => asset.type === 'HomeChainAssetRegistry')
    }
  },
  async mounted () {
    this.assets = await getRegitryAssets()
    this.poolForm.start = this.blockNum + 100
    this.startTime = blockTime(0, 100)
    console.log({assets: this.assets});
    this.concatAddressOptions[0].items = this.assets.filter(asset => asset.type === 'HomeChainAssetRegistry')
    this.assetLoading = false
  },
  methods: {
    setSelectedData (data) {
      this.selectedAddressData = data
      this.form.assetId = data.asset
      isMintableAsset(data.asset).then(res => {
        this.isMint = res
      })
    },
    deleteData () {
      this.progressData.pop()
      this.updateProgressColor()
      if (this.progressData.length === 0) {
        this.poolForm.start = this.blockNum + 100
      } else {
        this.poolForm.start = this.progressData[this.progressData.length - 1].stopHeight
      }
      this.poolForm.end = ''
      this.stopTime = blockTime(1, 0)
      this.startTime = blockTime(this.blockNum, this.poolForm.start)
    },
    startChange(e){
      const value = e.target.value;
      this.startTime = blockTime(this.blockNum, value)
    },
    stopChange(e){
      const value = e.target.value;
      this.stopTime = blockTime(this.blockNum, value)
    },
    max () {
      this.poolForm.end = this.maxBlock
    },
    confirmAdd () {
      if (parseInt(this.poolForm.start) <= this.blockNum) {
        this.$bvToast.toast(this.$t('tip.wrongStartBlockNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      if (parseInt(this.poolForm.end) <= parseInt(this.poolForm.start)) {
        this.$bvToast.toast(this.$t('tip.wrongStopBlockNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      if (parseInt(this.poolForm.reward) <= 0) {
        this.$bvToast.toast(this.$t('tip.wrongRewardNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      let barData = {
        startHeight: Number(this.poolForm.start),
        stopHeight: Number(this.poolForm.end),
        amount: Number(this.poolForm.reward),
        percentage: Number(this.poolForm.end) - Number(this.poolForm.start)
      }
      this.progressData.push(barData)
      this.updateProgressColor()
      // if (this.progressData.length > 2) return
      this.poolForm.start = Number(barData.stopHeight) + 1
      this.poolForm.end = ''
      this.poolForm.reward = ''
      this.stopTime = blockTime(this.blockNum, 0)
      this.startTime = blockTime(this.blockNum, this.poolForm.start)
    },
    updateProgressColor () {
      const count = this.progressData.length
      this.progressData = this.progressData.map((pd, i) => ({
        ...pd,
        background: `rgba(80, 191, 0, ${(i+1)*(1.0 / count)})`
      }))
    },
    async confirmDeploy () {
      this.form.poolData = this.progressData
      if (!this.form.assetId || this.form.poolData.length === 0) {
        this.$bvToast.toast(this.$t('tip.pleaseFillData'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      try {
        this.deploying = true
        const decimal = this.selectedAddressData.decimal
        this.form.decimal = decimal
        const hash = await createStakingFeast(this.form)
        if (hash) {
          this.$bvToast.toast(this.$t('tip.deployFactorySuccess'), {
            title: this.$t('tip.tips'),
            variant: 'success'
          })
          this.$router.replace('/community/community-info?type=create')
        }
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.deploying = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.form {
  width: 100%;
  max-width: 27rem;
  margin: auto;
  text-align: left;
}
.primary-line-title {
  @include single-color-bg(.2rem 1rem, left .3rem);
  padding-left: 1rem;
}
.form-card {
  @include card(.8rem 1.2rem 1rem, white, unset);
  margin-bottom: 1.2rem;
}
.step-1 {
  #mint-checkbox a {
    color: #408FFF;
  }
  @media (max-width: 960px) {
    #mint-checkbox {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
.step-2 {
  .add-pool-btn {
    border: 1px solid var(--primary-custom);
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.8rem;
    border-radius: 1.8rem;
    .add-icon {
      @include icon(.8rem, .8rem);
      min-width: .8rem;
      margin-right: .2rem;
      background-image: url("~@/static/images/add-icon.svg");
    }
  }
  .c-progress {
    margin-bottom: 2rem;
  }
  .c-input-group {
    margin-bottom: .8rem;
    span {
      white-space: nowrap;
    }
  }
  .block-tip{
    color: red;
    margin-left: .5rem;
    font-size: .8rem;
  }
}

</style>
