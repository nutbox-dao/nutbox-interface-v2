<template>
  <div class="scroll-content d-flex flex-column">
    <div class="container">
      <div class="c-card col-md-9 mx-auto">
        <div class="custom-form text-left">
          <b-form-group
            label-cols-md="2"
            content-cols-md="10"
            :label="$t('nps.remark')"
            label-for="remarkInput"
            label-class="d-flex font16 font-bold "
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-textarea
                  id="remark"
                  :placeholder="$t('placeHolder.remarkInput')"
                  v-model="form.remark"
                  rows="10"
                  max="2046"
                ></b-form-textarea>
              </div>
            </div>
          <div class="mt-3">{{ $t('tip.markdownTip') }}</div>
          </b-form-group>
          <b-form-group
            label-cols-md="2"
            content-cols-md="10"
            :label="$t('nps.proposalBodyPreview')"
            label-for="remarkInput"
            label-class="d-flex font16 font-bold "
          >
            <div class="d-flex">
              <div class="c-input-group p-3" style="min-height: 2.4rem">
                <Markdown :body="form.remark" />
              </div>
            </div>
          </b-form-group>

          <b-form-group
            label-cols-md="2"
            content-cols-md="5"
            :label="$t('nps.proposalThreshold')"
            label-for="proposalThresholdInput"
            label-class="d-flex align-items-center font16 font-bold "
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  id="proposalThreshold"
                  :placeholder="$t('nps.proposalThresholdInput')"
                  v-model="form.threshold"
                  type="number"
                ></b-form-input>
                <span class="c-append">{{ form.symbol }}</span>
              </div>
            </div>
          </b-form-group>
          <b-form-group
            label-cols-md="2"
            content-cols-md="5"
            :label="$t('nps.proposalPassThreshold')"
            label-for="proposalPassThresholdInput"
            label-class="d-flex align-items-center font16 font-bold"
          >
            <div class="d-flex align-items-center">
              <div class="c-input-group">
                <b-form-input
                  id="proposalPassThreshold"
                  :placeholder="$t('nps.proposalPassThresholdInput')"
                  v-model="form.passthreshold"
                  type="number"
                ></b-form-input>
                <span class="c-append">{{ form.symbol }}</span>
              </div>
            </div>
          </b-form-group>

          <!-- npm poster -->
          <b-form-group
            label-cols-md="2"
            content-cols-md="10"
            class="cover-form"
            :label="$t('community.communityPoster')"
          >
            <b-form-file
              v-model="coverImg"
              @input="updateCover"
              accept="image/png,image/jpeg,image/jpg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-cover">
                  <template v-if="form.poster">
                    <img class="cover-preview" :src="form.poster" alt="" />
                    <div class="edit-mask">
                      <span
                      >{{ $t("operation.edit") }}<br />{{
                          $t("community.communityPoster")
                        }}</span
                      >
                    </div>
                  </template>
                  <template v-else>
                    <img
                      class="add-icon"
                      src="~@/static/images/add-white-icon.svg"
                      alt=""
                    />
                    <div class="add-text">
                      {{ $t("operation.uploadPoster") }}
                    </div>
                  </template>
                </div>
              </template>
              <template #file-name>
                <div class="input-file-cover">
                  <img
                    class="cover-preview"
                    v-if="coverPreviewSrc"
                    :src="coverPreviewSrc"
                    alt=""
                  />
                  <UploadLoading v-if="coverUploadLoading" />
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-light mt-1">
              {{ $t("tip.picTip", { size: "1200*280" }) }}
            </div>
          </b-form-group>

          <b-form-group label-cols-md="2" content-cols-md="10" label="">
            <div class="text-center mt-4">
              <button class="primary-btn col-md-6" @click="submitForm" :disabled="updateing">
                <b-spinner small type="grow" v-show="updateing" />
                {{ $t("operation.update") }}
              </button>
            </div>
          </b-form-group>
        </div>
      </div>
    </div>

    <!-- crop pic tip -->
    <b-modal
      v-model="cropperModal"
      modal-class="cropper-modal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <div class="cropper-container">
        <canvas id="cropper-canvas"></canvas>
        <vueCropper
          ref="cropper"
          :infoTrue="true"
          :autoCrop="true"
          :img="cropperImgSrc"
          :fixedNumber="cropFixedNumber"
          :autoCropWidth="cropImgSize[0]"
          :fixed="true"
          :centerBox="true"
          outputType="png"
        ></vueCropper>
      </div>
      <div class="crop-btn-group">
        <button class="primary-btn" @click="onCancel">{{ $t('operation.cancel') }}</button>
        <button class="primary-btn" @click="completeCropAndUpload">{{ $t('commen.complete') }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  completeCommunityProposalConfigInfo
} from '@/utils/web3/communityProposalConfig'
import { handleApiErrCode, uploadImage } from '@/utils/helper'
import { getCToken } from '@/utils/web3/asset'
import { getMyCommunityInfo } from '@/utils/web3/community'
import {
  BSC_STRATEGIES_NAME
} from '@/config'
import Markdown from '@/components/common/Markdown'
import { nanoid } from 'nanoid'
import { mapState } from 'vuex'
import UploadLoading from '@/components/common/UploadLoading'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'CommunityVote',
  components: {
    Markdown,
    UploadLoading,
    VueCropper
  },
  data () {
    return {
      updateing: false,
      communityId: null,
      activeTab: 0,
      coverImg: null,
      strategyControlItems: [],
      strategies: null,
      uploading: false,
      cropperModal: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [1200, 280],
      coverPreviewSrc: '',
      coverUploadLoading: false,
      form: {
        communityId: '',
        remark: '',
        symbol: '',
        poster: '',
        strategies: '',
        threshold: 0,
        passthreshold: 0,
      }
    }
  },
  computed: {
    ...mapState('web3', ['communityProposalConfig'])
  },
  methods: {
    onCancel () {
      this.cropperModal = false
      if (this.coverUploadLoading) {
        this.coverImg = null
        this.coverUploadLoading = false
      }
    },
    completeCropAndUpload () {
      this.$refs.cropper.getCropData((data) => {
        this.coverPreviewSrc = data
        this.cropperModal = false
      })
      this.$refs.cropper.getCropBlob(async (data) => {
        try {
          this.form.poster = await uploadImage(data)
          this.coverUploadLoading = false
        } catch (e) {
          this.$bvToast.toast(this.$t('tip.picUploadFail'), {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          this.coverImg = null
          this.form.poster = null
        }
      })
    },
    async submitForm () {
      try {
        this.updateing = true

        this.form.strategies = JSON.stringify(
          this.strategyControlItems,
          null,
          4
        )

        const resCode = await completeCommunityProposalConfigInfo(
          this.form
        )
        this.$bvToast.toast(
          this.$t('tip.completeCommunityProposalConfigSuccess'),
          {
            title: this.$t('tip.tips'),
            variant: 'success'
          }
        )
        setTimeout(() => {
          getMyCommunityInfo()
        }, 3000);
      } catch (e) {
        const handleRes = handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params)
        })
      } finally {
        this.updateing = false
      }
    },
    async updateCover (file) {
      if (!this.coverImg) return
      this.coverUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
        this.cropFixedNumber = [30, 7]
        this.cropImgSize = [1200, 280]
      }
    },
  },
  async mounted () {
    try {
      const communityInfo = await getMyCommunityInfo()
      console.log(3465, communityInfo);

      this.form.id = communityInfo.id
      this.form.communityId = communityInfo.id
      this.form.threshold = communityInfo.threshold;
      this.form.passthreshold = communityInfo.passthreshold
      this.form.remark = communityInfo.remark
      this.form.poster = communityInfo.npsPoster

      if (this.form.strategies) { 
        this.strategyControlItems = JSON.parse(this.form.strategies) 
      }else {
        const token = await getCToken(communityInfo.id)
        const strategyParamsObj = {}
        strategyParamsObj.address = token.address
        strategyParamsObj.symbol = token.symbol
        strategyParamsObj.decimals = token.token_decimal
        this.form.symbol = token.symbol

        const currentItem = {
          strategyControlId: nanoid(),
          strategyKey: BSC_STRATEGIES_NAME,
          strategyParams: JSON.stringify(strategyParamsObj, null, 4),
          strategies: {
            name: BSC_STRATEGIES_NAME,
            params: strategyParamsObj
          }
        }

        this.strategyControlItems.push(currentItem)
      }
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  //@include card(2rem 1.2rem, var(--card-bg-primary), none, auto);
  flex: 1;
}
.cover-preview {
  width: 100%;
}
.edit-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  span {
    position: absolute;
    display: inline-block;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1rem;
    text-align: center;
  }
}
</style>
