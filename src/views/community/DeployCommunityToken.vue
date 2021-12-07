<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-8 mx-auto">
        <div class="view-top-header">
          <Step :current-step="1" :step-label="['deployToken', 'setupProfile']"></Step>
        </div>
        <div class="form-card">
          <div class="form text-left">
            <div class="font-bold font20">Choose an asset</div>
            <div class="font16 my-3">If you want to use deployed token</div>
            <div class="custom-form">
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
            </div>
          </div>
          <div class="my-5 mx-auto divide-line font-bold">OR</div>
          <div class="form text-left">
            <div class="font-bold font20">Register an asset</div>
            <div class="font16 my-3">If you want to create a new token</div>
            <div class="custom-form">
              <div class="row">
                <div class="col-sm-6">
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" @keyup="stopChange($event)" type="number"
                               :placeholder="$t('community.inputStopBlock')" v-model="poolForm.end"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-sm-6 mt-2 mt-sm-0">
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" @keyup="stopChange($event)" type="number"
                               :placeholder="$t('community.inputStopBlock')" v-model="poolForm.end"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12 mt-2">
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" @keyup="stopChange($event)" type="number"
                               :placeholder="$t('community.inputStopBlock')" v-model="poolForm.end"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12">
                  <button class="primary-btn mt-5">Register Token</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/common/Dropdown'
import { mapState, mapGetters } from 'vuex'
import { getRegitryAssets, isMintableAsset } from '@/utils/web3/asset'
import { createStakingFeast } from '@/utils/web3/community'
import { handleApiErrCode, blockTime } from '@/utils/helper'
import { MaxBlockNum, MAX_DISTRIBUTION_COUNT } from '@/constant'
import { OfficialAssets } from '@/config'
import Step from '@/components/common/Step'

export default {
  name: 'CreateEconomy',
  components: { Dropdown, Step },
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
    ...mapGetters('web3', ['createState']),
    // total supply of the distribution that user designed
    totalSupply () {
      return this.progressData.reduce((t, p) => t += (parseInt(p.stopHeight) - parseInt(p.startHeight) + 1) * parseFloat(p.amount), 0)
    }
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
    console.log({ assets: this.assets })
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
    startChange (e) {
      const value = e.target.value
      this.startTime = blockTime(this.blockNum, value)
    },
    stopChange (e) {
      const value = e.target.value
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
      if (parseFloat(this.poolForm.reward) <= 0) {
        console.log(this.poolForm.reward)
        this.$bvToast.toast(this.$t('tip.wrongRewardNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      const barData = {
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
        background: `rgba(80, 191, 0, ${(i + 1) * (1.0 / count)})`
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
.form-card {
  @include card(2rem 15%);
  margin-bottom: 1.2rem;
}
.divide-line {
  width: 50%;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(to right, var(--card-broder), var(--card-broder)),
    linear-gradient(to right, var(--card-broder), var(--card-broder));;
  background-size: 30% 2px, 30% 2px;
  background-position: left center, right center;
}
</style>
