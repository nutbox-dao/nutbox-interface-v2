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
          v-model="form.amount"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <button class="primary-btn">Deploy</button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'DeployForm',
  data () {
    return {
      form: {
        name: '',
        symbol: '',
        decimal: '',
        amount: ''
      }
    }
  }
}

</script>

<style scoped lang="scss">
@import "src/static/css/form";
</style>
