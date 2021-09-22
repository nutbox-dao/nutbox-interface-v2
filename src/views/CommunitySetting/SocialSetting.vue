<template>
  <div class="container scroll-content">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">社区社交账号绑定</div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form text-left">
        <b-form-group label-cols-md="2" content-cols-md="7" label="社区博客"
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input v-model="socialForm.blog" placeholder="社区标签"></b-form-input>
            </div>
            <button class="primary-btn ml-2 px-3" style="width: fit-content" @click="showChargeTip = true">
              {{$t("wallet.connectSteem") }}
            </button>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label="信息渠道"
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon twitter">Twitter</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.twitter" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon medium">Medium</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.medium" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon discord">Discord</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.discord" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon telegram">Telegram</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.telegram" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon github">Github</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.github" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon document">Document</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.document" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="7" label=""
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="link-info-icon audition">Audition</div>
            <div class="c-input-group">
              <b-form-input v-model="socialForm.audition" placeholder="可选"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="5" label="">
          <button class="primary-btn">
            {{ $t("commen.update") }}
          </button>
        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialSetting',
  data () {
    return {
      socialForm: {
        blog: '',
        twitter: '',
        medium: '',
        discord: '',
        telegram: '',
        github: '',
        document: '',
        audition: ''
      }
    }
  }
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
</style>
