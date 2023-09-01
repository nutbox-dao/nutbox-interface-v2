<template>
  <div class="social-credit-view">
    <div class="row">
      <div class="col-12 col-lg-5">
        <button class="w-25 primary-btn text-black ml-0"
                :disabled="editConfig"
                @click="editConfig=true">{{$t('operation.edit')}}</button>
        <div class="pt-lg-5 pb-5">
          <div class="text-center">
            <div class="c-input-group c-input-group-bg mx-auto"
                 :class="editConfig?'edit-border':'c-input-group-border'"
                 style="width: 80px">
              <b-form-input v-model="creditRatioList[0]"></b-form-input>
              <span class="pr-2">%</span>
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
              <div class="c-input-group c-input-group-bg mx-auto"
                   :class="editConfig?'edit-border':'c-input-group-border'"
                   style="width: 80px">
                <b-form-input v-model="creditRatioList[1]"></b-form-input>
                <span class="pr-2">%</span>
              </div>
            </div>
            <div class="position-absolute text-center triangle-right">
              <div class="text-grey-9f font14">{{$t('socialView.nftHolder')}}</div>
              <div class="c-input-group c-input-group-bg mx-auto"
                   :class="editConfig?'edit-border':'c-input-group-border'"
                   style="width: 80px">
                <b-form-input v-model="creditRatioList[2]"></b-form-input>
                <span class="pr-2">%</span>
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
                <b-form-input :value="100"></b-form-input>
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
              <div class="c-input-group c-input-group-bg"
                   :class="editConfig?'edit-border':'c-input-group-border'">
                <b-form-input v-model="sPool.ratio" :disabled="!editConfig"></b-form-input>
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
                <div class="c-input-group c-input-group-bg text-primary-0"
                     :class="editConfig?'edit-border':'c-input-group-border'">
                  <b-form-input placeholder="Name"
                                class="text-primary-0 font-bold"
                                :disabled="!editConfig"></b-form-input>
                </div>
              </div>
              <div class="col-4">
                <div class="c-input-group c-input-group-bg"
                     :class="editConfig?'edit-border':'c-input-group-border'">
                  <b-form-input v-model="nItem.ratio"
                                :disabled="!editConfig"></b-form-input>
                  <span class="c-append">%</span>
                </div>
              </div>
              <button class="sub-btn" @click="subNft(index)">
                <i class="sub-icon-gray"></i>
              </button>
            </div>
          </div>
        </div>
        <button v-if="editConfig"
                class="w-50 mx-auto mt-3 primary-btn text-black"
                @click="onSaveNftConfig">{{$t('operation.save')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WH3SocialCredit',
  data () {
    return {
      creditRatioList: [20, 60, 20],
      editConfig: false,
      stakingPools: [
        { name: 'FERC Staking', ratio: 25 },
        { name: 'MFERC Staking', ratio: 25 },
        { name: 'mferc-eth-staking', ratio: 25 },
        { name: 'tweet pool', ratio: 25 }
      ],
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
  .social-credit-view {
    padding: 0 1rem;
  }
}
</style>
