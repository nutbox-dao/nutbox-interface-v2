<template>
  <div class="social-pool-view">
    <div class="info-container font14">
      <div class="row align-items-center">
        <div class="col-12 col-xl-4">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.contractAddress')}}</div>
            <div class="d-flex align-items-center">
              <span>0x123123...123123123</span>
              <i class="copy-icon copy-icon-gray ml-2"></i>
            </div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.distributeBalance')}}</div>
            <div class="font-bold">1000,000,000 $M</div>
          </div>
        </div>
        <div class="col-12 col-xl-1 d-flex justify-content-center align-items-center"><div class="v-line"></div></div>
        <div class="col-12 col-xl-4">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#tag</div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.communityCategoryTags')}}</div>
            <div class="ml-4 d-flex flex-wrap align-items-center">
              <span v-for="i of 3" :key="i" class="ml-2 font-bold">#tag</span>
            </div>
          </div>
        </div>
        <div class="col-xl-1 d-flex justify-content-center align-items-center"><div class="v-line"></div></div>
        <div class="col-12 col-xl-2 mt-2 mt-xl-0">
          <button class="primary-btn text-black"
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
          <span class="text-primary-0">40%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#tag</div>
          </div>
          <div class="row-info py-1">
            <div class="info-key">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">curator: 100</div>
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
          <span class="text-primary-0">30%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#tag</div>
          </div>
          <div class="d-flex justify-content-between py-1">
            <div class="info-key">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">creator: 30</div>
              <div class="reward-item">curator: 70</div>
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
          <span class="text-primary-0">30%</span>
        </div>
        <div class="px-3 py-2 font14">
          <div class="row-info py-1">
            <div class="info-key">{{$t('socialView.chainTag')}}</div>
            <div class="font-bold">#tag</div>
          </div>
          <div class="d-flex justify-content-between py-1">
            <div class="info-key text-break">Reward</div>
            <div class="font-bold d-flex flex-wrap ml-4 justify-content-end" style="gap: 4px">
              <div class="reward-item">host: 25</div>
              <div class="reward-item">co-host: 25</div>
              <div class="reward-item">speaker: 25</div>
              <div class="reward-item">curator: 25</div>
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
      <WH3PoolRatioModal @close="ratioModalVisible=false"/>
    </b-modal>
  </div>
</template>

<script>
import WH3PoolRatioModal from '@/components/community/WH3PoolRatioModal.vue'
export default {
  name: 'WH3SocialPool',
  components: { WH3PoolRatioModal },
  data () {
    return {
      ratioModalVisible: false
    }
  }
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
