<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-10 mx-auto">
        <div class="view-top-header">
          <Step :current-step="2" :step-label="['Community asset deployed', 'Complete info']"></Step>
        </div>
      </div>
      <div class="row mt-3 mb-5">
        <div class="col-md-4">
          <div class="token-card">
            <div class="mt-3 mb-4 text-center">🎉 Community asset info 🎉</div>

            <div class="d-flex justify-content-between align-items-center font14" v-if="premining > 0">
              <span class="font-bold">Premining</span>
              <div class="d-flex align-items-center">
                <img class="rounded-circle"
                    v-show="communityInfo && communityInfo.cToken && communityInfo.cToken.icon"
                     style="width: 1.2rem;height: 1.2rem"
                     :src="communityInfo && communityInfo.cToken && communityInfo.cToken.icon" alt="">
                <span class="ml-2">{{ premining.toFixed(0) }}</span>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center font14  my-3">
              <span class="font-bold">Distribution</span>
              <div class="d-flex align-items-center">
                <img class="rounded-circle"
                    v-show="communityInfo && communityInfo.cToken && communityInfo.cToken.icon"
                     style="width: 1.2rem;height: 1.2rem"
                     :src="communityInfo && communityInfo.cToken && communityInfo.cToken.icon" alt="">
                <span class="ml-2">{{ distributeAmount }}</span>
              </div>
            </div>

             <div class="d-flex justify-content-between align-items-center font14">
              <span class="font-bold">Community token</span>
              <div class="d-flex align-items-center">
                <img class="rounded-circle"
                    v-show="communityInfo && communityInfo.cToken && communityInfo.cToken.icon"
                     style="width: 1.2rem;height: 1.2rem"
                     :src="communityInfo && communityInfo.cToken && communityInfo.cToken.icon" alt="">
                <span class="ml-2">{{ communityInfo && communityInfo.cToken && communityInfo.cToken.symbol }}</span>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center font14 my-3">
            </div>
            <div class="font14 font-bold">Distribution Strategy</div>
            <Progress :progress-data="distributions || []"/>
          </div>
        </div>
        <div class="col-md-8">
          <div class="community-info-card text-left">
            <!-- community name -->
            <div class="custom-form font14">
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityName')"
              >
                <b-form-input
                  v-model="form.name"
                  minlength="4"
                  maxlength="32"
                  :placeholder="$t('placeHolder.inputName')"
                ></b-form-input>
              </b-form-group>
              <!-- community link -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityLink')"
              >
                <b-form-input
                  v-model="form.website"
                  :placeholder="$t('placeHolder.inputLink')"
                ></b-form-input>
                <span class="font12 text-grey-7">{{ $t('commen.optional') }}</span>
              </b-form-group>
              <!-- community description -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityDesc')"
              >
                <b-form-textarea
                  v-model="form.description"
                  minlength="4"
                  maxlength="1024"
                  :placeholder="$t('placeHolder.inputDesc')"
                  rows="5"
                ></b-form-textarea>
              </b-form-group>
              <!-- logo -->
              <b-form-group
                class="mb-4 logo-form"
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityLogo')"
              >
                <div class="d-flex align-items-center">
                  <b-form-file
                    v-model="logo"
                    @input="updateLogo"
                    accept="image/png,image/jpeg, image/jpg"
                    ref="logo-file-input"
                  >
                    <template #placeholder>
                      <div class="input-file-logo">
                        <template v-if="form.icon">
                          <img class="cover-preview" :src="form.icon" alt="" />
                          <div class="edit-mask">
                            <span>{{ $t("operation.edit") }}<br />LOGO</span>
                          </div>
                        </template>
                        <template v-else>
                          <img
                            class="add-icon"
                            src="~@/static/images/add-icon-gary.svg"
                            alt=""
                          />
                        </template>
                      </div>
                    </template>
                    <template #file-name>
                      <div class="input-file-logo">
                        <img
                          class="logo-preview"
                          v-if="logoPreviewSrc"
                          :src="logoPreviewSrc"
                          alt=""
                        />
                        <UploadLoading v-if="logoUploadLoading" />
                      </div>
                    </template>
                  </b-form-file>
                  <div class="font12 text-grey-5 ml-3 text-grey-7">
                    {{ $t("tip.picTip", { size: "200*200" }) }}
                  </div>
                </div>
              </b-form-group>
              <!-- token logo -->
              <b-form-group
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                class="logo-form mb-4"
                :label="$t('community.cTokenLogo')"
              >
                <div class="d-flex align-items-center">
                  <b-form-file
                    :disabled="!editToken"
                    v-model="tokenLogo"
                    @input="updateTokenLogo"
                    accept="image/png,image/jpeg, image/jpg"
                    ref="logo-file-input"
                  >
                    <template #placeholder>
                      <div class="input-file-logo">
                        <template v-if="!!form.tokenLogo">
                          <img class="cover-preview" :src="form.tokenLogo" alt="" />
                          <div class="edit-mask" v-show="editToken">
                            <span>{{ $t("operation.edit") }}<br />LOGO</span>
                          </div>
                        </template>
                        <template v-else>
                          <img
                            class="add-icon"
                            src="~@/static/images/add-icon-gary.svg"
                            alt=""
                          />
                        </template>
                      </div>
                    </template>
                    <template #file-name>
                      <div class="input-file-logo">
                        <img
                          class="logo-preview"
                          v-if="tokenLogoPreviewSrc"
                          :src="tokenLogoPreviewSrc"
                          alt=""
                        />
                        <UploadLoading v-if="tokenLogoUploadLoading" />
                      </div>
                    </template>
                  </b-form-file>
                  <div class="font12 text-grey-5 ml-3 text-grey-7">
                    {{ $t("tip.picTip", { size: "200*200" }) }}
                  </div>
                </div>
              </b-form-group>

              <!-- community poster -->
              <b-form-group
                label-class="overflow-hidden font-bold"
                label-cols-md="3"
                content-cols-md="9"
                class="cover-form mb-4"
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
                          src="~@/static/images/add-icon-gary.svg"
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
                <div class="font12 text-grey-5 mt-2 text-grey-7">
                  {{ $t("tip.picTip", { size: "1200*280" }) }}
                </div>
              </b-form-group>
              <b-form-group
                label-class="overflow-hidden"
                label-cols-md="3"
                content-cols-md="9"
                class="text-center"
                label=""
              >
                <button class="primary-btn w-50" @click="showTips">
                  {{ $t("operation.commit") }}
                </button>
              </b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!------------------------------------------- tips --------------------------------------------->
    <!-- upload community info tip -->
    <b-modal
      v-model="showSignatureTip"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="pt-2">
        <!-- <img class="close-btn" src="~@/static/images/close.svg"
             alt="" @click="showSignatureTip=false"/> -->
        <div class="font20 line-height28 mb-4">
          {{ $t("tip.editTip") }}
        </div>
        <div class="d-flex" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showSignatureTip = false"
            :disabled="uploading"
          >
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("operation.cancel") }}
          </button>
          <button class="primary-btn mx-3" @click="onConfirm" :disabled="uploading">
            <b-spinner small type="grow" v-show="uploading" />
            Sign and upload
          </button>
        </div>
      </div>
    </b-modal>
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
          :class="coverUploadLoading?'':'cropper-rounded-circle'"
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
        <button class="primary-btn" @click="completeCropAndUpload">{{ $t('operation.complete') }}</button>
      </div>
    </b-modal>
    <b-modal
      v-model="chooseTokenTipModal"
      modal-class="custom-modal"
      hide-backdrop
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <ChooseTokenTipModal @close="chooseTokenTipModal=false"/>
    </b-modal>
  </div>
</template>

<script>
import { uploadImage, handleApiErrCode, sleep } from '@/utils/helper'
import UploadLoading from '@/components/common/UploadLoading'
import {
  completeCommunityInfo,
  getMyCommunityInfo,
  getAllCommunities,
  getDistributionEras
} from '@/utils/web3/community'
import { getMyJoinedCommunity } from '@/utils/graphql/user'
import { mapState } from 'vuex'
import Step from '@/components/common/Step'
import { VueCropper } from 'vue-cropper'
import Progress from '@/components/community/Progress'
import ChooseTokenTipModal from '@/components/community/ChooseTokenTipModal'
import { errCode } from '@/config';

export default {
  name: 'SetCommunityProfile',
  components: { UploadLoading, Step, VueCropper, Progress, ChooseTokenTipModal },
  data () {
    return {
      logo: null,
      coverImg: null,
      tokenLogo: null,

      form: {
        id: '',
        name: '',
        website: '',
        description: '',
        tokenLogo: '',
        icon: '',
        category: '',
        poster: '',
        color: '#ffdb1b'
      },

      tokenLogoPreviewSrc: '',
      logoPreviewSrc: '',
      coverPreviewSrc: '',

      editToken: true,

      logoUploadLoading: false,
      tokenLogoUploadLoading: false,
      coverUploadLoading: false,

      showSignatureTip: false,
      uploading: false,

      cropperModal: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      state: '',
      chooseTokenTipModal: false,
    }
  },
  computed: {
    ...mapState('community', ['communityInfo', 'distributions']),

    distributeAmount () {
      if (!this.distributions) {
        return 0;
      }
      return this.distributions.reduce((t, p) => t += (parseInt(p.stopHeight) - parseInt(p.startHeight) + 1) * parseFloat(p.amount), 0)
    },
    premining () {
      if (!this.communityInfo){
        return 0;
      }
      const ctoken = this.communityInfo && this.communityInfo.cToken;
      if (!ctoken || !ctoken.totalSupply) return 0;
      return ctoken.totalSupply.toString() / (10 ** ctoken.decimal);
    }
  },
  async mounted () {
    try{
      await getMyCommunityInfo()
    }catch(e) {
      if(e == errCode.NO_STAKING_FACTORY){
        this.$router.replace('deploy-token')
        return;
      }
    }

    if (this.communityInfo && this.communityInfo.cToken){
      // this.tokenLogo = this.communityInfo.cToken.icon
      this.form.tokenLogo = this.communityInfo.cToken.icon
      if (this.form.tokenLogo) this.editToken = false
      this.chooseTokenTipModal = !this.communityInfo.cToken.isMintable;
      getDistributionEras();
    }
    this.chooseTokenTipModal = true
  },
  methods: {
    onCancel () {
      this.cropperModal = false
      if (this.logoUploadLoading) {
        this.logo = null
        this.logoUploadLoading = false
      }
      if (this.coverUploadLoading) {
        this.coverImg = null
        this.coverUploadLoading = false
      }
      if (this.tokenLogoUploadLoading) {
        this.tokenLogo = null
        this.tokenLogoUploadLoading = false
      }
    },
    clipCircleImg (imgSrc) {
      return new Promise(resolve => {
        const canvas = document.getElementById('cropper-canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = imgSrc
        img.onload = () => {
          const cw = canvas.width = img.width
          const ch = canvas.height = img.height
          ctx.beginPath()
          ctx.arc(cw / 2, ch / 2, ch / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(img, 0, 0)
        }
        const timer = setInterval(function () {
          if (img.complete) {
            clearInterval(timer)
            resolve(canvas)
          }
        }, 50)
      })
    },
    completeCropAndUpload () {
      if (this.logoUploadLoading) {
        this.$refs.cropper.getCropData(async (data) => {
          const canvas = await this.clipCircleImg(data)
          this.logoPreviewSrc = canvas.toDataURL('image/png')
          this.cropperModal = false
          canvas.toBlob(async data => {
            try {
              this.form.icon = await uploadImage(data)
              this.logoUploadLoading = false
            } catch (e) {
              handleApiErrCode(e, (title, info) => {
                this.$bvToast.toast(title, info)
              });
              this.logo = null
              this.form.icon = null
              this.logoUploadLoading = false
            }
          })
        })
      } else if (this.coverUploadLoading) {
        this.$refs.cropper.getCropData((data) => {
          this.coverPreviewSrc = data
          this.cropperModal = false
        })
        this.$refs.cropper.getCropBlob(async (data) => {
          try {
            this.form.poster = await uploadImage(data)
            this.coverUploadLoading = false
          } catch (e) {
            handleApiErrCode(e, (title, info) => {
              this.$bvToast.toast(title, info)
            });
            this.coverImg = null
            this.form.poster = null
            this.coverUploadLoading = false
          }
        })
      } else if (this.tokenLogoUploadLoading) {
        this.$refs.cropper.getCropData(async (data) => {
          const canvas = await this.clipCircleImg(data)
          this.tokenLogoPreviewSrc = canvas.toDataURL('image/png')
          this.cropperModal = false
          canvas.toBlob(async data => {
            try {
              this.form.tokenLogo = await uploadImage(data)
              this.tokenLogoUploadLoading = false
            } catch (e) {
              handleApiErrCode(e, (title, info) => {
                this.$bvToast.toast(title, info)
              });
              this.logo = null
              this.form.tokenLogo = null
              this.tokenLogoUploadLoading = false
            }
          })
        })
      }
    },
    async updateTokenLogo (file) {
      if (!this.tokenLogo) return
      this.tokenLogoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
        this.cropFixedNumber = [1, 1]
        this.cropImgSize = [200, 200]
      }
    },
    async updateLogo (file) {
      if (!this.logo) return
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
        this.cropFixedNumber = [1, 1]
        this.cropImgSize = [200, 200]
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
    valideInfos () {
      const { name, website, description, icon, poster, tokenLogo } = this.form
      let tips = null
      if (website && website.length > 0) {
        const regUrl = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
        const res = website.match(regUrl)
        console.log({ res })
        if (!res) {
          tips = this.$t('tip.needRightUrl')
          this.$bvToast.toast(tips, {
            title: this.$t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
          return false
        }
      }

      if (!name || name.length === 0) {
        tips = this.$t('tip.needName')
      } else if (name && name.length > 32) {
        tips = this.$t('tip.communityNameLimit', { count: 32 })
      } else if (!description || description.length === 0) {
        tips = this.$t('tip.needDescription')
      } else if (description.length >= 1024) {
        tips = this.$t('tip.descriptionLimit', { count: 32 })
      } else if (!tokenLogo || tokenLogo.length === 0) {
        tips = this.$t('tip.needTokenIcon')
      } else if (!icon || icon.length === 0) {
        tips = this.$t('tip.needIcon')
      } else if (!poster || poster.length === 0) {
        tips = this.$t('tip.needPoster')
      } else {
        return true
      }
      this.$bvToast.toast(tips, {
        title: this.$t('tip.tips'),
        autoHideDelay: 5000,
        variant: 'warning'
      })
      return false
    },
    async showTips () {
      if (this.valideInfos()) {
        this.showSignatureTip = true
      }
    },
    async onConfirm () {
      try {
        this.uploading = true
        const resCode = await completeCommunityInfo(this.form, 'create')

        // go to community dashboard
        this.$bvToast.toast(this.$t('tip.completeCommunityInfoSuccess'), {
          title: this.$t('tip.tips'),
          variant: 'success'
        })
        await sleep(3)
        await Promise.all([
          getAllCommunities(true),
          getMyJoinedCommunity(),
          getMyCommunityInfo(true)
        ])
        await sleep(1)
        this.$router.replace('/manage-community/profile')
      } catch (e) {
        console.log(235,e);
        const handleRes = handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params)
        })
      } finally {
        this.uploading = false
      }
    },
    gotoCreate () {
      this.$router.push('/community/create-economy')
    }
  }
}
</script>

<style scoped lang="scss">
.community-info-card {
  min-height: 30rem;
  position: relative;
  @include card();
}
.token-card {
  @include card(.8rem, var(--card-bg-primary), hidden, fit-content);
}
@import "src/static/css/form";
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
.close-icon {
  position: absolute;
  right: -1.4rem;
  top: -1.4rem;
  @include icon(1.4rem, 1.4rem);
  background-image: url("~@/static/images/circle-close.png");
}
.cropper-container {
  height: 500px;
  max-height: 100%;
}
.crop-btn-group {
  padding: 1.2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  button {
    box-shadow: none;
    width: fit-content;
    padding: 0 2rem;
  }
}
@media (max-width: 576px) {
  .close-icon {
    top: auto;
    bottom: -2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
