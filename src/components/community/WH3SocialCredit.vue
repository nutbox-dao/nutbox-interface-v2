<template>
  <div class="social-credit-view">
    <div class="row">
      <div class="col-12 col-lg-5">
        <div class=" text-center pt-lg-5">
          <div class="font16 font-bold">20%</div>
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
            <div class="font16 font-bold">60%</div>
          </div>
          <div class="position-absolute text-center triangle-right">
            <div class="text-grey-9f font14">{{$t('socialView.nftHolder')}}</div>
            <div class="font16 font-bold">20%</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-7 d-flex flex-column" style="gap: 15px">
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold row-info">
            <span class="py-1 text-grey-9f">{{$t('socialView.socialInfluence')}}</span>
          </div>
          <div class="custom-form px-3 py-3  border-top border-dark">
            <b-form-group class="mb-0"
                          label-class="overflow-hidden font14 line-height14 font-bold text-primary-0"
                          label-cols-md="8" content-cols-md="4"
                          label="Twitter Reputation NFT">
              <div class="c-input-group c-input-group-bg">
                <b-form-input :value="100"></b-form-input>
                <span class="c-append">%</span>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold row-info">
            <span class="py-1 text-grey-9f">{{$t('socialView.communityStaking')}}</span>
            <button v-if="!editStaking"
                    class="primary-btn primary-btn-outline operation-btn mr-0"
                    @click="editStaking=true">{{$t('operation.edit')}}</button>
            <button v-else
                    class="primary-btn operation-btn mr-0 text-black"
                    @click="onSaveStakingConfig">{{$t('operation.save')}}</button>
          </div>
          <div class="custom-form px-3 py-3 d-flex flex-column border-top border-dark" style="gap: 8px">
            <b-form-group v-for="(sPool, index) of stakingPools" :key="index"
                          class="mb-0"
                          label-class="overflow-hidden font14 line-height14 font-bold text-primary-0"
                          label-cols-md="8" content-cols-md="4"
                          :label="sPool['name']">
              <div class="c-input-group c-input-group-bg"
                   :class="editStaking?'edit-border':'c-input-group-border'">
                <b-form-input v-model="sPool.ratio" :disabled="!editStaking"></b-form-input>
                <span class="c-append">%</span>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="setting-info-card ">
          <div class="px-3 py-2 font16 font-bold d-flex justify-content-between align-items-center">
            <span class="py-1 text-grey-9f">{{$t('socialView.nftHolder')}}</span>
            <div class="d-flex align-items-center" style="gap: 8px">
              <button class="primary-btn operation-btn mr-0 text-black" @click="addNft">
                <span>{{$t('operation.add')}}</span>
              </button>
              <button v-if="!editNft"
                      class="primary-btn primary-btn-outline operation-btn mr-0"
                      @click="editNft=true">{{$t('operation.edit')}}</button>
              <button v-else
                      class="primary-btn operation-btn mr-0 text-black"
                      @click="onSaveNftConfig">{{$t('operation.save')}}</button>
            </div>
          </div>
          <div class="custom-form px-3 py-3 d-flex flex-column border-top border-dark" style="gap: 8px">
            <div v-for="(nItem, index) of nftHolders" :key="index"
                 class="row position-relative">
              <div class="col-8">
                <div class="c-input-group c-input-group-bg text-primary-0"
                     :class="editNft?'edit-border':'c-input-group-border'">
                  <b-form-input placeholder="Name"
                                class="text-primary-0 font-bold"
                                :disabled="!editNft"></b-form-input>
                </div>
              </div>
              <div class="col-4">
                <div class="c-input-group c-input-group-bg"
                     :class="editNft?'edit-border':'c-input-group-border'">
                  <b-form-input v-model="nItem.ratio"
                                :disabled="!editNft"></b-form-input>
                  <span class="c-append">%</span>
                </div>
              </div>
              <button class="sub-btn" @click="subNft(index)">
                <i class="sub-icon-gray"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WH3SocialCredit',
  data () {
    return {
      editStaking: false,
      stakingPools: [
        { name: 'FERC Staking', ratio: 25 },
        { name: 'MFERC Staking', ratio: 25 },
        { name: 'mferc-eth-staking', ratio: 25 },
        { name: 'tweet pool', ratio: 25 }
      ],
      editNft: false,
      nftHolders: [
        { name: '', ratio: 0 }
      ]
    }
  },
  methods: {
    onSaveStakingConfig () {
      this.editStaking = false
    },
    addNft () {
      this.nftHolders.push({ name: '', ratio: 0 })
    },
    subNft (index) {
      this.nftHolders.splice(index, 1)
    },
    onSaveNftConfig () {
      this.editNft = false
    }
  }
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
  .social-pool-view {
    padding: 0 1rem;
  }
}
</style>
