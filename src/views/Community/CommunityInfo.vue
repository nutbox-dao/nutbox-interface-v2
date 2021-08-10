<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div
        class="page-back-text-icon font20"
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
          @click="type = 'edit'"
        >
          {{ $t("community.edit") }}
        </button>
      </div>
    </div>
    <div class="mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">{{ $t("community.communityInfo") }}</div>
        <!-- community name -->
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
          <!-- community balance -->
          <b-form-group
            v-if="!isMintable && !isEdit"
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.communityBalance')"
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  v-model="communityBalanceValue"
                  :placeholder="$t('community.communityBalance')"
                >
                </b-form-input>
                <span class="c-append">{{ cToken.symbol }}</span>
              </div>
              <button class="primary-btn ml-2" style="width: 8rem" @click="showChargeTip = true">
                {{ this.$t("community.charge") }}
              </button>
            </div>
          </b-form-group>
          <!-- community dev address -->
          <b-form-group
            v-if="!isEdit"
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.devAddress')"
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  :placeholder="devAddress || $t('community.devAddress')"
                >
                </b-form-input>
                <span></span>
              </div>
              <button class="primary-btn ml-2" style="width: 8rem" @click="showDevAddressTip = true">
                {{ this.$t("commen.update") }}
              </button>
            </div>
          </b-form-group>
          <!-- community dev ratio -->
          <b-form-group
            v-if="!isEdit"
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.devRatio')"
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  type="number"
                  :placeholder="(devRatio / 100).toFixed(2).toString()"
                >
                </b-form-input>
                <span class="c-append">%</span>
              </div>
              <button class="primary-btn ml-2" style="width: 8rem" @click="showDevRatioTip = true">
                {{ this.$t("commen.update") }}
              </button>
            </div>
          </b-form-group>
          <!-- commit button -->
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
    <!-- charge balance tip -->
    <b-modal
      v-model="showChargeTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.communityCharge") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="label flex-between-start">
            <span>{{ $t("community.charge") }}</span>
            <span class="text-right"
              >{{ $t("wallet.balance") }}:
              {{ cTokenBalance | amountForm }}</span
            >
          </div>
          <div class="input-box flex-between-center">
            <input
              style="flex: 1"
              type="number"
              v-model="chargeValue"
              placeholder="0"
            />
            <div class="ml-2">
              <button
                class="primary-btn"
                @click="fillMax"
                :disabled="charging"
              >
                {{ $t("commen.max") }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showChargeTip = false"
            :disabled="charging || approving"
          >
            <b-spinner small type="grow" v-show="charging || approving" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="charge" :disabled="charging" v-if="ctokenApprovement">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("community.confirmCharge") }}
          </button>
          <button
            v-else
            class="primary-btn"
            @click="approve"
            :disabled="approving"
          >
            <b-spinner small type="grow" v-show="approving" />
            {{ $t('commen.approveContract') }}
          </button>
        </div>
      </div>
    </b-modal>
        <!-- dev address tip -->
    <b-modal
      v-model="showDevAddressTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.devAddress") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <input
              style="flex: 1"
              v-model="inputDevAddress"
              :placeholder="$t('community.inputDevAddress')"
            />
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showDevAddressTip = false"
            :disabled="updatingAddress"
          >
            <b-spinner small type="grow" v-show="updatingAddress" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="updateAddress" :disabled="updatingAddress">
            <b-spinner small type="grow" v-show="charging" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
       <!-- dev ratio tip -->
    <b-modal
      v-model="showDevRatioTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.devRatio") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group">
            <input
              style="flex: 1"
              :step="0.01"
              :max="100"
              type="number"
              v-model="inputDevRatio"
              :placeholder="$t('community.inputDevRatio')"
            />
            <span class="c-append">%</span>
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showDevRatioTip = false"
            :disabled="updatingDevRatio"
          >
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="updateDevRatio" :disabled="updatingDevRatio">
            <b-spinner small type="grow" v-show="updatingDevRatio" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
    <!-- show signature tip -->
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
            {{ $t('commen.cancel') }}
          </button>
        </div>
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
  getAllCommunities,
  chargeCommunityBalance,
  approveCommunityBalance
} from "@/utils/web3/community";
import { getCToken } from "@/utils/web3/asset"
import { handleApiErrCode, sleep } from "@/utils/helper";
import { mapState } from "vuex";
import BN from 'bn.js'

export default {
  name: "EditCommunityInfo",
  components: { UploadLoading },
  data() {
    return {
      logo: null,
      coverImg: null,
      chargeValue: 0,
      inputDevAddress: '',
      inputDevRatio: '',
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
      canEdit: false,
      noCommunity: false,
      showSignatureTip: false,
      showChargeTip: false,
      showDevAddressTip: false,
      showDevRatioTip: false,
      uploading: false,
      approving:false,
      charging: false,
      cToken: {},
      isMintable: true,
      cTokenAddress: '',
      updatingAddress: false,
      updatingDevRatio: false
    };
  },
  computed: {
    ...mapState("web3", ["communityBalance", "userBalances", "ctokenApprovement", "devAddress", "devRatio"]),
    communityBalanceValue(){
      if (this.communityBalance){
        return (this.communityBalance.toString() / 1e18).toFixed(6)
      }else{
        return 0;
      }
    },
    cTokenBalance() {
      if (!this.userBalances || !this.userBalances[this.cTokenAddress]) {
        return 0;
      }
      return this.userBalances[this.cTokenAddress].toString() / 1e18
    }
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
    try {
      const communityInfo = await getMyCommunityInfo();
      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }
      this.canEdit = true;
      const cToken = await getCToken(communityInfo.id)
      this.cToken = cToken
      this.isMintable = cToken.isMintable
      this.cTokenAddress = cToken.address
      if (!communityInfo.name) {
        this.form.id = communityInfo.id;
        return;
      }
      this.form = communityInfo;

    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
  methods: {
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
    async approve() {
      try{
        this.approving = true;
        const hash = await approveCommunityBalance(this.cTokenAddress);
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant:'success'
        })
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.approving = false;
      }
    },
    fillMax() {
      this.chargeValue = this.cTokenBalance
    },
    async charge() {
      try{
        this.charging = true;
        if (Number(this.chargeValue) <= 0) {
          this.$bvToast.toast(this.$t('error.inputError'), {
            title: this.$t("tip.tips"),
            autoHideDelay: 5000,
            variant: "warning",
          });
          return;
        }
        const decimal = new BN(10).pow(new BN(18))
        const amount = new BN(Number(this.chargeValue * 1e6)).mul(decimal).divn(1e6)
        const hash = await chargeCommunityBalance(amount)
        this.$bvToast.toast(this.$t('community.chargeSuccess'), {
          title:this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showChargeTip = false
        }, 2000);
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.charging = false
      }
    },
    updateAddress(){

    },
    updateDevRatio() {

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
        await Promise.all([getAllCommunities(true), getMyCommunityInfo(true)])
        await sleep(1);
        this.$router.push("/community/pool-dashboard");
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
</style>
