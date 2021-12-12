<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-10 mx-auto">
        <div class="view-top-header">
          <Step :current-step="1" :step-label="['Deploy community asset', 'Complete info']"></Step>
        </div>
      </div>
      <div class="col-md-7 mx-auto position-relative">
        <div v-show="cardStep===0" class="form-card">
          <div class="text-left">
            <div class="font-bold font20">Chose an asset</div>
            <div class="font16 my-3">If you want to use an exist token</div>
            <div class="custom-form">
              <button class="primary-btn" @click="cardStep=1">Choose Token</button>
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
                  <button class="primary-btn mt-5" @click="registerToken()">Register Token</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="cardStep===1" class="form-card">
          <div class="custom-form">
            <i class="close-icon" @click="cardStep=0"></i>
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
            <div v-if="loading" class="text-center">
              <b-spinner label="Spinning"></b-spinner>
            </div>
            <template v-else>
              <div v-if="searchResult==='error'" class="text-center mt-2">地址输入错误</div>
              <div @click="choseToken()" v-if="provideName && provideSymbol">
                <TokenItem class="my-3"
                           :logo="provideLogo"
                           :token-name="provideName"
                           :token-symbol="provideSymbol"
                           :token-address="provideAddress"/>
              </div>
            </template>
            <div class="mt-4 mb-2 mx-auto divide-line font-bold text-center text-grey-5">OR</div>
            <div class="mb-4 text-center text-grey-5">Choose a token as cToken</div>
            <div style="cursor: pointer" v-for="token of OfficialAssets" :key="token.address"
                 @click="choseToken(token)">
              <TokenItem class="my-3"
                         :logo="token.icon"
                         :token-name="token.name"
                         :token-symbol="token.symbol"
                         :token-address="token.address"/>
            </div>
          </div>
        </div>
        <div v-show="cardStep===2" class="form-card">
          <div class="custom-form">
            <i class="back-icon" @click="goBackTo0()"></i>
            <div class="text-left">
              <div class="font-bold font20">Setting your asset distribution</div>
              <div class="row font16 mt-3 mb-1">
                <div class="col-sm-8">Total distribution by current policy</div>
                <div class="col-sm-4">
                  <div class="b-box">{{ totalSupply }}</div>
                </div>
              </div>
              <div class="row font16">
                <div class="col-sm-8">Current Block height</div>
                <div class="col-md-4">
                  <div class="b-box">{{ blockNum }}</div>
                </div>
              </div>
              <div class="py-4">
                <Progress :progress-data="progressData" @delete="deleteData" :is-edit='true'/>
              </div>
              <div class="custom-form">
                <b-form-group
                  class="mb-4"
                  label-class="overflow-hidden text-grey-7"
                  label-cols-md="3"
                  content-cols-md="9"
                  :label="$t('community.startBlock')"
                >
                  <div class="d-flex c-input-group">
                    <b-form-input
                      class=""
                      type="number"
                      v-model="distributionForm.start"
                      @keyup="startChanged($event)"
                      :disabled="progressData.length>0 || deploying"
                      :placeholder="$t('placeHolder.inputStopBlock')"
                    >
                    </b-form-input>
                    <div class="b-box mx-2 font12 text-nowrap">{{startTime}}</div>
                  </div>
                </b-form-group>
                <b-form-group
                  class="mb-4"
                  label-class="overflow-hidden text-grey-7"
                  label-cols-md="3"
                  content-cols-md="9"
                  :disabled="deploying"
                  :label="$t('community.stopBlock')"
                >
                  <div class="d-flex c-input-group">
                    <b-form-input
                      type="number"
                      v-model="distributionForm.end"
                      @keyup="stopChanged($event)"
                      :placeholder="$t('placeHolder.inputStopBlock')"
                    ></b-form-input>
                    <div class="b-box mx-2 font12 text-nowrap">{{stopTime}}</div>
                  </div>
                </b-form-group>
                <b-form-group
                  class="mb-4"
                  label-class="overflow-hidden text-grey-7"
                  label-cols-md="3"
                  content-cols-md="9"
                  :label="$t('community.mintAmount')"
                >
                  <div class="c-input-group">
                    <b-form-input
                      type="number"
                      v-model="distributionForm.reward"
                      :placeholder="$t('placeHolder.inputMintAmount')"
                    ></b-form-input>
                  </div>
                </b-form-group>
                <div class="col-md-6 offset-md-3 pt-3">
                  <button class="primary-btn"
                          :disabled="!distributionForm.end || !distributionForm.reward || progressData.length>=256 || distributionForm.start >= maxBlock"
                          @click="confirmAdd">{{ $t('operation.add') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="next-btn primary-btn w-auto" :disabled="deploying" v-show="cardStep === 2" @click="confirmDeploy()">
          <b-spinner
              small
              type="grow"
              v-show="deploying"
            ></b-spinner>
          <span class="mr-3">Deploy</span>
          <i class="next-icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { createCommunity, getMyCommunityContract } from '@/utils/web3/community'
import { handleApiErrCode, blockTime } from '@/utils/helper'
import { MaxBlockNum } from '@/constant'
import { OfficialAssets } from '@/config'
import Step from '@/components/common/Step'
import TokenItem from '@/components/community/TokenItem'
import Progress from '@/components/community/Progress'
import { getAddress } from '@/utils/web3/ethers'
import { getERC20Info } from '@/utils/web3/asset'
import { sleep } from '@/utils/helper'
import { ethers } from "ethers";

export default {
  name: 'CreateEconomy',
  components: { Step, TokenItem, Progress },
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
      cToken: {},
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
      cardStep: 0,
      loading: false,
      searchResult: ''
    }
  },
  computed: {
    ...mapState({
      blockNum: state => state.web3.blockNum
    }),
    ...mapState('web3', ['stakingFactoryId']),
    ...mapGetters('web3', ['createState']),
    // total supply of the distribution that user designed
    totalSupply () {
      return this.progressData.reduce((t, p) => t += (parseInt(p.stopHeight) - parseInt(p.startHeight) + 1) * parseFloat(p.amount), 0)
    }
  },
  watch: {
    blockNum  (val, old) {
      if (!old || old === 0) {
        this.distributionForm.start = this.blockNum + 100
        this.startTime = blockTime(0, 100)
      }
    },
    communityInfo (val) {
      if (val && val.name && val.name.length) {
        this.$router.replace('/')
      }
    }
  },
  async mounted () {
    try{
      const id = await getMyCommunityContract()
      if (id) {
        this.$router.replace('set-profile')
        return;
      }
    }catch(e) {
      console.log(5425, e);
    }
    this.distributionForm.start = this.blockNum + 100
    this.startTime = blockTime(0, 100)
  },
  methods: {
    upcaseSymbol() {
      if (!this.form.symbol) return;
      this.form.symbol = this.form.symbol.toUpperCase();
    },
    goBackTo0() {
      if (this.deploying) return;
      this.cardStep = 0;
    },
    async checkTokenAddress () {
      this.provideAddress = getAddress(this.provideAddress);
      console.log(this.provideAddress)
      if (this.provideAddress) {
        try {
          this.loading = true
          this.searchResult = ''
          const tokenInfo = await getERC20Info(this.provideAddress);
          this.provideName = tokenInfo.name;
          this.provideSymbol = tokenInfo.symbol;
          this.provideLogo = tokenInfo.icon;
        }catch (err) {
          handleApiErrCode(err, (tip, param) => {
            this.$bvToast.toast(tip, param)
          })
        } finally {
          this.loading = false
        }
      } else {
        this.searchResult = 'error'
      }
    },
    choseToken (token) {
      if(!token) {
        this.cToken = {
          name: this.provideName,
          symbol: this.provideSymbol,
          icon: this.provideLogo,
          address: this.provideAddress,
          isMintable: false
        }
      }else {
        this.cToken = {...token, isMintable: false}
      }
      this.cardStep = 2;
    },
    registerToken() {
      // check input
      let tipStr
      if (!this.form.name) {
        tipStr = this.$t('tip.needTokenName')
      }else if(!this.form.symbol) {
        tipStr = this.$t('tip.needTokenSymbol')
      }
      if (tipStr){
        this.$bvToast.toast(tipStr, {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }
      this.cToken = {
        name: this.form.name,
        symbol: this.form.symbol,
        supply: this.form.supply,
        totalSupply: ethers.utils.parseUnits(this.form.supply, 18),
        isMintable: true
      }
      this.cardStep = 2;
    },
    deleteData () {
      if (this.deploying) {
        return;
      }
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
        background: `rgba(255, 149, 0, ${(i + 1) * (1.0 / count)})`
      }))
    },
    async confirmDeploy () {
      if (Object.keys(this.cToken).length === 0 || this.progressData.length === 0) {
        this.$bvToast.toast(this.$t('tip.pleaseFillData'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      try {
        this.deploying = true
        const communityInfo = await createCommunity(this.cToken, this.progressData)
        if (communityInfo.cToken && communityInfo.cToken.address) {
          this.$bvToast.toast(this.$t('tip.deployFactorySuccess'), {
            title: this.$t('tip.tips'),
            variant: 'success'
          })
          await sleep(3)
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
  @include card(4rem 10% 2rem);
  height: 40rem;
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
.back-icon {
  @include icon(1.4rem, 1.4rem);
  background-image: url("~@/static/images/back.svg");
  position: absolute;
  top: 1.2rem;
  left: 1.5rem;
}
.b-box {
  border: 1px solid var(--input-border);
  min-width: fit-content;
  padding: .2rem;
  border-radius: .4rem;
  text-align: center;
  background-color: rgba(white, .1);
}
.next-btn {
  position: absolute;
  top: 50%;
  left: 110%;
  display: flex;
  align-items: center;
  .next-icon {
    @include icon(1.2rem, 1.2rem);
    background-image: url("~@/static/images/next.svg");
  }
}
</style>
