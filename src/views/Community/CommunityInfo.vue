<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div class="page-back-text-icon font20" style="line-height: 1rem"
           @click="isEdit?isEdit= false:$router.back()">{{(isEdit?$t('community.'+ type):'') + $t('community.communityInfo')}}</div>
      <div v-if="!isEdit"><button class="primary-btn pl-3 pr-3"
                   @click="isEdit = true">{{ $t('community.edit') }}</button></div>
    </div>
    <div class="scroll-content mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">{{ $t('community.communityInfo') }}</div>
        <b-form class="custom-form pl-md-3">
          <b-form-group label-cols-md="2" content-cols-md="5" :label="$t('community.communityName')">
            <b-form-input :disabled="!isEdit" v-model="form.name" :placeholder="$t('community.inputName')" ></b-form-input>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="5" :label="$t('community.communityLink')">
            <b-form-input :disabled="!isEdit" v-model="form.website" :placeholder="$t('community.inputLink')" ></b-form-input>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" :label="$t('community.communityDesc')">
            <b-form-textarea :disabled="!isEdit" v-model="form.introduction" :placeholder="$t('community.inputDesc')" rows="5"></b-form-textarea>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" class="logo-form" :label="$t('community.communityLogo')">
            <b-form-file
              :disabled="!isEdit"
              v-model="logo"
              @input="updateLogo"
              accept="image/png,image/jpeg, image/jpg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-logo">
                  <template v-if="form.logoUrl" >
                    <img class="cover-preview" :src="form.logoUrl" alt="">
                    <div v-if="isEdit" class="edit-mask"><span>{{ $t('community.edit') }}<br>LOGO</span></div>
                  </template>
                  <template v-else>
                    <img class="add-icon" src="~@/static/images/add.svg" alt="">
                    <div class="add-text">{{ $t('community.uploadLogo') }}</div>
                  </template>
                </div>
              </template>
              <template #file-name>
                <div class="input-file-logo">
                  <img class="logo-preview" v-if="logoPreviewSrc" :src="logoPreviewSrc" alt="">
                  <UploadLoading v-if="logoUploadLoading" />
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-light mt-1">{{ $t('community.picTip', {size: '200*200'}) }}</div>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" class="cover-form" :label="$t('community.communityPoster')">
            <b-form-file
              :disabled="!isEdit"
              v-model="coverImg"
              @input="updateCover"
              accept="image/png,image/jpeg,image/jpg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-cover">
                  <template v-if="form.coverUrl" >
                    <img class="cover-preview" :src="form.coverUrl" alt="">
                    <div v-if="isEdit" class="edit-mask"><span>{{ $t('community.edit') }}<br>{{ $t('community.poster') }}</span></div>
                  </template>
                  <template v-else>
                    <img class="add-icon" src="~@/static/images/add.svg" alt="">
                    <div class="add-text">{{ $t('community.uploadPoster') }}</div>
                  </template>
                </div>
              </template>
              <template #file-name>
                <div class="input-file-cover">
                  <img class="cover-preview" v-if="coverPreviewSrc" :src="coverPreviewSrc" alt="">
                  <UploadLoading v-if="coverUploadLoading"/>
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-light mt-1">{{ $t('community.picTip', {size: '1200*280'}) }}</div>
          </b-form-group>
          <b-form-group v-if="isEdit" label-cols-md="2" content-cols-md="5" label="">
            <button class="primary-btn" @click="onConfirm">{{ $t('community.commit') }}</button>
          </b-form-group>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImage } from '@/utils/helper'
import UploadLoading from '@/components/ToolsComponents/UploadLoading'

export default {
  name: 'EditCommunityInfo',
  components: { UploadLoading },
  data () {
    return {
      logo: null,
      coverImg: null,
      form: {
        id:'',
        name: '',
        website: '',
        summary: '',
        logoUrl: '',
        coverUrl: ''
      },
      logoPreviewSrc: '',
      logoUploadLoading: false,
      coverPreviewSrc: '',
      coverUploadLoading: false,
      type: null,
      isEdit:false
    }
  },
  watch: {
    type(newValue, oldValue) {
      this.isEdit = !!newValue
    }
  },
  mounted () {
    this.type = this.$route.query.type
    this.isEdit = !!this.type
    this.setFormInfo()
  },
  methods: {
    setFormInfo () {
      this.form = {
        name: 'BML',
        website: 'http://www.bml.com',
        introduction: 'Acala是全球首个去中心化开放式金融联盟、波卡生态金融中心。Acala是全球首个去中心化开放式金融联盟、波卡生态金融中心。',
        logoUrl: 'https://cdn.wherein.mobi/polkadot/token/logo/crab.png',
        coverUrl: 'https://cdn.wherein.mobi/nutbox/slotauction/poster/BML-poster.png'
      }
    },
    async updateLogo (file) {
      if (!this.logo) return
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.logoPreviewSrc = res.target.result
      }
      try {
        this.form.logoUrl = await uploadImage(this.logo)
        this.logoUploadLoading = false
      } catch (e) {
        this.$bvToast.toast(this.$t('tip.picUploadFail'), {
          title: this.$t('tip.tips'),
          autoHideDelay: 5000,
          variant: 'warning'
        })
        this.logo = null
        this.form.logoUrl = null
        this.logoUploadLoading = false
      }
    },
    async updateCover (file) {
      if (!this.coverImg) return
      this.coverUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.coverPreviewSrc = res.target.result
      }
      try {
        this.form.coverUrl = await uploadImage(this.coverImg)
        this.coverUploadLoading = false
      } catch (e) {
        this.$bvToast.toast(this.$t('tip.picUploadFail'), {
          title: this.$t('tip.tips'),
          autoHideDelay: 5000,
          variant: 'warning'
        })
        this.coverImg = null
        this.form.coverUrl = null
      }
    },
    onConfirm () {
      this.isEdit = false
    }
  }
}
</script>

<style scoped lang="scss">
.community-info-card {
  @include card(1.6rem 1.2rem, white, none, auto);
  @include single-color-bg(.3rem 1rem);
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
  background: rgba(0,0,0, .5);
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
