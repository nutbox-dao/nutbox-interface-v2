<template>
  <div>
    <b-form class="custom-form c-form-label">
      <b-form-group id="input-group-name" label="Token Name" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-symbol" label="Token Symbol" label-for="input-symbol">
        <b-form-input
          id="input-symbol"
          v-model="form.symbol"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-decimal" label="Token Decimal" label-for="input-decimal">
        <b-form-input
          id="input-decimal"
          v-model="form.decimal"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-amount" label="Distribution Amount" label-for="input-amount">
        <b-form-input
          id="input-amount"
          v-model="form.totalSupply"
          placeholder="Please enter"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Logo" label-for="logo">
        <b-form-file id="logo" v-model="logo"
                     @input="updateFile"
                     ref="logo-file-input" ></b-form-file>
      </b-form-group>
      <button class="primary-btn" :disabled="!deployBtnStatus" @click="deploy">
        Deploy
      </button>
    </b-form>
    <b-modal v-model="modalVisible"
             modal-class="custom-modal"
             centered
             hide-header
             hide-footer
             no-close-on-backdrop>
      <div class="tip-modal">
        <img
          class="close-btn"
          src="~@/static/images/close.svg"
          alt=""
          @click="modalVisible=false"
        />
        <div class="c-modal-header text-center">
          <div class="font20 font-bold">已部署资产成功</div>
          <div class="font12 text-red">请确认信息并立即备份合约地址</div>
        </div>
        <div class="h-line"></div>
        <div class="info-box">
          <div class="row-info">
            <span class="label">Token Name</span>
            <span class="info">{{form.name}}</span>
          </div>
          <div class="row-info">
            <span class="label">Token Symbol</span>
            <span class="info">{{form.symbol}}</span>
          </div>
          <div class="row-info">
            <span class="label">Token Decimal</span>
            <span class="info">{{form.decimal}}</span>
          </div>
          <div class="row-info">
            <span class="label">Distribution Amount</span>
            <span class="info">{{form.totalSupply}}</span>
          </div>
          <div class="row-info">
            <span class="label">Logo</span>
            <span class="info"><img class="logo" src="" alt=""></span>
          </div>
          <div class="contract-addr-box">
            <div class="d-flex align-items-center mb-2">
              <span class="label">合约地址</span>
              <button class="font14 copy-btn" id="copy-addr"
                      :data-clipboard-text="tokenAddress"
                      @click="copyAddress">复制</button>
            </div>
            <div class="address copy-value">
             {{tokenAddress}}
            </div>
          </div>
        </div>

        <button class="primary-btn mt-4" @click="confirmRegister">
          完成
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { deploySimpleERC20 } from '@/utils/web3/asset'
import Clipboard from 'clipboard'

export default {
  name: 'DeployForm',
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
      tokenAddress: ''
    }
  },
  computed: {
    deployBtnStatus () {
      return this.form.name && this.form.symbol && this.form.decimal && this.form.totalSupply
    }
  },
  methods: {
    async deploy () {
      if (this.isMintable) {

      } else {
        this.tokenAddress = await deploySimpleERC20(this.form)
        console.log('address', this.tokenAddress)
        this.modalVisible = true
      }
    },
    updateFile () {
    },
    copyAddress () {

    },
    confirmRegister () {
      this.$store.commit('community/setUserDeployToken',
        Object.assign(this.form, { logo: this.logo, address: this.tokenAddress }))
      this.$router.push('/community/create-economy')
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
  padding: .8rem 0;
  font-weight: bolder;
  .label {
    flex: .4;
    color: #717376;
  }
  .info {
    flex: .6;
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
    margin-right: .5rem;
  }
  .copy-btn {
    background-color: var(--primary-custom);
    padding: .25rem .8rem;
    border-radius: 1.4rem;
    border: transparent;
  }
  .address {
    padding: .8rem 1rem;
    border-radius: .8rem;
    background-color: #F6F7F9;
    word-break: break-all;
  }
}

</style>
