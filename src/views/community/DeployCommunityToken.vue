<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-8 mx-auto">
        <div class="view-top-header">
          <Step :current-step="1" :step-label="['Deploy community', 'Complete info']"></Step>
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
                      <b-input class="flex-full" type="text"
                               :placeholder="$t('asset.tokenName')"
                               v-model="form.name"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-sm-6 mt-2 mt-sm-0">
                  <div class="font14 mb-1">Token Symbol</div>
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="text" @keyup="upcaseSymbol()"
                               :placeholder="$t('asset.tokenSymbol')" v-model="form.symbol"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12 mt-2">
                  <div class="font14 mb-1">Premine amount</div>
                  <div class="c-input-group">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="number"
                               :placeholder="$t('asset.distributionAmount')" v-model="form.supply"></b-input>
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
                         :placeholder="$t('asset.tokenAddress')"
                         v-model="provideAddress"></b-input>
              </b-input-group>
              <div class="c-append">
                <i class="search-icon" @click="checkTokenAddress"></i>
              </div>
            </div>
            <div @click="$router.replace('set-profile')" v-if="provideName && provideSymbol">
              <TokenItem class="my-3"
                         :logo="provideLogo"
                         :token-name="provideName"
                         :token-symbol="provideSymbol"
                         :token-address="provideAddress"/>
            </div>
            <div class="mt-5 mb-2 mx-auto divide-line font-bold text-center text-grey-5">OR</div>
            <div class="mb-4 text-center text-grey-5">Choose a token as cToken</div>
            <div style="cursor: pointer" v-for="token of OfficialAssets" :key="token.address" @click="$router.replace('set-profile')">
              <TokenItem class="my-3"
                         :logo="token.icon"
                         :token-name="token.name"
                         :token-symbol="token.symbol"
                         :token-address="token.address"/>
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
import { getAddress } from '@/utils/web3/ethers'
import { getERC20Info } from '@/utils/web3/asset'

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
      provideLogo: null,
      provideName: null,
      provideSymbol: null,
      provideAddress: null,
      progressData: [],
      form: {
        address: null,
        name: null,
        symbol: null,
        supply: null,
        isMintable: false,
        decimal: null,
        distributionData: []
      },
      distributionForm: {
        start: '1001',
        end: '',
        reward: ''
      },
      OfficialAssets: OfficialAssets,
      isChooseToken: false
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
    this.distributionForm.start = this.blockNum + 100
    this.startTime = blockTime(0, 100)
  },
  methods: {
    upcaseSymbol() {
      this.form.symbol = this.form.symbol.toUpperCase();
    },
    async checkTokenAddress () {
      this.provideAddress = getAddress(this.provideAddress);
      if (this.provideAddress) {
        try {
          const tokenInfo = await getERC20Info(this.provideAddress);
          console.log(4, tokenInfo);
          this.provideName = tokenInfo.name;
          this.provideSymbol = tokenInfo.symbol;
          this.provideLogo = tokenInfo.icon;
        }catch (err) {
          handleApiErrCode(err, (tip, param) => {
            this.$bvToast.toast(tip, param)
          })
        }
      }
    },
    deleteData () {
      this.progressData.pop()
      this.updateProgressColor()
      if (this.progressData.length === 0) {
        this.distributionForm.start = this.blockNum + 100
      } else {
        this.distributionForm.start = this.progressData[this.progressData.length - 1].stopHeight
      }
      this.distributionForm.end = ''
      this.stopTime = blockTime(1, 0)
      this.startTime = blockTime(this.blockNum, this.distributionForm.start)
    },
    startChanged (e) {
      const value = e.target.value
      this.startTime = blockTime(this.blockNum, value)
    },
    stopChanged (e) {
      const value = e.target.value
      this.stopTime = blockTime(this.blockNum, value)
    },
    max () {
      this.distributionForm.end = this.maxBlock
    },
    confirmAdd () {
      if (parseInt(this.distributionForm.start) <= this.blockNum) {
        this.$bvToast.toast(this.$t('tip.wrongStartBlockNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      if (parseInt(this.distributionForm.end) <= parseInt(this.distributionForm.start)) {
        this.$bvToast.toast(this.$t('tip.wrongStopBlockNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      if (parseFloat(this.distributionForm.reward) <= 0) {
        console.log(this.distributionForm.reward)
        this.$bvToast.toast(this.$t('tip.wrongRewardNum'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      const barData = {
        startHeight: Number(this.distributionForm.start),
        stopHeight: Number(this.distributionForm.end),
        amount: Number(this.distributionForm.reward),
        percentage: Number(this.distributionForm.end) - Number(this.distributionForm.start)
      }
      this.progressData.push(barData)
      this.updateProgressColor()
      // if (this.progressData.length > 2) return
      this.distributionForm.start = Number(barData.stopHeight) + 1
      this.distributionForm.end = ''
      this.distributionForm.reward = ''
      this.stopTime = blockTime(this.blockNum, 0)
      this.startTime = blockTime(this.blockNum, this.distributionForm.start)
    },
    updateProgressColor () {
      const count = this.progressData.length
      this.progressData = this.progressData.map((pd, i) => ({
        ...pd,
        background: `rgba(80, 191, 0, ${(i + 1) * (1.0 / count)})`
      }))
    },
    async confirmDeploy () {
      this.form.distributionData = this.progressData
      if (!this.form.assetId || this.form.distributionData.length === 0) {
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
          this.$router.replace('set-profile')
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
