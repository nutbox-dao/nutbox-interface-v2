<template>
  <div class="container scroll-content">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">{{ $t('commen.social') }}</div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form text-left">
        <b-form-group label-cols-md="2" content-cols-md="7" :label="$t('community.communityBlog')"
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input :disabled='true' :placeholder="blogTag || $t('community.blogTag')"></b-form-input>
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
        <b-form-group label-cols-md="2" content-cols-md="7" :label="$t('community.socialMedial')"
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon twitter">Twitter</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.twitter" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon discord">Discord</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.discord" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon telegram">Telegram</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.telegram" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon facebook">Facebook</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.facebook" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon github">Github</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.github" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon document">{{ $t('commen.docs') }}</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.document" :placeholder="$t('cl.optional')"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="5" label="">
          <button class="primary-btn" @click="showSignatureTip = true">
            {{ $t("commen.update") }}
          </button>
        </b-form-group>
      </div>
    </div>
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
          <p>{{ communityInfo.name }}</p>
        </div>
        <div class="c-text-info">
          <span>{{ $t('community.blogTag') }}:</span>
          <p>{{ newBlogTag }}</p>
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
import { mapState } from 'vuex'
import { getMyCommunityInfo, udpateSocialInfo, publishBlog } from '@/utils/web3/community'
import { generateNewHiveAccount, generatePassword, createNewCommunity, setCommunityInfo, subscribeCommunity } from "@/utils/steem/steem"
import Login from '@/components/ToolsComponents/Login'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: 'SocialSetting',
  data () {
    return {
      showSignatureTip: false,
      uploading: false,
      communityInfo: {},
      newBlogTag: '',
      blogTag: '',
      inputBlogTag: '',
      blogMainPassword: '',
      showBlogTip: false,
      creatingBlog: false,
      showSteemLogin: false,
      publishingBlog: false,
      state: '',
      socialForm: {
        twitter: '',
        discord: '',
        telegram: '',
        facebook: '',
        github: '',
        document: ''
      }
    }
  },
  components: {
    Login,
  },
  computed: {
    ...mapState("web3", ["communityBalance", "userBalances", "ctokenApprovement", "devAddress", "devRatio"]),
    ...mapState("steem", ['steemAccount']),
  },
  watch: {
    steemAccount(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.state = 'create'
      }
    }
  },
  methods: {
    async onConfirm() {
      try{
        this.uploading = true
        const res = await udpateSocialInfo(this.socialForm)
        this.$bvToast.toast(this.$t('community.updateSocialSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.communityInfo = await getMyCommunityInfo(true)
        this.fixNullOfSocial()
        this.showSignatureTip = false
      }catch(e){
        handleApiErrCode(e, (info, params) => {
          this.$bvToast.toast(info, params);
        });
      }finally{
        this.uploading = false
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
        this.blogTag = this.inputBlogTag;
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
        const res = await createNewCommunity(this.steemAccount, this.newBlogTag, this.blogMainPassword)
        if(res && res.success){
          // set community info
          setCommunityInfo(this.steemAccount, this.newBlogTag, this.blogMainPassword, this.form.name, this.form.description)
          // subscribe account
          const res = await subscribeCommunity(this.steemAccount, this.newBlogTag)
          if (res && res.success){
            this.showBlogTip = false;
            this.$bvToast.toast(this.$t('tip.createBlogSuccess'), {
              title: this.$t('tip.success'),
              variant: 'success'
            })
            // update
            this.state = 'publish'
            this.blogTag = this.newBlogTag
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
    fixNullOfSocial(){
      this.socialForm = {...this.communityInfo}
      if (!this.socialForm) return;
      for (let key of Object.keys(this.socialForm)){
        if(this.socialForm[key] === 'null' || this.socialForm[key] === 'undefined'){
          this.socialForm[key] = null
        }
      }
    }
  },
  async mounted () {
    this.communityInfo = await getMyCommunityInfo();
     this.blogTag = this.communityInfo.blogTag;
      if (this.blogTag){
        this.state = ''
      }else{
        if(!this.steemAccount){
          this.state = 'connectSteem'
        }else{
          this.state = 'create'
        }
      }
     this.fixNullOfSocial()
      // create hive account
      try{
        this.newBlogTag = await generateNewHiveAccount()
        this.blogMainPassword = generatePassword()
      }catch(e) {
        console.log('generateNewHiveAccount fail',e)
      }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem, white, hidden, fit-content);
}
.link-info-icon {
  padding-left: 1.8rem;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 1.6rem 1.6rem;
  width: 6.8rem;
  font-size: .8rem;
  font-weight: bold;
}
.twitter {
  background-image: url("~@/static/images/twitter-icon.svg");
}
.medium {
  background-image: url("~@/static/images/medium-icon.svg");
}
.discord {
  background-image: url("~@/static/images/Discord.svg");
}
.telegram {
  background-image: url("~@/static/images/telegram.svg");
}
.github {
  background-image: url("~@/static/images/GitHub.svg");
}
.document {
  background-image: url("~@/static/images/docs.svg");
}
.audition {
  background-image: url("~@/static/images/GitHub.svg");
}
.facebook {
  background-image: url("~@/static/images/facebook.png")
}
</style>
