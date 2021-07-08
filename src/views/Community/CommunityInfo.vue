<template>
  <div class="page-view-content">
    <div class="mb-3 flex-between-center" style="height: 2.4rem">
      <div class="page-back-text-icon font20" style="line-height: 1rem"
           @click="isEdit?isEdit= false:$router.back()">{{isEdit?'编辑':''}}社区信息</div>
      <div v-if="!isEdit"><button class="primary-btn pl-3 pr-3"
                   @click="isEdit = true">修改信息</button></div>
    </div>
    <div class="scroll-content mt-3">
      <div class="community-info-card text-left">
        <div class="title font-bold">社区基本信息</div>
        <b-form class="custom-form pl-md-3">
          <b-form-group label-cols-md="2" content-cols-md="5" label="社区名字">
            <b-form-input :disabled="!isEdit" v-model="form.name" placeholder="请输入社区名字" ></b-form-input>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="5" label="社区官网">
            <b-form-input :disabled="!isEdit" v-model="form.website" placeholder="请输入社区官网链接" ></b-form-input>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" label="社区介绍">
            <b-form-textarea :disabled="!isEdit" v-model="form.introduction" placeholder="请写一段关于社区的介绍" rows="5"></b-form-textarea>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" class="logo-form" label="社区Logo">
            <b-form-file
              :disabled="!isEdit"
              v-model="logo"
              @input="updateLogo"
              accept="image/png,image/jpeg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-logo">
                  <template v-if="form.logoUrl" >
                    <img class="cover-preview" :src="form.logoUrl" alt="">
                    <div v-if="isEdit" class="edit-mask"><span>编辑<br>LOGO</span></div>
                  </template>
                  <template v-else>
                    <img class="add-icon" src="~@/static/images/add.svg" alt="">
                    <div class="add-text">上传Logo</div>
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
            <div class="font12 text-grey-light mt-1">建议尺寸1:1，小于2M，支持jpg、png、jpeg格式</div>
          </b-form-group>
          <b-form-group label-cols-md="2" content-cols-md="8" class="cover-form" label="社区封面">
            <b-form-file
              :disabled="!isEdit"
              v-model="coverImg"
              @input="updateCover"
              accept="image/png,image/jpeg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-cover">
                  <template v-if="form.coverUrl" >
                    <img class="cover-preview" :src="form.coverUrl" alt="">
                    <div v-if="isEdit" class="edit-mask"><span>编辑<br>封面</span></div>
                  </template>
                  <template v-else>
                    <img class="add-icon" src="~@/static/images/add.svg" alt="">
                    <div class="add-text">上传封面</div>
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
            <div class="font12 text-grey-light mt-1">建议尺寸1200*280，小于2M，支持jpg、png、jpeg格式</div>
          </b-form-group>
          <b-form-group v-if="isEdit" label-cols-md="2" content-cols-md="5" label="">
            <button class="primary-btn" @click="onConfirm">提交</button>
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
        name: '',
        website: '',
        introduction: '',
        logoUrl: '',
        coverUrl: ''
      },
      logoPreviewSrc: '',
      logoUploadLoading: false,
      coverPreviewSrc: '',
      coverUploadLoading: false,
      isEdit: false
    }
  },
  mounted () {
    this.isEdit = this.$route.query.type === 'edit'
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
