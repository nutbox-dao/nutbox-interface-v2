<template>
  <div class="page-container">
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <template v-else>
      <template v-if="createState === 0">
        <div class="page-view-sidebar">
          <b-nav vertical>
            <b-nav-item to="/community-setting/profile">{{ $t('community.communityInfo') }}</b-nav-item>
            <b-nav-item to="/community-setting/asset">{{ $t('asset.asset') }}</b-nav-item>
            <b-nav-item to="/community-setting/staking">{{ $t('community.pool') }}</b-nav-item>
            <b-nav-item to="/community-setting/social">{{ $t('community.social') }}</b-nav-item>
            <b-nav-item to="/community-setting/vote">{{ $t('nps.nps') }}</b-nav-item>
            <b-nav-item to="/community-setting/game">{{ $t('game.game') }}</b-nav-item>
          </b-nav>
        </div>
        <div class="side-page-view-content">
          <div class="container">
            <div class="view-top-header m-view-top-header flex-between-center">
              <div class="nav-box nav-box-bg">
                <div class="nav">
                  <b-nav-item to="/community-setting/profile">{{ $t('community.communityInfo') }}</b-nav-item>
                  <b-nav-item to="/community-setting/asset">{{ $t('asset.asset') }}</b-nav-item>
                  <b-nav-item to="/community-setting/staking">{{ $t('community.pool') }}</b-nav-item>
                  <b-nav-item to="/community-setting/social">{{ $t('community.social') }}</b-nav-item>
                  <b-nav-item to="/community-setting/vote">{{ $t('nps.nps') }}</b-nav-item>
                  <b-nav-item to="/community-setting/game">{{ $t('game.game') }}</b-nav-item>
                </div>
              </div>
            </div>
          </div>
          <router-view></router-view>
        </div>
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </template>
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
  publishBlog
} from "@/utils/web3/community";
import { handleApiErrCode, sleep } from "@/utils/helper";
import { mapState, mapGetters } from "vuex";
import BN from 'bn.js'
import Step from '@/components/ToolsComponents/Step'
import { VueCropper } from 'vue-cropper'
import { createNewCommunity, setCommunityInfo, subscribeCommunity } from '@/utils/steem/steem'
import { getMyOpenedPools } from '@/utils/web3/pool'

export default {
  name: 'Index',
  components: { UploadLoading, Step, VueCropper, Login },
  data () {
    return {
      noCommunity: false,
      cToken: {},
      cTokenAddress: '',
      state: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters('web3', ['createState']),
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

    try {
      const communityInfo = await getMyCommunityInfo();
      if (!communityInfo) {
        // Havn't create feast
        this.noCommunity = true;
        return;
      }
      const myPools = await getMyOpenedPools()
      if (!communityInfo.name) {
        this.type = 'create'
        this.$router.replace('/community-setting/profile?type=create')
      }else if(this.createState === 3) {
        this.$router.replace('/community-setting/add-pool')
      }
      this.loading = false
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
.view-top-header {
  overflow-x: auto;
}
.m-view-top-header {
  padding-bottom: 0;
}
</style>
