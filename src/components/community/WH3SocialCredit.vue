<template>
  <div class="social-credit-view">
    <div class="row">
      <div class="col-12 col-lg-5">
        <!-- <button class="w-25 primary-btn text-black ml-0"
                :disabled="editConfig"
                @click="editConfig=true">{{$t('operation.edit')}}</button> -->
        <div class="pt-lg-5 pb-5">
          <div class="text-center">
            <div class="c-input-group c-input-group-bg mx-auto c-input-group-border"
                 style="width: 80px">
              <b-form-input class="font14" v-model="creditRatioList[0]"></b-form-input>
              <span class="pr-2 font14">%</span>
            </div>
            <div class="text-grey-9f font14">{{$t('socialView.socialInfluence')}}</div>
          </div>
          <div class="triangle-box w-50 mx-auto position-relative">
            <svg viewBox="0 0 100 87">
              <g stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.308983009">
                <path d="M50,1.00344407 L99.1359517,86.5 L0.864048316,86.5 L50,1.00344407 Z"
                      stroke="#FD9800" fill="#FD9800"></path>
              </g>
            </svg>
            <div class="position-absolute text-center triangle-left">
              <div class="text-grey-9f font14">{{$t('socialView.communityStaking')}}</div>
              <div class="c-input-group c-input-group-bg mx-auto c-input-group-border"
                   style="width: 80px">
                <b-form-input class="font14" v-model="creditRatioList[1]"></b-form-input>
                <span class="pr-2 font14">%</span>
              </div>
            </div>
            <div class="position-absolute text-center triangle-right">
              <div class="text-grey-9f font14">{{$t('socialView.nftHolder')}}</div>
              <div class="c-input-group c-input-group-bg mx-auto c-input-group-border"
                   style="width: 80px">
                <b-form-input class="font14" v-model="creditRatioList[2]"></b-form-input>
                <span class="pr-2 font14">%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 mb-3 font14 text-grey-bd text-center">
          {{$t('socialView.ratioTip')}}
        </div>
      </div>
      <div class="col-12 col-lg-7 d-flex flex-column" style="gap: 15px">
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold row-info">
            <span class="py-1 text-grey-9f">{{$t('socialView.socialInfluence')}} ({{creditRatioList[0]}}%)</span>
          </div>
          <div class="custom-form px-3 py-3  border-top border-dark">
            <b-form-group class="mb-0"
                          label-class="overflow-hidden font14 line-height14 font-bold text-primary-0"
                          label-cols-md="8" content-cols-md="4"
                          label="Twitter Reputation NFT">
              <div class="c-input-group c-input-group-bg">
                <b-form-input disabled :value="100"></b-form-input>
                <span class="c-append">%</span>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold row-info">
            <span class="py-1 text-grey-9f">{{$t('socialView.communityStaking')}} ({{creditRatioList[1]}}%)</span>
          </div>
          <div class="custom-form px-3 py-3 d-flex flex-column border-top border-dark" style="gap: 8px">
            <b-form-group v-for="(sPool, index) of stakingPools" :key="index"
                          class="mb-0"
                          label-class="overflow-hidden font14 line-height14 font-bold text-primary-0"
                          label-cols-md="8" content-cols-md="4"
                          :label="sPool['name']">
              <div class="c-input-group c-input-group-bg c-input-group-border">
                <b-form-input v-model="sPool.ratio"></b-form-input>
                <span class="c-append">%</span>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold d-flex justify-content-between align-items-center">
            <span class="py-1 text-grey-9f">{{$t('socialView.nftHolder')}} ({{creditRatioList[2]}}%)</span>
            <div class="d-flex align-items-center" style="gap: 8px">
              <button class="primary-btn operation-btn mr-0 text-black" @click="addNft">
                <span>{{$t('operation.add')}}</span>
              </button>
            </div>
          </div>
          <div class="custom-form px-3 py-3 d-flex flex-column border-top border-dark" style="gap: 8px">
            <div v-for="(nItem, index) of nftHolders" :key="index"
                 class="row position-relative">
              <div class="col-8">
                <div class="c-input-group c-input-group-bg text-primary-0 c-input-group-border">
                  <b-form-input placeholder="Address"
                                v-model="nItem.address"
                                class="text-primary-0 font-bold"></b-form-input>
                </div>
              </div>
              <div class="col-4">
                <div class="c-input-group c-input-group-bg c-input-group-border">
                  <b-form-input v-model="nItem.ratio"></b-form-input>
                  <span class="c-append">%</span>
                </div>
              </div>
              <button class="sub-btn" @click="subNft(index)">
                <i class="sub-icon-gray"></i>
              </button>
            </div>
          </div>
        </div>
        <button class="w-50 mx-auto mt-3 primary-btn text-black"
                :disabled="loading"
                @click="onCommit">
          {{$t('operation.save')}}
          <b-spinner v-show="loading" class="ml-1" small></b-spinner>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getPoolFactoryAddress } from '@/utils/web3/pool'
import { ethers } from 'ethers'
import { updateCCInfo } from "@/utils/web3/community"
import { sleep } from '@/utils/helper'

export default {
  name: 'WH3SocialCredit',
  props: {
    // this is wh3 community info
    community: {
      type: Object,
      default: {}
    },
  },
  computed: {
    ...mapState('community', ['communityData']),
    ...mapState('web3', ['account']),
    ...mapState('user', ['wh3AccountInfo']),
  },
  data () {
    return {
      creditRatioList: [20, 60, 20],
      stakingPools: [
        { name: 'FERC Staking', ratio: 25 },
        { name: 'MFERC Staking', ratio: 25 },
        { name: 'mferc-eth-staking', ratio: 25 },
        { name: 'tweet pool', ratio: 25 }
      ],
      nftHolders: [
      ],
      policy: {},
      loading: false
    }
  },
  methods: {
    onSaveStakingConfig () {
      this.editStaking = false
    },
    addNft () {
      this.nftHolders.push({ address: '', ratio: 0 })
    },
    subNft (index) {
      this.nftHolders.splice(index, 1)
    },
    async onCommit () {
      // check sum
      if (this.creditRatioList.reduce((s, a) => s + parseFloat(a), 0) !== 100) {
        this.$bvToast.toast('Ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
      }

      if (parseFloat(this.creditRatioList[1]) > 0) {
        if (this.stakingPools.reduce((s, a) => s + parseFloat(a.ratio), 0) !== 100) {
          this.$bvToast.toast('Stakinging pool ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
      }

      if (parseFloat(this.creditRatioList[2]) > 0) {
        if (this.nftHolders.length === 0) {
          this.$bvToast.toast('You must set NFT holders or set the NFT ratio to 0%', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.nftHolders.filter(n => !ethers.utils.isAddress(n.address)).length > 0) {
          this.$bvToast.toast('Some NFT address is wrong, please check', {
            title: this.$t('tip.tips'),
            variant: 'info'
          });
          return;
        }

        if (this.nftHolders.reduce((s, a) => s + parseFloat(a.ratio), 0) !== 100) {
          this.$bvToast.toast('NFT holder ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
      }

      try{
        this.loading = true;
        let newPolicy = {
          did: {
            ratio: parseFloat(this.creditRatioList[0]) / 100
          },
          community: {
            ratio: parseFloat(this.creditRatioList[1]) / 100
          },
          nft: {
            ratio: parseFloat(this.creditRatioList[2]) / 100
          }
        };

        if (parseFloat(this.creditRatioList[1]) > 0) {
          newPolicy.community.policys = this.stakingPools.filter(pool => parseFloat(pool.ratio) > 0)
          .map(pool => ({
            ...pool,
            method: 'getUserStakedAmount(address)(uint256)',
            type: 'stake',
            ratio: parseFloat(pool.ratio) / 100
          }))
        }

        if (parseFloat(this.creditRatioList[2]) > 0) {
          newPolicy.nft.policys = this.nftHolders.map(p => ({
            type: 'nft-hold',
            ratio: parseFloat(p.ratio) / 100,
            method: 'balanceOf(address)(uint256)',
            contract: p.address
          }))
        }

        newPolicy = JSON.stringify(newPolicy);

        await updateCCInfo({communityId: this.community.communityId, ccPolicy: newPolicy})

      } catch (e) {
          console.log('update cc fail:', e)
      } finally {
        this.loading = false;
      }
    }
  },

  async mounted () {
    this.policy = JSON.parse(this.community.CCPolicy);
    this.creditRatioList = [this.policy.did ? this.policy.did.ratio * 100 : 0,
                          this.policy.community ? this.policy.community.ratio * 100 : 0,
                          this.policy.nft ? this.policy.nft.ratio * 100 : 0]

    while(true) {
      if (this.communityData) {
        break;
      }
      await sleep(0.2);
    }
    const stakingPool = this.communityData.pools.filter(p => p.poolFactory.toLowerCase() !==
                getPoolFactoryAddress("curation") && p.status === 'OPENED')
    this.stakingPools = stakingPool.map(pool => {
      const com = this.policy.community;
      return {
        name: pool.name,
        ratio: (com && com.policys) ? com.policys.find(p => p.name === pool.name)?.ratio * 100 : 0,
        contract: ethers.utils.getAddress(pool.id),
        tokenDecimals: 18
      }
    });

    this.nftHolders = (this.policy && this.policy.nft && this.policy.nft.policys > 0) ? this.policy.nft.policys.map(n => ({
      address: n.address,
      ratio: n.ratio * 100
    })) : []
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.social-credit-view {
  padding: 1rem 0;
}
.triangle-box {
  max-width: 200px;
}
.triangle-left {
  left: 0;
  transform: translateX(-50%);
}
.triangle-right {
  right: 0;
  transform: translateX(50%);
}
.setting-info-card {
  background-color: var(--card-bg-primary);
  border-radius: 12px;
}
.operation-btn {
  width: fit-content;
  padding: 0 12px;
  height: 30px;
}
.text-primary-0 input {
  color: var(--primary-custom);
}
.row-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-border {
  border: 1px solid var(--primary-custom);
}
.sub-btn {
  position: absolute;
  right: -0px;
  top: -10px;
  width: 20px;
  height: 20px;
  background-color: var(--background);
  border: 1px solid var(--primary-custom);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sub-icon-gray {
  @include icon(14px, 14px);
  background-image: url("~@/static/images/sub-icon-primary.svg");

}
@media (min-width: 992px) {
  .social-credit-view {
    padding: 0 1rem;
  }
}
</style>
