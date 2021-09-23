<template>
  <div class="container scroll-content">
    <div class="view-top-header">
      <div class="page-back-text-icon font20" @click="$router.back()">Create Proposal</div>
    </div>
    <div class="c-card">
      <div class="custom-form">
        <b-form-group :label="$t('nps.title')" label-class="text-left font16">
          <b-form-input v-model="proposalForm.title" :placeholder="$t('nps.titleInputTip')"></b-form-input>
        </b-form-group>
        <b-form-group :label="$t('nps.startAndEndTime')" label-class="text-left font16">
          <div class="flex-between-center">
            <div class="c-input-group">
              <b-form-input id="start-time-input" v-model="proposalForm.startTime"
                            type="text" placeholder="YYYY-MM-DD" autocomplete="off"></b-form-input>
              <div class="c-date-picker">
                <b-form-datepicker v-model="proposalForm.startTime" button-only right
                                   :locale="locale" aria-controls="start-time-input">
                  <template #button-content>
                    <i class="date-icon"></i>
                  </template>
                </b-form-datepicker>
              </div>
            </div>
            <div class="mx-2 text-grey-light"> - </div>
            <div class="c-input-group">
              <b-form-input id="start-time-input" v-model="proposalForm.startTime"
                            type="text" placeholder="YYYY-MM-DD" autocomplete="off"></b-form-input>
              <div class="c-date-picker">
                <b-form-datepicker v-model="proposalForm.startTime" button-only right
                                   :locale="locale" aria-controls="start-time-input">
                  <template #button-content>
                    <i class="date-icon"></i>
                  </template>
                </b-form-datepicker>
              </div>
            </div>
          </div>
        </b-form-group>
        <b-form-group :label="$t('nps.details')" label-class="text-left font16">
          <b-form-textarea v-model="proposalForm.detailInfo"
                           :placeholder="$t('nps.titleInputTip')"></b-form-textarea>
        </b-form-group>
        <button class="primary-btn w-75">
          {{ $t('community.commit') }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { LOCALE_KEY } from '@/config'

export default {
  name: 'CreateProposal',
  data () {
    return {
      proposalForm: {
        title: '',
        startTime: '2021-09-10',
        endTime: '',
        detailInfo: ''
      },
      locale: window.localStorage.getItem(LOCALE_KEY) || 'en'
    }
  },
  methods: {
    onContext (ctx) {
      console.log(ctx)
      this.proposalForm.startTime = ctx.activeYMD
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.c-card {
  @include card(2rem 1.2rem 4rem, white, hidden, fit-content);
}
.custom-form {
  max-width: 30rem;
  margin: auto;
}
textarea {
  min-height: 14rem;
}


.date-icon {
  @include icon();
  background-image: url("~@/static/images/list-down-arrow.svg");
}
</style>
