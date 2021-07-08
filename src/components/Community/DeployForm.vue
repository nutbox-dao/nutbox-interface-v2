<template>
  <div>
    <b-form class="custom-form c-form-label">
      <b-form-group
        id="input-group-name"
        label="Token Name"
        label-for="input-name"
      >
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-symbol"
        label="Token Symbol"
        label-for="input-symbol"
      >
        <b-form-input
          id="input-symbol"
          v-model="form.symbol"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-decimal"
        label="Token Decimal"
        label-for="input-decimal"
      >
        <b-form-input
          id="input-decimal"
          v-model="form.decimal"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-amount"
        label="Distribution Amount"
        label-for="input-amount"
      >
        <b-form-input
          id="input-amount"
          v-model="form.totalSupply"
          placeholder="Please enter"
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
              <UploadLoading></UploadLoading>
              <img class="add-icon" src="~@/static/images/add.svg" alt="">
            </div>
          </template>
          <template #file-name>
            <div class="input-file-logo">
              <img class="logo-preview" v-if="logoPreviewScr" :src="logoPreviewScr" alt="">
              <UploadLoading v-if="loading"/>
            </div>
          </template>
        </b-form-file>
      </b-form-group>
      <button class="primary-btn" :disabled="(!deployBtnStatus) || deploying" @click="deploy">
        <b-spinner small type="grow" v-show="deploying" />
        Deploy
      </button>
    </b-form>
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
          <div class="font20 font-bold">已部署资产成功</div>
          <div class="font12 text-red">请确认信息并立即备份合约地址</div>
        </div>
        <div class="h-line"></div>
        <div class="info-box">
          <div class="row-info">
            <span class="label">Token Name</span>
            <span class="info">{{ form.name }}</span>
          </div>
          <div class="row-info">
            <span class="label">Token Symbol</span>
            <span class="info">{{ form.symbol }}</span>
          </div>
          <div class="row-info">
            <span class="label">Token Decimal</span>
            <span class="info">{{ form.decimal }}</span>
          </div>
          <div class="row-info">
            <span class="label">Distribution Amount</span>
            <span class="info">{{ form.totalSupply }}</span>
          </div>
          <div class="row-info">
            <span class="label">Logo</span>
            <span class="info"><img class="logo" :src="logoPreviewScr" alt="" /></span>
          </div>
          <div class="contract-addr-box">
            <div class="d-flex align-items-center mb-2">
              <span class="label">合约地址</span>
              <button
                class="font14 copy-btn"
                id='copy'
                :data-clipboard-text="tokenAddress"
                @click="copyAddress()"
              >
                复制
              </button>
            </div>
            <div class="address copy-value">
              {{ tokenAddress }}
            </div>
          </div>
        </div>

        <button class="primary-btn mt-4" @click="confirmDeploy">完成</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { deployERC20 } from '@/utils/web3/asset'
import Clipboard from 'clipboard'
import { uploadImage } from '@/utils/helper'
import { insertToken, getAllTokens } from '@/apis/api'
import UploadLoading from '@/components/ToolsComponents/UploadLoading'

export default {
  name: 'DeployForm',
  components: { UploadLoading },
  props: {
    isMintable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        symbol: '',
        decimal: '',
        totalSupply: ''
      },
      logo: null,
      modalVisible: false,
      tokenAddress: '',
      logoUrl: null,
      deploying: false,
      logoPreviewScr: null,
      loading: true
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
        this.tokenAddress = await deployERC20(this.form, this.isMintable)
        console.log('address', this.tokenAddress)
        const token = {
          ...this.form,
          address: this.tokenAddress,
          icon: this.logoUrl
        }
        this.modalVisible = true
        await insertToken(token)
        // update tokens cache
        await getAllTokens(true)
      } catch (e) {
        console.log(e)
        this.$bvToast.toast(this.$t('tip.deloyTokenFail'), {
          title: this.$t('tip.error'),
          variant: 'danger'
        })
      } finally {
        this.deploying = false
      }
    },

    async updateFile (file) {
      if (!this.logo) return
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.logoPreviewScr = res.target.result
      }
      try {
        this.logoUrl = await uploadImage(this.logo)
        this.loading = false
      } catch (e) {
        this.$bvToast.toast(this.$t('tip.picUploadFail'), {
          title: this.$t('tip.tips'),
          autoHideDelay: 5000,
          variant: 'warning'
        })
        this.logo = null
        this.logoUrl = null
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
      this.$router.push('/community/register/native?tokenAddress=' + this.tokenAddress)
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
  }
  .info {
    flex: 0.6;
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
