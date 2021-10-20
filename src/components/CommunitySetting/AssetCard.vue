<template>
  <div class="asset-card">
    <div class="top flex-between-center">
      <img v-if="logo || type !== 'HomeChainAssetRegistry'" :src="logo" alt="" class="logo" />
      <b-form-file v-else
                   class="logo"
                   v-model="logoFile"
                   @input="updateLogo"
                   accept="image/png,image/jpeg"
                   ref="logo-file-input">
        <template #placeholder>
          <div class="input-file-logo">
            <div class="add-text font12">{{ $t("community.uploadLogo") }}</div>
          </div>
        </template>
        <template #file-name>
          <div class="input-file-logo">
            <img class="logo-preview" v-if="logoPreviewSrc" :src="logoPreviewSrc" alt="">
            <UploadLoading v-if="loading" loader-size="2rem"/>
          </div>
        </template>
      </b-form-file>
      <div class="balance-right flex-full">
        <div class="d-flex justify-content-between align-items-start font-bold">
          <div class="d-flex flex-column align-items-start justify-content-between">
            <div class="font16">{{ showingSymbol }}</div>
            <div class="font12 text-grey-light flex-start-center">
              <span>{{ showingName }}</span>
              <i class="copy-icon" v-if="type === 'HomeChainAssetRegistry'" @click="copy"></i>
            </div>
          </div>
          <span class="font16">${{ formatPrice | amountForm }}</span>
        </div>
      </div>
    </div>
    <b-modal
      v-model="cropperModal"
      modal-class="cropper-modal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <div class="cropper-container">
        <canvas id="cropper-canvas"></canvas>
        <vueCropper
          ref="cropper"
          class="cropper-rounded-circle"
          :infoTrue="true"
          :autoCrop="true"
          :img="cropperImgSrc"
          :fixedNumber="[1, 1]"
          :autoCropWidth="200"
          :fixed="true"
          :centerBox="true"
          outputType="png"
        ></vueCropper>
      </div>
      <div class="crop-btn-group">
        <button class="primary-btn" @click="onCancel">{{ $t('commen.cancel') }}</button>
        <button class="primary-btn" @click="completeCropAndUpload">{{ $t('commen.complete') }}</button>
      </div>
    </b-modal>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { updateTokenIcon } from '@/utils/web3/asset'
import UploadLoading from '@/components/ToolsComponents/UploadLoading'
import { uploadImage } from '@/utils/helper'
import { VueCropper } from 'vue-cropper'
import { getRegitryAssets } from '@/utils/web3/asset'

export default {
  name: 'AssetCard',
  components: { UploadLoading, VueCropper },
  props: {
    logo: {
      type: String
    },
    symbol: {
      type: String
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    price: {
      type: Number
    },
    type: {
      type: String
    },
    chainId: {
      type: Number
    }
  },
  data () {
    return {
      showingSymbol: '',
      showingName: '',
      logoUrl: '',
      loading: true,
      logoFile: null,
      logoPreviewSrc: '',
      cropperModal: false,
      cropperImgSrc: ''
    }
  },
  computed: {
    ...mapState(['prices', 'ethPrice']),
    formatPrice () {
      if (this.type === 'HomeChainAssetRegistry') {
        return this.price
      } else if (this.type === 'SubstrateCrowdloanAssetRegistry' || this.type === 'SubstrateNominateAssetRegistry') {
        if (this.chainId === 2) {
          return this.prices.DOTUSDT
        } else if (this.chainId === 3) {
          return this.prices.KSMUSDT
        }
      } else if (this.type === 'SteemHiveDelegateAssetRegistry') {
        if (this.chainId === 1) {
          return this.prices.STEEMETH * this.ethPrice
        } else if (this.chainId === 2) {
          return this.prices.HIVEUSDT
        }
      }
    }
  },
  mounted () {
    if (this.type === 'HomeChainAssetRegistry') {
      this.showingName = this.name
      this.showingSymbol = this.symbol
    } else if (this.type === 'SubstrateCrowdloanAssetRegistry' || this.type === 'SubstrateNominateAssetRegistry') {
      if (this.chainId === 2) {
        this.showingName = 'Polkadot'
        this.showingSymbol = 'DOT'
      } else if (this.chainId === 3) {
        this.showingName = 'Kusama'
        this.showingSymbol = 'KSM'
      }
    } else if (this.type === 'SteemHiveDelegateAssetRegistry') {
      if (this.chainId === 1) {
        this.showingName = 'Steem power'
        this.showingSymbol = 'SP'
      } else if (this.chainId === 2) {
        this.showingName = 'Hive power'
        this.showingSymbol = 'HIVE'
      }
    }
  },
  methods: {
    copy () {
      if (this.type !== 'HomeChainAssetRegistry') return
      navigator.clipboard.writeText(this.address).then(() => {
        this.$bvToast.toast(
          this.address,
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info'
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    // async updateTokenIcon () {
    //   if (this.type !== 'HomeChainAssetRegistry') return
    //   const token = {
    //     address: this.address,
    //     logo: this.logoUrl
    //   }
    //   try {
    //     const res = await updateTokenIcon(token)
    //   } catch (e) {
    //
    //   } finally {
    //     this.loading = false
    //   }
    // },
    async updateLogo (file) {
      if (!this.logoFile || this.type !== 'HomeChainAssetRegistry') return
      this.loading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
      }
    },
    onCancel () {
      this.cropperModal = false
      this.logoFile = null
      this.loading = false
    },
    completeCropAndUpload () {
      this.$refs.cropper.getCropData(async (data) => {
        const canvas = await this.clipCircleImg(data)
        this.logoPreviewSrc = canvas.toDataURL('image/png')
        this.cropperModal = false
        canvas.toBlob(async data => {
          try {
            this.logoUrl = await uploadImage(data)
            const token = {
              address: this.address,
              icon: this.logoUrl
            }
            const res = await updateTokenIcon(token)
            let assets = await getRegitryAssets()
            assets.filter(asset => asset.address === this.address)[0] = {...assets.filter(asset => asset.address === this.address)[0],icon: this.logoUrl}
            this.$store.commit('web3/saveAllAssetsOfUser', {...assets})
          } catch (e) {
            console.log(325,e);
            this.$bvToast.toast(this.$t('tip.picUploadFail'), {
              title: this.$t('tip.tips'),
              autoHideDelay: 5000,
              variant: 'warning'
            })
            this.logoFile = null
            this.logoUrl = null
          }finally{
            this.loading = false
          }
        })
      })
    },
    clipCircleImg(imgSrc) {
      return new Promise(resolve => {
        const canvas = document.getElementById('cropper-canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = imgSrc
        img.onload = () => {
          const cw = canvas.width = img.width
          const ch = canvas.height = img.height
          ctx.beginPath()
          ctx.arc(cw / 2, ch / 2, ch / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(img, 0, 0)
        }
        const timer = setInterval(function () {
          if (img.complete) {
            clearInterval(timer)
            resolve(canvas)
          }
        }, 50)
      })
    },
  }
}
</script>

<style scoped lang="scss">
//@import "src/static/css/form";
.asset-card {
  @include card(1.2rem 0);
  @include c-col-flex-between-center;
  .top {
    width: 100%;
    @include single-color-bg(.2rem 1.4rem);
    background-position: left center;
    padding: 0 1.2rem;
  }
  .logo {
    @include card-icon;
    margin-right: .4rem;
    position: relative;
  }
  .copy-icon {
    @include icon(.6rem, .6rem);
    background-image: url("~@/static/images/copy.svg");
    margin-left: .2rem;
  }
}
::v-deep .logo .custom-file-input{
  border-radius: 2.8rem;
}
::v-deep .logo .custom-file-label {
  border-radius: 2.8rem;
}
.input-file-logo {
  position: relative;
  width: 100%;
  height: 100%;
}
.logo-preview {
  width: 2.8rem;
  height: 2.8rem;
}
.add-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: .6rem;
  color: #BDBFC2;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
