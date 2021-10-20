<template>
  <div>
    <div class="custom-form c-form-label">
      <b-form-group
        id="input-group-name"
        :label="$t('asset.tokenName')"
        label-for="input-name"
      >
        <b-form-input
          id="input-name"
          maxlength="20"
          v-model="form.name"
          placeholder='e.g. "Bitcoin", "Ethereum"'
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-symbol"
        :label="$t('asset.tokenSymbol')"
        label-for="input-symbol"
      >
        <b-form-input
          id="input-symbol"
          maxlength="6"
          @keyup="symbolFilled"
          v-model="form.symbol"
          placeholder='e.g. "BTC", "ETH"'
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-amount"
        :label="$t('asset.distributionAmount')"
        label-for="input-amount"
      >
        <b-form-input
          id="input-amount"
          v-model="form.totalSupply"
          :placeholder="$t('asset.inputDistributionAmount')"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Logo" label-for="logo" class="logo-form">
        <b-form-file
          id="logo"
          v-model="logo"
          @input="updateFile"
          accept="image/png,image/jpeg"
          ref="logo-file-input"
        >
          <template #placeholder>
            <div class="input-file-logo">
              <img class="add-icon" src="~@/static/images/add.svg" alt="">
            </div>
          </template>
          <template #file-name>
            <div class="input-file-logo">
              <img class="logo-preview" v-if="logoPreviewSrc" :src="logoPreviewSrc" alt="">
              <UploadLoading v-if="loading"/>
            </div>
          </template>
        </b-form-file>
      </b-form-group>
      <button class="primary-btn" :disabled="(!deployBtnStatus) || deploying" @click="deploy">
        <b-spinner small type="grow" v-show="deploying" />
        {{ $t('asset.deploy') }}
      </button>
    </div>
    <b-modal
      v-model="modalVisible"
      modal-class="custom-modal"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="tip-modal">
        <img
          class="close-btn"
          src="~@/static/images/close.svg"
          alt=""
          @click="modalVisible = false"
        />
        <div class="c-modal-header text-center">
          <div class="font20 font-bold">{{ $t('tip.deploySuccess') }}</div>
          <div class="font12 text-red">{{ $t('tip.storeTokenAddress') }}</div>
        </div>
        <div class="h-line"></div>
        <div class="info-box">
          <div class="row-info">
            <span class="label">{{ $t('asset.tokenName') }}</span>
            <span class="info">{{ form.name }}</span>
          </div>
          <div class="row-info">
            <span class="label">{{ $t('asset.tokenSymbol') }}</span>
            <span class="info">{{ form.symbol }}</span>
          </div>
          <div class="row-info">
            <span class="label">{{ $t('asset.distributionAmount') }}</span>
            <span class="info">{{ form.totalSupply }}</span>
          </div>
          <div class="row-info">
            <span class="label">Logo</span>
            <span class="info"><img class="logo" :src="logoPreviewSrc" alt="" /></span>
          </div>
          <div class="contract-addr-box">
            <div class="d-flex align-items-center mb-2">
              <span class="label">{{ $t('commen.contractAddr') }}</span>
              <button
                class="font14 copy-btn"
                id='copy'
                :data-clipboard-text="tokenAddress"
                @click="copyAddress()"
              >
                {{ $t('commen.copy') }}
              </button>
            </div>
            <div class="address copy-value">
              {{ tokenAddress }}
            </div>
          </div>
        </div>

        <button class="primary-btn mt-4" @click="confirmDeploy">{{ $t('commen.complete') }}</button>
      </div>
    </b-modal>
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
import { deployERC20 } from '@/utils/web3/asset'
import { monitorUserBalances } from '@/utils/web3/pool'
import { uploadImage, sleep } from '@/utils/helper'
import { insertToken, getAllTokens } from '@/apis/api'
import UploadLoading from '@/components/ToolsComponents/UploadLoading'
import { handleApiErrCode } from '../../utils/helper'
import { VueCropper } from 'vue-cropper'

export default {
  name: 'DeployForm',
  components: { UploadLoading, VueCropper },
  props: {
    isMintable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {
        name: '',
        symbol: '',
        decimal: 18, // default 18
        totalSupply: ''
      },
      logo: null,
      modalVisible: false,
      tokenAddress: '',
      logoUrl: '',
      deploying: false,
      logoPreviewSrc: null,
      loading: true,
      cropperModal: false,
      cropperImgSrc: ''
    }
  },
  computed: {
    deployBtnStatus () {
      return (
        this.form.name &&
        this.form.symbol &&
        this.form.decimal &&
        this.form.totalSupply
      )
    }
  },
  methods: {
    nameFilled() {
      if (this.form.name.length > 20) {
        this.form.name = this.form.name.slice(0, 20)
      }
    },
    symbolFilled(){
      if (this.form.symbol.length > 6){
        this.form.symbol = this.form.symbol.slice(0, 6)
      }
        this.form.symbol = this.form.symbol.toUpperCase()
    },
    async deploy () {
      if (!this.logoUrl || this.logoUrl.length === 0) {
        this.$bvToast.toast(this.$t('tip.uploadLogo'), {
          title: this.$t('tip.tips'),
          autoHideDelay: 5000,
          variant: 'warning'
        })
        return
      }
      this.deploying = true
      try {
        this.tokenAddress = await deployERC20(this.form, this.isMintable, () => {
          this.$bvToast.toast(this.$t('tip.deploying'), {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
        })
        console.log('address', this.tokenAddress)
        const token = {
          ...this.form,
          address: this.tokenAddress,
          icon: this.logoUrl
        }
        this.modalVisible = true
        await insertToken(token)
        await sleep(2)
        // update tokens cache
        await getAllTokens(true)
        await monitorUserBalances()
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.deploying = false
      }
    },
    onCancel () {
      this.cropperModal = false
      this.logo = null
      this.loading = false
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
    completeCropAndUpload () {
      this.$refs.cropper.getCropData(async (data) => {
        const canvas = await this.clipCircleImg(data)
        this.logoPreviewSrc = canvas.toDataURL('image/png')
        this.cropperModal = false
        canvas.toBlob(async data => {
          try {
            this.logoUrl = await uploadImage(data)
            this.loading = false
          } catch (e) {
            this.$bvToast.toast(this.$t('tip.picUploadFail'), {
              title: this.$t('tip.tips'),
              autoHideDelay: 5000,
              variant: 'warning'
            })
            this.logo = null
            this.logoUrl = null
            this.loading = false
          }
        })
      })
    },
    async updateFile (file) {
      if (!this.logo) return
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
      }
    },
    formatUserAddress (address, long = true) {
      if (!address) return 'Loading Account'
      if (long) {
        if (address.length < 16) return address
        const start = address.slice(0, 28)
        const end = address.slice(-5)
        return `${start}...`
      } else {
        const start = address.slice(0, 6)
        const end = address.slice(-6)
        return `${start}...${end}`
      }
    },

    copyAddress () {
      navigator.clipboard.writeText(this.tokenAddress).then(() => {
        this.$bvToast.toast(
          this.$t('tip.copyAddress', {
            address: this.formatUserAddress(this.tokenAddress)
          }),
          {
            title: this.$t('tip.clipboard'),
            autoHideDelay: 5000,
            variant: 'info' // info success danger
          }
        )
      }, (e) => {
        console.log(e)
      })
    },
    confirmDeploy () {
      this.modalVisible = false;
      this.$emit('deployed', this.tokenAddress);
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.custom-file {
  height: 6rem;
  width: 6rem;
}
.row-info {
  @include c-flex-between-center;
  padding: 0.8rem 0;
  font-weight: bolder;
  .label {
    flex: 0.4;
    color: #717376;
    white-space: nowrap;
  }
  .info {
    flex: 0.6;
    word-break: break-all;
  }
  .logo {
    width: 3rem;
    height: 3rem;
    border-radius: 3rem;
  }
}
.contract-addr-box {
  .label {
    color: #717376;
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
  .copy-btn {
    background-color: var(--primary-custom);
    padding: 0.25rem 0.8rem;
    border-radius: 1.4rem;
    border: transparent;
  }
  .address {
    padding: 0.8rem 1rem;
    border-radius: 0.8rem;
    background-color: #f6f7f9;
    word-break: break-all;
  }
}
</style>
