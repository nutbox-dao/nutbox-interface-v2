<template>
  <div class="page-view-content">
    <div class="scroll-content container">
      <div class="view-top-header">
        <div class="flex-between-center w-100">
          <div
            class="font20"
            :class="
              $route.query.type === 'create'
                ? 'page-back-text-icon'
                : 'page-title-line'
            "
            style="line-height: 1rem"
            @click="isEdit ? (type = null) : $router.back()"
          >
            {{
              (isEdit ? $t("game." + type) : "") + $t("community.communityInfo")
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
          <!-- game name -->
          <div class="custom-form pl-md-3">
            <b-form-group
              label-cols-md="2"
              content-cols-md="5"
              :label="$t('game.gameName')"
            >
              <b-form-input
                :disabled="!isEdit"
                v-model="form.gameName"
                :placeholder="$t('game.inputGameName')"
              ></b-form-input>
            </b-form-group>
            <!-- game link -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="5"
              :label="$t('game.gameLink')"
            >
              <b-form-input
                :disabled="!isEdit"
                v-model="form.gameSite"
                :placeholder="$t('game.inputGameLink')"
              ></b-form-input>
            </b-form-group>
            <!-- game description -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="8"
              :label="$t('game.gameDesc')"
            >
              <b-form-textarea
                :disabled="!isEdit"
                v-model="form.gameIntro"
                :placeholder="$t('game.inputGameDesc')"
                rows="5"
              ></b-form-textarea>
            </b-form-group>
            <!-- game category -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="3"
              :label="$t('game.gameCategory')"
            >
              <b-dropdown
                class="c-dropdown w-100"
                menu-class="full-dropdown-menu"
              >
                <template #button-content>
                  <div
                    class="c-dropdown-btn w-100 d-flex justify-content-between"
                    style="height: 2.4rem"
                  >
                    <span>{{ form.gameType || "Chose" }}</span>
                    <i class="dropdown-icon ml-3"></i>
                  </div>
                </template>
                <b-dropdown-item @click="form.gameType = 'recommend'"
                  >recommend</b-dropdown-item
                >
                <b-dropdown-item @click="form.gameType = 'popular'"
                  >popular</b-dropdown-item
                >
                <b-dropdown-item @click="form.gameType = 'others'"
                  >others</b-dropdown-item
                >
              </b-dropdown>
            </b-form-group>
            <!-- game logo -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="8"
              class="logo-form"
              :label="$t('game.gameLogo')"
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
                    <template v-if="form.gameLogo">
                      <img class="cover-preview" :src="form.gameLogo" alt="" />
                      <div v-if="isEdit" class="edit-mask">
                        <span>{{ $t("game.edit") }}<br />LOGO</span>
                      </div>
                    </template>
                    <template v-else>
                      <img
                        class="add-icon"
                        src="~@/static/images/add.svg"
                        alt=""
                      />
                      <div class="add-text">
                        {{ $t("community.uploadLogo") }}
                      </div>
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
            <!-- game poster -->
            <b-form-group
              label-cols-md="2"
              content-cols-md="6"
              class="cover-form"
              :label="$t('game.gamePoster')"
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
                    <template v-if="form.gameCover">
                      <img class="cover-preview" :src="form.gameCover" alt="" />
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
                {{ $t("community.picTip", { size: "714 * 250" }) }}
              </div>
            </b-form-group>
            <b-form-group
              v-if="isEdit"
              label-cols-md="2"
              content-cols-md="5"
              label=""
            >
              <button
                class="primary-btn"
                @click="submitGame"
                :disabled="commiting"
              >
                <b-spinner small type="grow" v-show="commiting" />

                {{ $t("community.commit") }}
              </button>
            </b-form-group>
          </div>
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
      no-close-on-backdrop
    >
      <div class="cropper-container">
        <canvas id="cropper-canvas"></canvas>
        <vueCropper
          ref="cropper"
          :class="logoUploadLoading ? 'cropper-rounded-circle' : ''"
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

    <b-modal
      v-model="noGame"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center my-5">
          {{ $t("game.noGame") }}
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { handleApiErrCode } from "@/utils/helper";
import { uploadImage } from "@/utils/helper";
import UploadLoading from "@/components/ToolsComponents/UploadLoading";
import { mapGetters } from "vuex";
import { VueCropper } from "vue-cropper";
import { completeGame, getGame } from "@/utils/web3/game";
export default {
  name: "EditGameInfo",
  components: { UploadLoading, VueCropper },
  data() {
    return {
      logo: null,
      coverImg: null,
      form: {
        id: "",
        gameName: "",
        gameSite: "",
        gameIntro: "",
        gameType: "",
        gameLogo: "",
        gameCover: "",
        userId: "",
        created: "",
      },
      logoPreviewSrc: "",
      logoUploadLoading: false,
      coverPreviewSrc: "",
      coverUploadLoading: false,
      type: null,
      isEdit: false,
      canEdit: false,
      showStep: false,
      cropperModal: false,
      cropperImgSrc: "",
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      commiting: false,
      noGame: false,
    };
  },
  computed: {
    ...mapGetters("web3", ["createState"]),
  },
  watch: {
    type(newValue, oldValue) {
      // type : null , create, edit
      this.isEdit = !!newValue;
    },
  },
  async mounted() {
    this.type = this.$route.query.type;
    this.isEdit = !!this.type;
    this.form.id = this.$route.query.gameId;

    try {
      if (this.form.id && this.type == "edit") {
        const gameInfo = await getGame(this.form.id);
        if (!gameInfo) {
          // Havn't create feast
          this.noGame = true;
          return;
        }
        console.log(gameInfo);
        this.canEdit = true;
        this.form = { ...gameInfo[0] };
      }
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
  methods: {
    valideInfos() {
      const { gameName, gameSite, gameIntro, gameType, gameLogo, gameCover } =
        this.form;
      let tips = null;
      if (!gameSite || gameSite.length > 0) {
        const regUrl =
          "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";
        const res = gameSite && gameSite.match(regUrl);
        if (!res) {
          tips = this.$t("tip.needRightUrl");
          this.$bvToast.toast(tips, {
            title: this.$t("tip.tips"),
            autoHideDelay: 5000,
            variant: "warning",
          });
          return false;
        }
      }

      if (!gameName || gameName.length === 0) {
        tips = this.$t("tip.needGameName");
      } else if (gameName && gameName.length > 16) {
        tips = this.$t("tip.gameNameLimit", { count: 16 });
      } else if (!gameIntro || gameIntro.length === 0) {
        tips = this.$t("tip.needDescription");
      } else if (!gameType || gameType.length === 0) {
        tips = this.$t("tip.needGameType");
      } else if (!gameLogo || gameLogo.length === 0) {
        tips = this.$t("tip.needIcon");
      } else if (!gameCover || gameCover.length === 0) {
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
    async submitGame() {
      try {
        if (!this.valideInfos()) {
          return false;
        }
        this.commiting = true;

        const result = await completeGame(this.form, this.type);

        if (result.code == 0) {
          this.$bvToast.toast(this.$t("tip.completeGameSuccess"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          /* this.$router.replace("/nps/proposal-space/" + this.form.communityId); */
          this.$router.replace("/community-setting/game");
        }
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param);
        });
      } finally {
        this.commiting = false;
      }
    },
    onCancel() {
      this.cropperModal = false;
      if (this.logoUploadLoading) {
        this.logo = null;
        this.logoUploadLoading = false;
      }
      if (this.coverUploadLoading) {
        this.coverImg = null;
        this.coverUploadLoading = false;
      }
    },
    clipCircleImg(imgSrc) {
      return new Promise((resolve) => {
        const canvas = document.getElementById("cropper-canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          const cw = (canvas.width = img.width);
          const ch = (canvas.height = img.height);
          ctx.beginPath();
          ctx.arc(cw / 2, ch / 2, ch / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0);
        };
        const timer = setInterval(function () {
          if (img.complete) {
            clearInterval(timer);
            resolve(canvas);
          }
        }, 50);
      });
    },
    completeCropAndUpload() {
      if (this.logoUploadLoading) {
        this.$refs.cropper.getCropData(async (data) => {
          const canvas = await this.clipCircleImg(data);
          this.logoPreviewSrc = canvas.toDataURL("image/png");
          this.cropperModal = false;
          canvas.toBlob(async (data) => {
            try {
              this.form.gameLogo = await uploadImage(data);
              this.logoUploadLoading = false;
            } catch (e) {
              this.$bvToast.toast(this.$t("tip.picUploadFail"), {
                title: this.$t("tip.tips"),
                autoHideDelay: 5000,
                variant: "warning",
              });
              this.logo = null;
              this.form.gameLogo = null;
              this.logoUploadLoading = false;
            }
          });
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.coverPreviewSrc = data;
          this.cropperModal = false;
        });
        this.$refs.cropper.getCropBlob(async (data) => {
          try {
            this.form.gameCover = await uploadImage(data);
            this.coverUploadLoading = false;
          } catch (e) {
            this.$bvToast.toast(this.$t("tip.picUploadFail"), {
              title: this.$t("tip.tips"),
              autoHideDelay: 5000,
              variant: "warning",
            });
            this.coverImg = null;
            this.form.gameCover = null;
          }
        });
      }
    },
    clickEdit() {
      this.type = this.form.name ? "edit" : "create";
    },
    async updateLogo(file) {
      if (!this.logo) return;
      this.logoUploadLoading = true;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result;
        this.cropperModal = true;
        this.cropFixedNumber = [1, 1];
        this.cropImgSize = [200, 200];
      };
    },
    async updateCover(file) {
      if (!this.coverImg) return;
      this.coverUploadLoading = true;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result;
        this.cropperModal = true;
        this.cropFixedNumber = [714, 250];
        this.cropImgSize = [714, 250];
      };
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
