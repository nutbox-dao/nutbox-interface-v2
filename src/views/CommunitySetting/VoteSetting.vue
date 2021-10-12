<template>
  <div class="container scroll-content d-flex flex-column">
    <div class="view-top-header flex-between-center">
      <div class="page-title-line font20 font-bold">社区治理</div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form  text-left">
        <b-form-group label-cols-md="2" content-cols-md="5" label="提案阈值"
                      label-class="d-flex align-items-center font16 font-bold ">
          <div class="d-flex">
            <div class="c-input-group">
              <b-form-input v-model="socialForm.blog" placeholder="100"></b-form-input>
              <span class="c-append">NUT</span>
            </div>
          </div>
        </b-form-group>
        <b-form-group label-cols-md="2" content-cols-md="5" label="通过比例"
                      label-class="d-flex align-items-center font16 font-bold">
          <div class="d-flex align-items-center">
            <div class="c-input-group">
              <b-form-input v-model="socialForm.twitter" placeholder="50"></b-form-input>
              <span class="c-append">%</span>
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
  name: 'VoteSetting',
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
  @include card(2rem 1.2rem, white, none, auto);
  flex: 1;
}
</style>
