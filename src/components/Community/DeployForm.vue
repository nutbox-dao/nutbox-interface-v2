<template>
  <div>
    <b-form class="custom-form c-form-label">
      <b-form-group id="input-group-name" label="Token Name" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-symbol" label="Token Symbol" label-for="input-symbol">
        <b-form-input
          id="input-symbol"
          v-model="form.symbol"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-decimal" label="Token Decimal" label-for="input-decimal">
        <b-form-input
          id="input-decimal"
          v-model="form.decimal"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-amount" label="Distribution Amount" label-for="input-amount">
        <b-form-input
          id="input-amount"
          v-model="form.totalSupply"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <button class="primary-btn" @click="deploy">Deploy</button>
    </b-form>
  </div>
</template>

<script>
import { deploySimpleERC20 } from '@/utils/web3/asset'

export default {
  name: 'DeployForm',
  props: {
    isMintable: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      form: {
        name: '',
        symbol: '',
        decimal: '',
        totalSupply: ''
      }
    }
  },
  methods: {
    async deploy() {
      if (this.isMintable){

      }else{
        console.log(1234);
        const tokenAddress = await deploySimpleERC20(this.form)
        console.log('address', tokenAddress);
      }
    }
  },
}

</script>

<style scoped lang="scss">
@import "src/static/css/form";
</style>
