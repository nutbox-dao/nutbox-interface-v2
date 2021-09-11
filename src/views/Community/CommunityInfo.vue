<template>
  <div class="page-view-content">
    <Step v-show="showStep" :current-step="2"></Step>
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
          <!-- community blog -->
          <b-form-group
            v-if="!isEdit"
            label-cols-md="2"
            content-cols-md="8"
            :label="$t('community.communityBlog')"
          >
            <div class="d-flex">
              <div class="c-input-group">
                <b-form-input
                  :disabled="true"
                  type="text"
                  :placeholder="form.blogTag || $t('community.blogTag')"
                >
                </b-form-input>
              </div>
              <button class="primary-btn ml-2" v-if="state === 'create'" style="width: 8rem" @click="showBlogTip = true">
                {{ $t('community.createBlog') }}
              </button>
              <button class="primary-btn ml-2" v-if="state === 'connectSteem'" style="width: 8rem" @click="showSteemLogin = true">
                {{ $t('wallet.connectSteem') }}
              </button>
              <button class="primary-btn ml-2" v-if="state === 'publish'" style="width: 8rem" :disabled='publishingBlog' @click="publishBlog">
                <b-spinner small type="grow" v-show="publishingBlog" />
                {{ $t('community.publishBlog') }}
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
        <button class="primary-btn" @click="onCancel">取消</button>
        <button class="primary-btn" @click="completeCropAndUpload">完成</button>
      </div>
    </b-modal>
    <!-- create blog tip -->
    <b-modal
      v-model="showBlogTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4">
          {{ $t("community.createBlog") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <p>
              {{ $t('community.createBlogMemo') }}
            </p>
          </div>
        </div>
        <div class="c-text-info">
          <span>{{ $t('community.communityName') }}:</span>
          <p>{{ form.name }}</p>
        </div>
        <div class="c-text-info">
          <span>{{ $t('community.blogTag') }}:</span>
          <p>{{ blogTag }}</p>
        </div>
        <div class="c-text-info">
          <span>{{ $t('community.blogMainPassword') }}:</span>
          <p>{{ blogMainPassword }}</p>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showBlogTip = false"
            :disabled="creatingBlog"
          >
            <b-spinner small type="grow" v-show="creatingBlog" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="createBlog" :disabled="creatingBlog">
            <b-spinner small type="grow" v-show="creatingBlog" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
      <div class="tip-modal">
        <div class="font20 font-bold text-center mb-4" style="margin-top:1.2rem">
          {{ $t("community.bindBlog") }}
        </div>
         <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <p>
              {{ $t('community.bindBlogMemo') }}
            </p>
          </div>
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group">
            <input
              style="flex: 1"
              v-model="inputBlogTag"
              :placeholder="$t('community.inputBlogTag')"
            />
            </div>
          </div>
        </div>
        <div class="flex-between-center" style="gap: 2rem">
          <button
            class="primary-btn primary-btn-outline"
            @click="showBlogTip = false"
            :disabled="creatingBlog"
          >
            <b-spinner small type="grow" v-show="creatingBlog" />
            {{ $t('commen.cancel') }}
          </button>
          <button class="primary-btn" @click="bindBlog" :disabled="creatingBlog">
            <b-spinner small type="grow" v-show="creatingBlog" />
            {{ $t("commen.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
    <Login type='STEEM' v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
  </div>
</template>

<script>
import { uploadImage } from "@/utils/helper";
import UploadLoading from "@/components/ToolsComponents/UploadLoading";
import Login from '@/components/ToolsComponents/Login'
import {
  completeCommunityInfo,
  getMyCommunityInfo,
  getAllCommunities,
  chargeCommunityBalance,
  approveCommunityBalance,
  setDevAddress,
  setDevRatio,
  monitorCommunity,
  publishBlog
} from "@/utils/web3/community";
import { getCToken } from "@/utils/web3/asset"
import { handleApiErrCode, sleep } from "@/utils/helper";
import { mapState, mapGetters } from "vuex";
import BN from 'bn.js'
import Step from '@/components/ToolsComponents/Step'
import { VueCropper } from 'vue-cropper'
import { generateNewHiveAccount, generatePassword, createNewCommunity, setCommunityInfo, subscribeCommunity } from '@/utils/steem/steem'

export default {
  name: 'EditCommunityInfo',
  components: { UploadLoading, Step, VueCropper, Login },
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
        blogTag: ''
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
      approving:false,
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
    ...mapState("web3", ["communityBalance", "userBalances", "ctokenApprovement", "devAddress", "devRatio"]),
    ...mapGetters('web3', ['createState']),
    ...mapState("steem", ['steemAccount']),
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
    steemAccount(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.state = 'create'
      }
    }
  },
  async mounted() {
    this.type = this.$route.query.type;
    this.isEdit = !!this.type;
    // create hive account
    try{
      this.blogTag = await generateNewHiveAccount()
      this.blogMainPassword = generatePassword()
    }catch(e) {
      console.log('generateNewHiveAccount fail',e)
    }

    try {
      const communityInfo = await getMyCommunityInfo();
      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }
      this.form = {...communityInfo};
      if (!communityInfo.name) this.showStep = true;
      this.form.blogTag = communityInfo.blogTag;
      if (this.form.blogTag){
        this.state = ''
      }else{
        if(!this.steemAccount){
          this.state = 'connectSteem'
        }else{
          this.state = 'create'
        }
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
    completeCropAndUpload () {
      this.cropperModal = false
      this.$refs.cropper.getCropData((data) => {
        if (this.logoUploadLoading) this.logoPreviewSrc = data
        if (this.coverUploadLoading) this.coverPreviewSrc = data
      })
      this.$refs.cropper.getCropBlob(async (data) => {
        if (this.logoUploadLoading) {
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
        }
        if (this.coverUploadLoading) {
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
        }
      })
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
        const chargeValue = Number(this.chargeValue)
        if (!chargeValue || chargeValue <= 0) {
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
    async updateAddress(){
      try{
        this.updatingAddress = true
        await setDevAddress(this.inputDevAddress)
        this.$bvToast.toast(this.$t(),{
          title:this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showDevAddressTip = false
        }, 1000)
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.updatingAddress = false
      }
    },
    async updateDevRatio() {
      try{
        this.updatingDevRatio = true
        const r = parseInt(parseFloat(this.inputDevRatio) * 100)
        await setDevRatio(r)
         this.$bvToast.toast(this.$t(),{
          title:this.$t('tip.success'),
          variant: 'success'
        })
        setTimeout(() => {
          this.showDevRatioTip = false
        }, 1000)
      }catch(e){
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.updatingDevRatio = false
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
        await Promise.all([getAllCommunities(true), getMyCommunityInfo(true), monitorCommunity()])
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
    async bindBlog() {
      const reg = /^hive-[1-3]\d{3,6}$/
      const res = reg.test(this.inputBlogTag)
      if (!res){
        this.$bvToast.toast(this.$t('tip.inputRightBlogTag'), {
          title: this.$t('tip.tips'),
          variant:'warning'
        })
        return;
      }
      try{
        this.creatingBlog = true
        await publishBlog(this.inputBlogTag)
        this.state = ''
        this.form.blogTag = this.inputBlogTag;
        this.$bvToast.toast(this.$t('community.publishBlogSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.showBlogTip = false
      }catch(e){
        handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      }finally{
        this.creatingBlog = false;
      }
    },
    async createBlog(){
      try{
        this.creatingBlog = true
        // create new account
        const res = await createNewCommunity(this.steemAccount, this.blogTag, this.blogMainPassword)
        if(res && res.success){
          // set community info
          setCommunityInfo(this.steemAccount, this.blogTag, this.blogMainPassword, this.form.name, this.form.description)
          // subscribe account
          const res = await subscribeCommunity(this.steemAccount, this.blogTag)
          if (res && res.success){
            this.showBlogTip = false;
            this.$bvToast.toast(this.$t('tip.createBlogSuccess'), {
              title: this.$t('tip.success'),
              variant: 'success'
            })
            // update
            this.state = 'publish'
            this.form.blogTag = this.blogTag
          }else if(res && !res.success){
            this.$bvToast.toast(res.message, {
              title: res.error,
              variant: 'error'
            })
          }
        }
      }catch(e){
        console.log('create account fail', e);
        handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      }finally{
        this.creatingBlog = false;
      }
    },
    async publishBlog(){
      try{
        this.publishingBlog = true
        await publishBlog(this.blogTag)
        this.state = ''
        this.$bvToast.toast(this.$t('community.publishBlogSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
      }catch(e){
        handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      }finally{
        this.publishingBlog = false
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
