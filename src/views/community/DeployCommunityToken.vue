<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-10 mx-auto mt-0 mt-sm-2 mt-md-4">
        <div class="view-top-header">
          <Step :current-step="1" :step-label="['Deploy community asset', 'Complete info']"></Step>
        </div>
      </div>
      <div class="col-md-7 mx-auto position-relative mb-5">
        <!-- select token type -->
        <div v-show="cardStep===0" class="form-card">
          <div class="text-left">
            <div class="font-bold line-height24 font20">Chose an asset</div>
            <div class="font14 line-height14 mt-1 mb-3 text-grey-7">If you want to use an exist token</div>
            <div class="custom-form">
              <button class="primary-btn" @click="cardStep=1">Choose Token</button>
            </div>
          </div>
          <div class="my-4 mx-auto divide-line font14 line-height14 text-center">OR</div>
          <div class="form text-left">
            <div class="font-bold line-height24 font20">Register an asset</div>
            <div class="font14 line-height14 mt-1 mb-3 text-grey-7">If you want to create a new token</div>
            <div class="custom-form">
              <div class="row">
                <div class="col-sm-6">
                  <div class="font14 mb-1 font-bold">Token Name</div>
                  <div class="c-input-group c-input-group-border">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="text"
                               :placeholder="$t('asset.tokenName')"
                               v-model="form.name"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-sm-6 mt-2 mt-sm-0">
                  <div class="font14 mb-1 font-bold">Token Symbol</div>
                  <div class="c-input-group c-input-group-border">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="text" @keyup="upcaseSymbol()"
                               :placeholder="$t('asset.tokenSymbol')" v-model="form.symbol"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12 mt-3">
                  <div class="font14 mb-1 font-bold">Premine amount</div>
                  <div class="c-input-group c-input-group-border">
                    <b-input-group class="d-flex flex-between-center">
                      <b-input class="flex-full" type="number"
                               :placeholder="$t('asset.distributionAmount')" v-model="form.supply"></b-input>
                    </b-input-group>
                  </div>
                </div>
                <div class="col-12 font12 text-grey-7 my-3">*You can premine some tokens to bootup your community,
                  the rest tokens will be minted from the contract block by block.</div>
                <div class="col-12">
                  <button class="primary-btn" @click="registerToken()">Register Token</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- chose custom token -->
        <div v-show="cardStep===1" class="form-card">
          <div class="custom-form mt-4">
            <i class="close-icon" @click="cardStep=0"></i>
            <div class="c-input-group c-input-group-border">
              <b-input-group class="d-flex flex-between-center">
                <b-input class="flex-full"
                         @keyup="checkTokenAddress"
                         :placeholder="$t('asset.tokenAddress')"
                         v-model="provideAddress"></b-input>
              </b-input-group>
              <div class="c-append">
                <i class="search-icon" @click="checkTokenAddress"></i>
              </div>
            </div>
            <div v-if="loading"  class="text-center">
              <div class="c-loading"></div>
            </div>
            <template v-else>
              <div v-if="searchResult==='error'" class="text-center mt-2 font14 text-grey-7">Wrong Address</div>
              <div @click="choseToken()" v-if="provideName && provideSymbol">
                <TokenItem class="my-3"
                           :logo="provideLogo"
                           :token-name="provideName"
                           :token-symbol="provideSymbol"
                           :token-address="provideAddress"/>
              </div>
            </template>
            <div class="my-3 mx-auto divide-line font14 line-height14 text-center">OR</div>
            <div class="font14 line-height14 text-center text-grey-7 mb-3">Choose a token as cToken</div>
            <div v-if="OfficialAssets.length>0" class="token-list-card">
              <div class="list-item" v-for="token of OfficialAssets" :key="token.address"
                   @click="choseToken(token)">
                <TokenItem :logo="token.icon"
                           :token-name="token.name"
                           :token-symbol="token.symbol"
                           :token-address="token.address"/>
              </div>
            </div>
          </div>
          <div class="c-loading c-loading-absolute c-loading-bg" v-show="readingRole"></div>
        </div>
        <!-- deploy community -->
        <div v-show="cardStep===2" class="form-card">
          <div class="custom-form">
            <i class="back-icon" @click="goBackTo0()"></i>
            <div class="text-left mt-4">
              <div class="font-bold font24 line-height24 mb-3">Setting your asset distribution</div>
              <div class="row mb-1 font-bold">
                <div class="col-sm-8 font14 line-height14 d-flex align-items-center">
                  Total distribution by current policy
                </div>
                <div class="col-sm-4">
                  <div class="b-box font20 line-height24 text-right">{{ totalSupply }}</div>
                </div>
              </div>
              <div class="row font-bold">
                <div class="col-sm-8 font14 line-height14 d-flex align-items-center">Current Block height</div>
                <div class="col-md-4">
                  <div class="b-box font20 text-right">{{ blockNum }}</div>
                </div>
              </div>
              <div class="py-4">
                <Progress :progress-data="progressData" @delete="deleteData" :is-edit='true'/>
              </div>
              <div class="custom-form font14">
                <b-form-group
                  class="mb-4"
                  label-class="overflow-hidden text-grey-7 d-flex align-items-center"
                  label-cols-md="3"
                  content-cols-md="9"
                  :label="$t('community.startBlock')"
                >
                  <div class="d-flex c-input-group c-input-group-bg">
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
                  label-class="overflow-hidden text-grey-7 d-flex align-items-center"
                  label-cols-md="3"
                  content-cols-md="9"
                  :disabled="deploying"
                  :label="$t('community.stopBlock')"
                >
                  <div class="d-flex c-input-group c-input-group-bg">
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
                  label-class="overflow-hidden text-grey-7 d-flex align-items-center"
                  label-cols-md="3"
                  content-cols-md="9"
                  :label="$t('community.mintAmount')"
                >
                  <div class="c-input-group c-input-group-bg">
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
        <!-- grant mint role tips -->
        <div v-show="cardStep === 3" class="form-card">
          <div class="mt-4">
            <i class="close-icon" @click="cardStep=0"></i>
            <TokenItem :logo="cToken.icon"
                       :token-name="cToken.name"
                       :token-symbol="cToken.symbol"
                       :token-address="cToken.address"
            />
            <div class="text-grey-bd">
              <p class="font16 font-bold mt-3">
                The token you choose is mintable.
              </p>
              <p>
                For your convenience, you can grant the mint authority to community contract. Then you need not reserve your token into community contract in the future times and times.
              </p>
              <p>
                It should be noted that once you set this option, it cannot be changed in the future.
              </p>
              <p>
                If you don't understand the mechanism, just keep the box unchecked.
              </p>
            </div>
            <b-form-checkbox
              id="checkbox-mint"
              class="font-bold font14"
              v-model="isMintable"
              :value="true"
              :unchecked-value="false"
            >
              Yes, I will grant mint role to community contract later.
            </b-form-checkbox>
            <button class="primary-btn mt-4" @click="cToken.isMintable = isMintable; cardStep = 2">
              {{ $t('operation.confirm') }}
            </button>
          </div>
        </div>
        <!-- grant operation -->
        <div v-show="cardStep === 4" class="form-card-auto text-center">
          <div class="text-center">
            <img style="width: 120px; height: 120px;" src="~@/static/images/celebrate-img.png" alt="">
          </div>
          <p>
            Your community contract is deployed successfully!
          </p>
          <p>
            Please confirm to grant the mint role to the contract.
          </p>
          <p>
            {{ communityInfo && communityInfo.id }}
          </p>
          <button class="primary-btn mb-4" :disabled="grantingRole" @click="grantMintRole">
            <b-spinner
              small
              type="grow"
              v-show="grantingRole"
            ></b-spinner>
            Grant
          </button>
        </div>
        <button class="next-btn primary-btn w-auto" :disabled="loadingApprovement || isApproving" v-show="takeFee && (cardStep === 2 && (loadingApprovement || !approvementCommunityFactory))" @click="approveCommunityFactory()">
          <b-spinner
              small
              type="grow"
              v-show="loadingApprovement || isApproving"
            ></b-spinner>
          Approve
        </button>
        <button class="next-btn primary-btn w-auto" :disabled="deploying" v-show="cardStep === 2 && (!takeFee || approvementCommunityFactory)" @click="takeFee ? showFeeTip = true : confirmDeploy()">
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
    <!-- show fee tip -->
     <b-modal
      v-model="showFeeTip"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form">
        <h3 style="text-align:center">Charge Fee</h3>

        <div class="mb-4 my-3 font20 line-height24 text-center">
            Create community will toke you {{fees['COMMUNITY']}} NUT for fee.
          </div>

        <div class="d-flex justify-content-between" style="gap: 2rem">
          <button class="dark-btn"
            @click="showFeeTip = false">
            {{ $t("operation.cancel") }}
          </button>
          <button
            class="primary-btn"
            @click="confirmDeploy();showFeeTip = false"
          >
            {{ $t("operation.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { createCommunity, getMyCommunityContract, getApprovement, approveUseERC20 } from '@/utils/web3/community'
import { handleApiErrCode, blockTime } from '@/utils/helper'
import { MaxBlockNum } from '@/constant'
import { NutAddress } from '@/config'
import Step from '@/components/common/Step'
import TokenItem from '@/components/community/TokenItem'
import Progress from '@/components/community/Progress'
import { getAddress } from '@/utils/web3/ethers'
import { getERC20Info, hasMintAdmminRole, grantMintRole } from '@/utils/web3/asset'
import { contractAddress } from '@/utils/web3/contract'
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
      loadingApprovement: true,
      approvementCommunityFactory: false,
      isApproving: false,
      grantingRole: false,
      readingRole: false,
      isMintable: false,
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
      cardStep: 0,
      loading: false,
      showFeeTip: false,
      searchResult: ''
    }
  },
  computed: {
    ...mapState({
      blockNum: state => state.web3.blockNum
    }),
    ...mapState('web3', ['stakingFactoryId', 'allTokens', 'fees']),
    ...mapState('community', ['communityInfo']),
    OfficialAssets() {
      if (!this.allTokens) return []
      return this.allTokens.filter(c => c.isRecommend)
    },
    // total supply of the distribution that user designed
    totalSupply () {
      return this.progressData.reduce((t, p) => t += (parseInt(p.stopHeight) - parseInt(p.startHeight) + 1) * parseFloat(p.amount), 0)
    },
    fee() {
      if (this.fees){
        return this.fees['COMMUNITY'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['COMMUNITY'] > 0
      }
      return false
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
     getApprovement(NutAddress, contractAddress['CommunityFactory']).then(res => this.approvementCommunityFactory = res).catch().finally(res => {
        this.loadingApprovement = false
      })
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
      if (!ethers.utils.isAddress(this.provideAddress)) return;
      this.provideAddress = getAddress(this.provideAddress);
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
    async choseToken (token) {
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
      this.readingRole = true
      const res = await hasMintAdmminRole(this.cToken.address)
      this.cToken.isCustom = true;
      this.readingRole = false
      this.isMintable = false
      this.cardStep = res ? 3 : 2;
    },
    registerToken() {
      // check input
      let tipStr
      if (!this.form.name) {
        tipStr = this.$t('tip.needTokenName')
      }else if(!this.form.symbol) {
        tipStr = this.$t('tip.needTokenSymbol')
      }
      const asciiCheck = /^[\x00-\x7F]+$/.test(this.form.name) && /^[\x00-\x7F]+$/.test(this.form.symbol)
      if (!asciiCheck){
        tipStr = this.$t('tip.needAscii')
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
        isMintable: true,
        isCustom: false
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
    async approveCommunityFactory () {
      try{
        this.isApproving = true
        await approveUseERC20(NutAddress, contractAddress['CommunityFactory'])
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.approvementCommunityFactory = true
      }catch(e) {

      }finally{
        this.isApproving = false
      }
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
    async grantMintRole () {
      try {
        this.grantingRole = true
        await grantMintRole(this.cToken.address, this.communityInfo.id)
        this.$router.replace('set-profile')
      } catch(e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.grantingRole = false
      }
    },
    async confirmDeploy () {
      if (Object.keys(this.cToken).length === 0 || this.progressData.length === 0) {
        this.$bvToast.toast(this.$t('tip.pleaseFillData'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return
      }
      if (this.progressData[0].startHeight <= this.blockNum + 2) {
        this.$bvToast.toast(this.$t('tip.startHeightOut'), {
          title: this.$t('tip.tips'),
          variant: 'info'
        })
        return;
      }
      try {
        this.deploying = true
        const communityInfo = await createCommunity(this.cToken, this.progressData)
        if (communityInfo.cToken && communityInfo.cToken.address) {
          this.$bvToast.toast(this.$t('tip.deployCommunitySuccess'), {
            title: this.$t('tip.tips'),
            variant: 'success'
          })
          await sleep(3)
          if (this.cToken.isCustom && this.cToken.isMintable) {
            this.cardStep = 4
            return;
          }
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
  @include card(2rem 10% 2rem, var(--card-bg-primary), auto);
  position: relative;
  min-height: 600px;
}
.form-card-auto {
  @include card(2rem 10% 2rem, var(--card-bg-primary), auto);
  position: relative;
}
.divide-line {
  width: 50%;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(to right, var(--card-broder), var(--card-broder)),
    linear-gradient(to right, var(--card-broder), var(--card-broder));;
  background-size: 30% 1px, 30% 1px;
  background-position: left center, right center;
}
.close-icon {
  @include icon(24px, 24px);
  background-image: url("~@/static/images/close.svg");
  position: absolute;
  top: 20px;
  right: 20px;
}
.back-icon {
  @include icon(24px, 24px);
  background-image: url("~@/static/images/back.svg");
  position: absolute;
  top: 20px;
  left: 20px;
}
.b-box {
  min-width: fit-content;
  padding: .2rem;
  border-radius: .4rem;
  text-align: center;
  font-weight: bolder;
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
.token-list-card {
  @include card(1.2rem 0, var(--input-bg), auto, fit-content);
  max-height: 400px;
  border: 1px solid var(--text-74);
  .list-item {
    cursor: pointer;
    padding: .2rem 1.2rem;
  }
  .list-item:hover {
    background-color: #272828;
  }
}
</style>
