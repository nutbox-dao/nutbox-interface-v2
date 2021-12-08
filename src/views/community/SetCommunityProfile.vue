<template>
  <div class="scroll-content">
    <div class="container">
      <div class="col-md-10 mx-auto">
        <div class="view-top-header">
          <Step :current-step="2" :step-label="['Deploy community', 'setupProfile']"></Step>
        </div>
      </div>
      <div class="row mt-3 mb-5">
        <div class="col-md-4">
          <div class="token-card">
            <div class="mt-2 mb-4 text-center">Token Deploy Success !</div>
            <div class="d-flex justify-content-between align-items-center font14">
              <span class="font-bold">Community token</span>
              <div class="d-flex align-items-center">
                <img class="rounded-circle"
                     style="width: 1.2rem;height: 1.2rem"
                     src="~@/static/images/tokens/dot.png" alt="">
                <span class="ml-2">PNUT</span>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center font14 my-3">
              <span class="font-bold">Community token</span>
              <span>100000000</span>
            </div>
            <div class="font14 font-bold">Distribution Stratage</div>
            <Progress :progress-data="[]"/>
          </div>
        </div>
        <div class="col-md-8">
          <div class="community-info-card text-left">
            <!-- community name -->
            <div class="custom-form">
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityName')"
              >
                <b-form-input
                  class="input-border"
                  :disabled="!isEdit"
                  v-model="form.name"
                  :placeholder="$t('community.inputName')"
                ></b-form-input>
              </b-form-group>
              <!-- community link -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityLink')"
              >
                <b-form-input
                  class="input-border"
                  :disabled="!isEdit"
                  v-model="form.website"
                  :placeholder="$t('community.inputLink')"
                ></b-form-input>
                <span>{{ $t('cl.optional') }}</span>
              </b-form-group>
              <!-- community description -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="9"
                :label="$t('community.communityDesc')"
              >
                <b-form-textarea
                  class="input-border"
                  :disabled="!isEdit"
                  v-model="form.description"
                  :placeholder="$t('community.inputDesc')"
                  rows="5"
                ></b-form-textarea>
              </b-form-group>
              <!-- community theme -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="4"
                :label="$t('community.communityThemeColor')"
              >
                <input class="p-2 w-100 form-control input-border" type="color"
                       :disabled="!isEdit" v-model="form.color"/>
              </b-form-group>
              <!-- community category -->
              <b-form-group
                class="mb-4"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="4"
                :label="$t('community.communityCategory')"
              >
                <b-dropdown
                  class="c-dropdown w-100"
                  menu-class="full-dropdown-menu"
                  :disabled="!isEdit"
                >
                  <template #button-content>
                    <div
                      class="c-dropdown-btn primary-btn w-100 d-flex justify-content-between"
                      style="height: 2.4rem"
                    >
                      <span>{{ form.category || "Chose" }}</span>
                      <i class="dropdown-icon ml-3"></i>
                    </div>
                  </template>
                  <b-dropdown-item @click="form.category = c"
                                   v-for="c in categorys" :key="c"
                  >{{ c }}</b-dropdown-item>
                </b-dropdown>
              </b-form-group>
              <div class="row">
                <div class="col-md-6">
                  <!-- community logo -->
                  <b-form-group
                    class="mb-4 logo-form"
                    label-class="overflow-hidden text-grey-7"
                    label-cols-md="6"
                    content-cols-md="6"
                    :label="$t('community.communityLogo')"
                  >
                    <b-form-file
                      :disabled="!isEdit"
                      v-model="logo"
                      @input="updateLogo"
                      accept="image/png,image/jpeg, image/jpg"
                      ref="logo-file-input"
                    >
                      <template #placeholder>
                        <div class="input-file-logo">
                          <template v-if="form.icon">
                            <img class="cover-preview" :src="form.icon" alt="" />
                            <div v-if="isEdit" class="edit-mask">
                              <span>{{ $t("community.edit") }}<br />LOGO</span>
                            </div>
                          </template>
                          <template v-else>
                            <img
                              class="add-icon"
                              src="~@/static/images/add.svg"
                              alt=""
                            />
<!--                            <div class="add-text">{{ $t("community.uploadLogo") }}</div>-->
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
                    <div class="font12 text-grey-5 mt-1" v-if="isEdit">
                      {{ $t("community.picTip", { size: "200*200" }) }}
                    </div>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <!-- token logo -->
                  <b-form-group
                    class="mb-4 logo-form"
                    label-class="overflow-hidden text-grey-7"
                    label-cols-md="6"
                    content-cols-md="6"
                    :label="$t('community.communityLogo')"
                  >
                    <b-form-file
                      :disabled="!isEdit"
                      v-model="logo"
                      @input="updateLogo"
                      accept="image/png,image/jpeg, image/jpg"
                      ref="logo-file-input"
                    >
                      <template #placeholder>
                        <div class="input-file-logo">
                          <template v-if="form.icon">
                            <img class="cover-preview" :src="form.icon" alt="" />
                            <div v-if="isEdit" class="edit-mask">
                              <span>{{ $t("community.edit") }}<br />LOGO</span>
                            </div>
                          </template>
                          <template v-else>
                            <img
                              class="add-icon"
                              src="~@/static/images/add.svg"
                              alt=""
                            />
<!--                            <div class="add-text">{{ $t("community.uploadLogo") }}</div>-->
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
                    <div class="font12 text-grey-5 mt-1" v-if="isEdit">
                      {{ $t("community.picTip", { size: "200*200" }) }}
                    </div>
                  </b-form-group>
                </div>
              </div>
              <!-- community poster -->
              <b-form-group
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="9"
                class="cover-form mb-4"
                :label="$t('community.communityPoster')"
              >
                <b-form-file
                  :disabled="!isEdit"
                  v-model="coverImg"
                  @input="updateCover"
                  accept="image/png,image/jpeg,image/jpg"
                  ref="logo-file-input"
                >
                  <template #placeholder>
                    <div class="input-file-cover">
                      <template v-if="form.poster">
                        <img class="cover-preview" :src="form.poster" alt="" />
                        <div v-if="isEdit" class="edit-mask">
                        <span
                        >{{ $t("community.edit") }}<br />{{
                            $t("community.poster")
                          }}</span
                        >
                        </div>
                      </template>
                      <template v-else>
                        <img
                          class="add-icon"
                          src="~@/static/images/add.svg"
                          alt=""
                        />
                        <div class="add-text">
                          {{ $t("community.uploadPoster") }}
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
                <div class="font12 text-grey-light mt-1" v-if="isEdit">
                  {{ $t("community.picTip", { size: "1200*280" }) }}
                </div>
              </b-form-group>
              <b-form-group
                v-if="isEdit"
                label-class="overflow-hidden text-grey-7"
                label-cols-md="3"
                content-cols-md="9"
                class="text-center"
                label=""
              >
                <button class="primary-btn w-50" @click="showTips">
                  {{ $t("community.commit") }}
                </button>
              </b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!------------------------------------------- tips --------------------------------------------->
    <!-- noCommunity tip -->
    <b-modal
      v-model="noCommunity"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center my-5">
          {{ $t("community.noCommunity") }}
        </div>
        <button class="primary-btn" @click="gotoCreate">
          {{ $t("community.gotoCreate") }}
        </button>
      </div>
    </b-modal>
    <!-- upload community info tip -->
    <b-modal
      v-model="showSignatureTip"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <!-- <img class="close-btn" src="~@/static/images/close.svg"
             alt="" @click="showSignatureTip=false"/> -->
        <div class="my-5">
          {{ $t("community.editTip") }}
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button class="primary-btn" @click="onConfirm" :disabled="uploading">
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("community.sign") }}
          </button>
          <button
            class="primary-btn primary-btn-outline"
            @click="showSignatureTip = false"
            :disabled="uploading"
          >
            <b-spinner small type="grow" v-show="uploading" />
            {{ $t("commen.cancel") }}
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
          :class="logoUploadLoading?'cropper-rounded-circle':''"
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
        <button class="primary-btn" @click="onCancel">{{ $t('commen.cancel') }}</button>
        <button class="primary-btn" @click="completeCropAndUpload">{{ $t('commen.complete') }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { uploadImage, handleApiErrCode, sleep } from '@/utils/helper'
import UploadLoading from '@/components/common/UploadLoading'
import {
  completeCommunityInfo,
  getMyCommunityInfo,
  getAllCommunities
} from '@/utils/web3/community'
import { mapGetters } from 'vuex'
import { CHAIN_NAME } from '@/config'
import Step from '@/components/common/Step'
import { VueCropper } from 'vue-cropper'
import Progress from '@/components/community/Progress'

export default {
  name: 'SetCommunityProfile',
  components: { UploadLoading, Step, VueCropper, Progress },
  data () {
    return {
      logo: null,
      coverImg: null,
      chargeValue: 0,
      inputDevAddress: '',
      inputDevRatio: '',
      inputBlogTag: '',
      form: {
        id: '',
        name: '',
        website: '',
        description: '',
        icon: '',
        category: '',
        poster: '',
        pools: [],
        blogTag: '',
        color: '#ffdb1b'
      },
      categorys: [
        'All',
        CHAIN_NAME,
        'Polkadot',
        'Steem',
        'Hive'
      ],
      logoPreviewSrc: '',
      logoUploadLoading: false,
      coverPreviewSrc: '',
      coverUploadLoading: false,
      type: null,
      isEdit: true,
      canEdit: false,
      noCommunity: false,
      showSignatureTip: false,
      showChargeTip: false,
      showDevAddressTip: false,
      showDevRatioTip: false,
      showBlogTip: false,
      uploading: false,
      approving: false,
      charging: false,
      publishingBlog: false,
      creatingBlog: false,
      cToken: {},
      isMintable: true,
      cTokenAddress: '',
      updatingAddress: false,
      updatingDevRatio: false,
      showStep: false,
      cropperModal: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      blogTag: '',
      blogMainPassword: '',
      blogBtnName: '',
      state: '',
      showSteemLogin: false
    }
  },
  computed: {
    ...mapGetters('web3', ['createState'])
  },
  watch: {
    type (newValue, oldValue) {
      // type : null , create, edit
      this.isEdit = !!newValue
    }
  },
  async mounted () {
    // this.type = this.$route.query.type
    // this.isEdit = !!this.type
    // try {
    //   const communityInfo = await getMyCommunityInfo()
    //   if (!communityInfo) {
    //     // Havn't create feast
    //     this.noCommunity = true
    //     return
    //   }
    //   this.canEdit = true
    //   this.form = { ...communityInfo }
    //   this.form.color = this.form.color ?? '#ffdb1b'
    //   if (!communityInfo.name) {
    //     this.form.id = communityInfo.id
    //     return
    //   }
    // } catch (e) {
    //   handleApiErrCode(e, (info, params) => {
    //     this.$bvToast.toast(info, params)
    //   })
    // }
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
              this.$bvToast.toast(this.$t('tip.picUploadFail'), {
                title: this.$t('tip.tips'),
                autoHideDelay: 5000,
                variant: 'warning'
              })
              this.logo = null
              this.form.icon = null
              this.logoUploadLoading = false
            }
          })
        })
      } else {
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
      }
    },
    clickEdit () {
      this.type = this.form.name ? 'edit' : 'create'
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
      const { name, website, description, icon, poster } = this.form
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
      console.log(this.form)
      if (this.valideInfos()) {
        this.showSignatureTip = true
      }
    },
    async onConfirm () {
      try {
        this.uploading = true
        const resCode = await completeCommunityInfo(this.form, this.type)

        // go to community dashboard
        this.$bvToast.toast(this.$t('tip.completeCommunityInfoSuccess'), {
          title: this.$t('tip.tips'),
          variant: 'success'
        })
        await sleep(2)
        await Promise.all([
          getAllCommunities(true),
          getMyCommunityInfo(true)
        ])
        await sleep(1)
        this.$router.replace('/community-setting/staking')
      } catch (e) {
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
}
.token-card {
  @include card(.8rem, var(--card-bg-primary), hidden, unset);
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
