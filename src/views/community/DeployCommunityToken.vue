<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-8 mx-auto">
        <div class="view-top-header">
          <Step :current-step="1" :step-label="['Deploy community', 'setupProfile']"></Step>
        </div>
        <div v-show="!isChooseToken" class="form-card">
          <div class="form text-left">
            <div class="font-bold font20">Chose an asset</div>
            <div class="font16 my-3">If you want to use an exist token</div>
            <div class="custom-form">
              <button class="primary-btn" @click="isChooseToken=true">Choose Token</button>
            </div>
          </div>
          <div class="my-5 mx-auto divide-line font-bold text-center">OR</div>
          <div class="form text-left">
            <div class="font-bold font20">Register an asset</div>
            <div class="font16 my-3">If you want to create a new token</div>
            <div class="custom-form">
              <div class="row">
                <div class="col-sm-6">
                  <div class="font14 mb-1">Token Name</div>
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="number"
                               :placeholder="$t('asset.tokenName')"
                               v-model="poolForm.end"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-sm-6 mt-2 mt-sm-0">
                  <div class="font14 mb-1">Token Symbol</div>
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="number"
                               :placeholder="$t('asset.tokenSymbol')" v-model="poolForm.end"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12 mt-2">
                  <div class="font14 mb-1">Premine amount</div>
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="number"
                               :placeholder="$t('asset.distributionAmount')" v-model="poolForm.end"></b-input>
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
        <div v-show="isChooseToken" class="form-card">
          <div class="custom-form">
            <i class="close-icon" @click="isChooseToken=false"></i>
            <div class="c-input-group">
              <b-input-group class="d-flex flex-between-center">
                <b-input class="flex-full"
                         :placeholder="$t('asset.tokenName')"
                         v-model="poolForm.end"></b-input>
              </b-input-group>
              <div class="c-append">
                <i class="search-icon"></i>
              </div>
            </div>
            <div @click="$router.push('set-profile')">
              <TokenItem class="my-3"
                         logo="https://cdn.wherein.mobi/nutbox/v2/1634804654420"
                         token-name="Peanut"
                         token-symbol="PNUT"
                         token-address="0x1111111111111111111111111"/>
            </div>
            <div class="mt-5 mb-2 mx-auto divide-line font-bold text-center text-grey-5">OR</div>
            <div class="mb-4 text-center text-grey-5">Choose a token as cToken</div>
            <div v-for="i of 4" :key="i" @click="$router.push('set-profile')">
              <TokenItem class="my-3"
                         logo="https://cdn.wherein.mobi/nutbox/v2/1634804654420"
                         token-name="Peanut"
                         token-symbol="PNUT"
                         token-address="0x1111111111111111111111111"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getRegitryAssets, isMintableAsset } from '@/utils/web3/asset'
import { createStakingFeast } from '@/utils/web3/community'
import { handleApiErrCode, blockTime } from '@/utils/helper'
import { MaxBlockNum } from '@/constant'
import { OfficialAssets } from '@/config'
import Step from '@/components/common/Step'
import TokenItem from '@/components/community/TokenItem'

export default {
  name: 'CreateEconomy',
  components: { Step, TokenItem },
  data () {
    return {
      selectedKey: 'name',
      selectedAddressData: {},
      deploying: false,
      maxBlock: MaxBlockNum,
      startTime: '',
      stopTime: '',
      progressData: [],
      form: {
        address: null,
        isMint: false,
        decimal: null,
        poolData: []
      },
      poolForm: {
        start: '1001',
        end: '',
        reward: ''
      },
      isChooseToken: true
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
    this.poolForm.start = this.blockNum + 100
    this.startTime = blockTime(0, 100)
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
  @include card(4rem 15% 2rem);
  margin-bottom: 1.2rem;
  min-height: 30rem;
  position: relative;
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
.close-icon {
  @include icon(1.4rem, 1.4rem);
  background-image: url("~@/static/images/close.svg");
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
}
</style>
