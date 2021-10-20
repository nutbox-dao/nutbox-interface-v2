<template>
  <div class="page-view-content" >
    <div class="scroll-content container">
      <div class="view-top-header">
        <Step v-show="showStep" :current-step="2"></Step>
        <div class="flex-between-center w-100">
          <div
            class="font20" :class="$route.query.type==='create'?'page-back-text-icon':'page-title-line'"
            style="line-height: 1rem"
            @click="isEdit ? (type = null) : $router.back()"
          >
            {{
              (isEdit ? $t("community." + type) : "") +
              $t("community.communityInfo")
            }}
          </div>
          <div v-if="!isEdit">
            <button
              class="primary-btn pl-3 pr-3"
              :disabled="!canEdit"
              @click="clickEdit"
            >
              {{ $t("community.edit") }}
            </button>
          </div>
        </div>
      </div>
      <div class="mb-5">
        <div class="community-info-card text-left">
          <!-- community name -->
          <div class="custom-form pl-md-3">
            <b-form-group
              label-cols-md="2"
              content-cols-md="5"
              :label="$t('community.communityName')"
            >
              <b-form-input
                :disabled="!isEdit"
                v-model="form.name"
                :placeholder="$t('community.inputName')"
              ></b-form-input>
            </b-form-group>
            <!-- community link -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="5"
              :label="$t('community.communityLink')"
            >
              <b-form-input
                :disabled="!isEdit"
                v-model="form.website"
                :placeholder="$t('community.inputLink')"
              ></b-form-input>
              <span>{{ $t('cl.optional') }}</span>
            </b-form-group>
            <!-- community description -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="8"
              :label="$t('community.communityDesc')"
            >
              <b-form-textarea
                :disabled="!isEdit"
                v-model="form.description"
                :placeholder="$t('community.inputDesc')"
                rows="5"
              ></b-form-textarea>
            </b-form-group>
            <!-- community theme -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="5"
              :label="$t('community.communityThemeColor')"
            >
              <input class="p-2 w-50" type="color" :disabled="!isEdit" v-model="form.color"/>
            </b-form-group>
            <!-- community logo -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="8"
              class="logo-form"
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
                      <div class="add-text">{{ $t("community.uploadLogo") }}</div>
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
              <div class="font12 text-grey-light mt-1" v-if="isEdit">
                {{ $t("community.picTip", { size: "200*200" }) }}
              </div>
            </b-form-group>
            <!-- community poster -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="8"
              class="cover-form"
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
              label-cols-md="2"
              content-cols-md="5"
              label=""
            >
              <button class="primary-btn" @click="showTips">
                {{ $t("community.commit") }}
              </button>
            </b-form-group>
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
import { uploadImage } from "@/utils/helper";
import UploadLoading from "@/components/ToolsComponents/UploadLoading";
import {
  completeCommunityInfo,
  getMyCommunityInfo,
  getAllCommunities
} from "@/utils/web3/community";
import { handleApiErrCode, sleep } from "@/utils/helper";
import { mapGetters } from "vuex";
import Step from '@/components/ToolsComponents/Step'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'EditCommunityInfo',
  components: { UploadLoading, Step, VueCropper },
  data () {
    return {
      logo: null,
      coverImg: null,
      chargeValue: 0,
      inputDevAddress: '',
      inputDevRatio: '',
      inputBlogTag:'',
      form: {
        id: "",
        name: "",
        website: "",
        description: "",
        icon: "",
        poster: "",
        pools: [],
        blogTag: '',
        color: '#ffdb1b'
      },
      logoPreviewSrc: "",
      logoUploadLoading: false,
      coverPreviewSrc: "",
      coverUploadLoading: false,
      type: null,
      isEdit: false,
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
      cTokenAddress: "",
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
    type(newValue, oldValue) {
      // type : null , create, edit
      this.isEdit = !!newValue;
    }
  },
  async mounted() {
    this.type = this.$route.query.type;
    this.isEdit = !!this.type;
    try {
      const communityInfo = await getMyCommunityInfo();
      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }
      this.canEdit = true;
      this.form = {...communityInfo};
      this.form.color = this.form.color ?? '#ffdb1b';
      if (!communityInfo.name) {
        this.form.id = communityInfo.id;
        return;
      }
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
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
    clipCircleImg(imgSrc) {
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
    valideInfos() {
      const { name, website, description, icon, poster } = this.form;
      let tips = null;
      if (website && website.length > 0) {
        const regUrl = '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
        const res = website.match(regUrl)
        console.log({res});
        if (!res) {
          tips = this.$t("tip.needRightUrl")
          this.$bvToast.toast(tips, {
            title: this.$t("tip.tips"),
            autoHideDelay: 5000,
            variant: "warning",
          });
          return false;
        }
      }

      if (!name || name.length === 0) {
        tips = this.$t("tip.needName");
      } else if(name && name.length > 16){
        tips = this.$t("tip.communityNameLimit", {count: 16})
      } else if (!description || description.length === 0) {
        tips = this.$t("tip.needDescription");
      } else if (!icon || icon.length === 0) {
        tips = this.$t("tip.needIcon");
      } else if (!poster || poster.length === 0) {
        tips = this.$t("tip.needPoster");
      } else {
        return true;
      }
      this.$bvToast.toast(tips, {
        title: this.$t("tip.tips"),
        autoHideDelay: 5000,
        variant: "warning",
      });
      return false;
    },
    async showTips() {
      console.log(this.form);
      if (this.valideInfos()) {
        this.showSignatureTip = true;
      }
    },
    async onConfirm() {
      try {
        this.uploading = true;
        const resCode = await completeCommunityInfo(this.form, this.type);

        // go to community dashboard
        this.$bvToast.toast(this.$t("tip.completeCommunityInfoSuccess"), {
          title: this.$t("tip.tips"),
          variant: "success",
        });
        await sleep(2)
        await Promise.all([
          getAllCommunities(true),
          getMyCommunityInfo(true)
        ]);
        await sleep(1);
        this.$router.replace("/community-setting/staking");
      } catch (e) {
        const handleRes = handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      } finally {
        this.uploading = false;
      }
    },
    gotoCreate() {
      this.$router.push("/community/create-economy");
    },
  },
};
</script>

<style scoped lang="scss">
.community-info-card {
  @include card(1.6rem 1.2rem, white, none, auto);
  @include single-color-bg(0.3rem 1rem);
  background-position: left 1.6rem;
  .title {
    font-size: 1rem;
    line-height: 1rem;
    margin-bottom: 2rem;
  }
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
