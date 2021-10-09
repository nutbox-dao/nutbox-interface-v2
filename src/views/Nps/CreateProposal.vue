<template>
  <div class="container scroll-content">
    <div class="page-view-title-v mt-5">{{$t("nps.nps") }}</div>
    <div class="view-top-header">
      <div class="page-back-text-icon font20" @click="$router.back()">Create Proposal</div>
    </div>
    <div class="c-card mb-5">
      <div class="custom-form">
        <b-form-group :label="$t('nps.title')" label-class="text-left font16">
          <b-form-input v-model="proposalForm.title" :placeholder="$t('nps.titleInputTip')"></b-form-input>
        </b-form-group>
        <b-form-group :label="$t('nps.startAndEndTime')" label-class="text-left font16">
          <div class="flex-between-center">
            <div class="c-input-group">
              <b-dropdown class="c-date-picker-dropdown" ref="startTimeDropdown">
                <template #button-content>
                  <span v-if="proposalForm.startTime" class="text-black">{{proposalForm.startTime}}</span>
                  <span v-else style="color: #495057">{{ $t('nps.startTime')}}</span>
                  <i class="date-icon ml-3"></i>
                </template>
                <template #default>
                  <b-calendar hide-header hide-footer
                              :locale="locale"
                              v-model="proposalForm.startTime"
                              @selected="$refs.startTimeDropdown.hide(true)"
                              @context="onEndContext"></b-calendar>
                </template>
              </b-dropdown>
            </div>
            <div class="mx-2 text-grey-light"> - </div>
            <div class="c-input-group">
              <b-dropdown class="c-date-picker-dropdown" ref="startTimeDropdown" right>
                <template #button-content>
                  <span v-if="proposalForm.endTime" class="text-black">{{proposalForm.endTime}}</span>
                  <span v-else style="color: #495057">{{ $t('nps.endTime')}}</span>
                  <i class="date-icon ml-3"></i>
                </template>
                <template #default>
                  <b-calendar hide-header hide-footer
                              :locale="locale"
                              v-model="proposalForm.endTime"
                              @selected="$refs.startTimeDropdown.hide(true)"
                              @context="onEndContext"></b-calendar>
                </template>
              </b-dropdown>
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
        startTime: '',
        endTime: '',
        detailInfo: ''
      }
    }
  },
  computed: {
    locale () {
      const setLocale = window.localStorage.getItem(LOCALE_KEY)
      if (setLocale === 'kr') return 'ko-KR'
      if (setLocale === 'my') return 'ms-MY'
      if (setLocale === 'jp') return 'ja-JP'
      return setLocale
    }
  },
  methods: {
    onStartContext (ctx) {
      this.proposalForm.startTime = ctx.selectedYMD
    },
    onEndContext (ctx) {
      this.proposalForm.endTime = ctx.selectedYMD
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
