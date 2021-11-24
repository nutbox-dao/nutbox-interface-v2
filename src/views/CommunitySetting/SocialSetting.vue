<template>
  <div class="scroll-content">
    <div class="container">
      <div class="view-top-header flex-between-center">
        <div class="page-title-line font20 font-bold">{{ $t('commen.social') }}</div>
      </div>
      <div class="c-card mb-5">
        <div class="custom-form text-left">
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMyCommunityInfo, udpateSocialInfo } from '@/utils/web3/community'
import { handleApiErrCode } from '@/utils/helper'

export default {
  name: 'SocialSetting',
  data () {
    return {
      showSignatureTip: false,
      uploading: false,
      communityInfo: {},
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
  computed: {
    ...mapState("web3", ["communityBalance", "userBalances", "ctokenApprovement", "devAddress", "devRatio"]),
    ...mapState("steem", ['steemAccount']),
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
     this.fixNullOfSocial()
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
