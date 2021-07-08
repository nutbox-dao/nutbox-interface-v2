<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div
        class="page-back-text-icon font20"
        style="line-height: 1rem"
        @click="isEdit ? (isEdit = false) : $router.back()"
      >
        {{
          (isEdit ? $t("community." + type) : "") +
          $t("community.communityInfo")
        }}
      </div>
      <div v-if="!isEdit">
        <button class="primary-btn pl-3 pr-3" @click="isEdit = true">
          {{ $t("community.edit") }}
        </button>
      </div>
    </div>
    <div class="scroll-content mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">{{ $t("community.communityInfo") }}</div>
        <b-form class="custom-form pl-md-3">
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
          </b-form-group>
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
                  <img class="logo-preview" v-if="logoPreviewSrc" :src="logoPreviewSrc" alt="">
                  <UploadLoading v-if="logoUploadLoading" />
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-light mt-1">
              {{ $t("community.picTip", { size: "200*200" }) }}
            </div>
          </b-form-group>
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
                  <img class="cover-preview" v-if="coverPreviewSrc" :src="coverPreviewSrc" alt="">
                  <UploadLoading v-if="coverUploadLoading"/>
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-light mt-1">
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
        </b-form>
      </div>
    </div>
    <b-modal
      v-model="noCommunity"
      modal-class="custom-modal"
      size="sm"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <img class="close-btn" src="~@/static/images/close.svg" alt="" @click="noCommunity=false"/>
        <div class="font20 font-bold text-center my-5">
          Havn't Create Community
        </div>
        <button class="primary-btn" @click="gotoCreate">
          Go to create a community!
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
        <img class="close-btn" src="~@/static/images/close.svg"
             alt="" @click="showSignatureTip=false"/>
        <div class="my-5">
          Upload community info need you sign this info with your wallet.This will
          not cost you any asset or fee.Please be assured.
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button class="primary-btn" @click="onConfirm" :disabled="uploading">
            <b-spinner small type="grow" v-show="uploading" />
            Sign & upload data
          </button>
          <button
            class="primary-btn primary-btn-outline"
            @click="showSignatureTip = false"
            :disabled="uploading"
          >
            <b-spinner small type="grow" v-show="uploading" />
            Cancel
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { uploadImage } from '@/utils/helper'
import UploadLoading from '@/components/ToolsComponents/UploadLoading'
import {
  compliteCommunityInfo,
  getMyCommunityInfo,
} from "@/utils/web3/community";
import { handleApiErrCode, sleep } from "@/utils/helper";

export default {
  name: 'EditCommunityInfo',
  components: { UploadLoading },
  data () {
    return {
      logo: null,
      coverImg: null,
      form: {
        id: "",
        name: "",
        website: "",
        description: "",
        icon: "",
        poster: "",
        pools: [],
      },
      logoPreviewSrc: "",
      logoUploadLoading: false,
      coverPreviewSrc: "",
      coverUploadLoading: false,
      type: null,
      isEdit: false,
      noCommunity: false,
      showSignatureTip: true,
      uploading: false,
    };
  },
  watch: {
    type(newValue, oldValue) {
      this.isEdit = !!newValue;
    },
  },
  async mounted() {
    this.type = this.$route.query.type;
    this.isEdit = !!this.type;
    const communityInfo = await getMyCommunityInfo();
    if (!communityInfo) {
      // Havn't create feast
      this.noCommunity = true;
      return;
    }
    this.form = communityInfo;
  },
  methods: {
    setFormInfo() {
      this.form = {
        name: "BML",
        website: "http://www.bml.com",
        introduction:
          "Acala是全球首个去中心化开放式金融联盟、波卡生态金融中心。Acala是全球首个去中心化开放式金融联盟、波卡生态金融中心。",
        logoUrl: "https://cdn.wherein.mobi/polkadot/token/logo/crab.png",
        coverUrl:
          "https://cdn.wherein.mobi/nutbox/slotauction/poster/BML-poster.png",
      };
    },
    async updateLogo(file) {
      if (!this.logo) return;
      this.logoUploadLoading = true;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (res) => {
        this.logoPreviewSrc = res.target.result;
      };
      try {
        this.form.icon = await uploadImage(this.logo);
        this.logoUploadLoading = false;
      } catch (e) {
        this.$bvToast.toast(this.$t("tip.picUploadFail"), {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning",
        });
        this.logo = null;
        this.form.icon = null;
        this.logoUploadLoading = false;
      }
    },
    async updateCover(file) {
      if (!this.coverImg) return;
      this.coverUploadLoading = true;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (res) => {
        this.coverPreviewSrc = res.target.result;
      };
      try {
        this.form.poster = await uploadImage(this.coverImg);
        this.coverUploadLoading = false;
      } catch (e) {
        this.$bvToast.toast(this.$t("tip.picUploadFail"), {
          title: this.$t("tip.tips"),
          autoHideDelay: 5000,
          variant: "warning",
        });
        this.coverImg = null;
        this.form.poster = null;
      }
    },
    valideInfos() {
      const { name, website, description, icon, poster } = this.form;
      let tips = null;
      if (!name || name.length === 0) {
        tips = this.$t("tip.needName");
      } else if (!website || website.length === 0) {
        tips = this.$t("tip.needWebsit");
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
      if (this.valideInfos()) {
        this.showSignatureTip = true;
      }
    },
    async onConfirm() {
      try {
        this.uploading = true;
        const resCode = await compliteCommunityInfo(this.form, this.type);
        const handleRes = handleApiErrCode(resCode, (info, params) => {
          this.$bvToast.toast(info, params);
        });
        if (handleRes) {
          // go to community dashboard
          this.$bvToast.toast(this.$t("tip.compliteCommunityInfoSuccess"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          await sleep(3);
          this.$router.push("/community/pool-dashboard");
        }
      } catch (e) {
        this.$bvToast.toast(this.$t("error.networkError"), {
          title: this.$t("error.error"),
          variant: "danger",
        });
      } finally {
        this.uploading = false;
      }

      // this.isEdit = false
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
</style>
