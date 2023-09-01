<template>
  <div class="social-pool-view">
    <div class="info-container font14">
      <div class="row align-items-center">
        <div class="col-12 col-xl-4">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.contractAddress')}}</div>
            <div class="d-flex align-items-center">
              <span>{{ storageContract }}</span>
              <!-- <i class="copy-icon copy-icon-gray ml-2"></i> -->
            </div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.distributeBalance')}}</div>
            <div class="font-bold">{{ formatAmount(retainedReward) }} ${{ community.rewardTokenSymbol }}</div>
          </div>
        </div>
        <div class="col-12 col-xl-1 d-flex justify-content-center align-items-center"><div class="v-line"></div></div>
        <div class="col-12 col-xl-4">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#{{ community ? community.displayTag : '' }}</div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.communityCategoryTags')}}</div>
            <div class="ml-4 d-flex flex-wrap align-items-center">
              <span v-for="tag of tags" :key="tag" class="ml-2 font-bold">#{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="col-xl-1 d-flex justify-content-center align-items-center"><div class="v-line"></div></div>
        <div class="col-12 col-xl-2 mt-2 mt-xl-0">
          <button v-if="poolPercentage.length === 3" class="primary-btn text-black"
                  @click="ratioModalVisible=true">
            {{$t('socialView.editPoolRatio')}}
          </button>
        </div>
      </div>
    </div>
    <div class="box-info-container">
      <div class="info-card">
        <div class="border-bottom border-dark px-3 py-2 font16 font-bold row-info">
          <span class="py-1">{{$t('socialView.communityContent')}}</span>
          <span class="text-primary-0">{{ poolPercentage[0] }}%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#{{ community ? community.displayTag : '' }}</div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">curator: 100%</div>
            </div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.settleTime')}}</div>
            <div class="font-bold">{{$t('socialView.tweetSettleTime')}}</div>
          </div>
          <div class="row-info py-1 mt-2 text-primary-0">
            所有人发推带上链标签，即可参加
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="border-bottom border-dark px-3 py-2 font16 font-bold row-info">
          <span class="py-1">{{$t('socialView.curation')}}</span>
          <span class="text-primary-0">{{ poolPercentage[1] }}%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#{{ community ? community.displayTag : '' }} #ann</div>
          </div>
          <div class="d-flex justify-content-between py-1">
            <div class="info-key">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">creator: 30%</div>
              <div class="reward-item">curator: 70%</div>
            </div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.settleTime')}}</div>
            <div class="font-bold">{{$t('socialView.curationSettleTime')}}</div>
          </div>
          <div class="row-info py-1 mt-2 text-primary-0">
            仅 Twitter 官方能发布公告推，且必须带上链标签
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="border-bottom border-dark px-3 py-2 font16 font-bold row-info">
          <span class="py-1">Space</span>
          <span class="text-primary-0">{{ poolPercentage[2] }}%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#{{ community ? community.displayTag : '' }}</div>
          </div>
          <div class="d-flex justify-content-between py-1">
            <div class="info-key text-break">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">host: 25%</div>
              <div class="reward-item">co-host: 25%</div>
              <div class="reward-item">speaker: 25%</div>
              <div class="reward-item">curator: 25%</div>
            </div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.settleTime')}}</div>
            <div class="font-bold">{{$t('socialView.spaceSettleTime')}}</div>
          </div>
          <div class="row-info py-1 mt-2 text-primary-0">
            Space 主持人发推带上链标签 + Space 链接，即可开启
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="ratioModalVisible" modal-class="custom-modal"
             centered hide-header hide-footer no-close-on-backdrop>
      <WH3PoolRatioModal
          :poolPercentage="poolPercentage"
           @confirm="updatePoolRatio" @close="ratioModalVisible=false"/>
    </b-modal>
  </div>
</template>

<script>
import WH3PoolRatioModal from '@/components/community/WH3PoolRatioModal.vue'
import { mapState } from 'vuex';
import { getERC20Balance } from '@/utils/web3/asset'
import {
  getMyCommunityInfo,
  getWh3CommunityContract,
  getCommunityRewardPerBlock,
  updateRewardInfo
   } from '@/utils/web3/community'
import { formatAmount, handleApiErrCode } from '../../utils/helper';
import { getPoolFactoryAddress } from '@/utils/web3/pool'
import { ethers } from 'ethers';
import { DAY_BLOCKS } from '@/constant'

export default {
  name: 'WH3SocialPool',
  components: { WH3PoolRatioModal },
  props: {
    // this is wh3 community info
    community: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapState('community', ['communityData']),
    ...mapState('web3', ['account']),
    ...mapState('user', ['wh3AccountInfo']),
    tags() {
      if (this.community && this.community.tags) {
        return this.community.tags.split(',')
      }
    }
  },
  data () {
    return {
      ratioModalVisible: false,
      cToken: {},
      storageContract: '',
      retainedReward: '',
      poolPercentage: [],
      totalRewardPerDay: 0,
    }
  },
  methods: {
    formatAmount,
    async updatePoolRatio(ratios) {
      try{
        // update rewards
        let rewardsInfo = {
          rewardPerDay: (this.totalRewardPerDay.mul(ethers.BigNumber.from(parseInt(ratios[0] * 10000))).div(1000000)).toString(),
          annRewardPerDay:  (this.totalRewardPerDay.mul(ethers.BigNumber.from(parseInt(ratios[1] * 10000))).div(1000000)).toString(),
          spaceRewardPerDay:  (this.totalRewardPerDay.mul(ethers.BigNumber.from(parseInt(ratios[2] * 10000))).div(1000000)).toString(),
          communityId: this.community.communityId,
          ethAddress: this.account
        }
        this.loading = true
        await updateRewardInfo(rewardsInfo);
        this.ratioModalVisible = false;
        this.poolPercentage = ratios.map(r => parseFloat(r))
      } catch (e) {
        handleApiErrCode(e, (title, info) => {
          this.$bvToast.toast(title, info)
        });
      } finally {
        this.loading = false
      }
    }
  },
  async mounted () {
    let communityInfo
    try {
      communityInfo = await getMyCommunityInfo()
    } catch (e) {
    }
    while(true) {
      if (this.communityData && this.community) {
        break;
      }
      await sleep(0.3)
    }

    getCommunityRewardPerBlock(communityInfo.id).then(reward => {
      this.totalRewardPerDay = ethers.BigNumber.from(reward).mul(ethers.BigNumber.from(10).pow(this.community.rewardTokenDecimals));
      const pool = this.communityData.pools.find(p => p.poolFactory.toLowerCase() ===
                getPoolFactoryAddress("curation") && p.status === 'OPENED')
      if (pool) {
        this.totalRewardPerDay = this.totalRewardPerDay.mul(10000 - this.communityData.feeRatio).mul(pool.ratio).div(100000000).mul(DAY_BLOCKS);
      }else {
        this.totalRewardPerDay = ethers.BigNumber.from(0);
      }
    }).catch(e => {
      console.log(2, e)
    });
    
    const curationContract = await getWh3CommunityContract(this.community.communityId);
    this.storageContract = curationContract.storageAddr;
    const retainedReward = await getERC20Balance(this.community.rewardToken, this.storageContract);
    const dec = (10 ** this.community.rewardTokenDecimals);
    this.retainedReward = retainedReward.toString() / dec;
    const rewards = [this.community.rewardPerDay / dec, this.community.annRewardPerDay / dec, this.community.spaceRewardPerDay / dec];
    const total = rewards.reduce((s, a) => s + a, 0);
    if (total === 0) {
      this.poolPercentage = [100, 0, 0]
    }else {
      this.poolPercentage = rewards.map(r => parseFloat(r * 100 / total).toFixed(2));
    }
  },
}
</script>

<style scoped lang="scss">
.social-pool-view {
  padding: 1rem 0;
}
.info-container {
  padding: 1rem;
  background: var(--card-bg-primary);
  border-radius: 12px;
}
.v-line {
  height: 30px;
  width: 1px;
  background: var(--input-border);
}
.row-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-key {
  white-space: nowrap;
  color: var(--text-9f);
}
.box-info-container {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  align-items: stretch;
  .info-card {
    background-color: var(--card-bg-primary);
    border-radius: 12px;
  }
}
.reward-item {
  background-color: var(--nav-tab-bg);
  padding: 0 6px;
  border-radius: 6px;
}
@media (min-width: 992px) {
  .social-pool-view {
    padding: 0 1rem 1rem;
  }
}
@media (max-width: 991px) {
  .box-info-container {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}
@media (max-width: 1200px) {
  .v-line {
    height: 0;
  }
}
</style>
