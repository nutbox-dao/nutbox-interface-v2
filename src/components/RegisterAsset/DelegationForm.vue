<template>
  <div class="d-form">
    <b-form class="custom-form">
      <b-form-group id="input-group-1"
                    label="Your Steem/Hive Account That people Delegate For"
                    label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.account"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2"
                    label="Asset Properties"
                    label-for="input-2">
        <div class="font12 text-grey-light" style="margin: -.6rem 0 .4rem">Name of Your Asset</div>
        <b-form-input
          id="input-2"
          v-model="form.assetName"
          placeholder="Please enter"
          required
        ></b-form-input>
      </b-form-group>
      <button class="primary-btn">Register</button>
    </b-form>
    <div class="text-grey-light font16 mt-3">Assetld:0x1242222xshjdh32721</div>
  </div>
</template>

<script>
export default {
  name: 'DelegationForm',
  data () {
    return {
      form: {
        account: '',
        assetName: ''
      }
    }
  }
}

</script>

<style scoped lang="scss">
@import "src/static/css/form";
.d-form {
  max-width: 500px;
  margin: auto;
}
label {
  margin-bottom: .2rem!important;
}
</style>
