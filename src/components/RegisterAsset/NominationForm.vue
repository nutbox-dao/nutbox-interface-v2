<template>
  <div class="d-form">
    <b-form class="custom-form">
      <b-form-group id="input-group-0"
                    label="Net work"
                    label-for="dropdown-1">
        <b-dropdown id="dropdown-1">
          <template #button-content>
            <div class="flex-between-center">
              <div class="flex-full flex-start-center text-left">
                <img :src="networkOptions[networkIndex].icon" alt="">
                <span>{{networkOptions[networkIndex].name}}</span>
              </div>
              <i class="dropdown-icon"></i>
            </div>
          </template>
          <b-dropdown-item v-for="(item, index) of networkOptions" :key="item.name" @click="networkIndex=index">
            <template #default>
              <div class="flex-between-center">
                <div class="flex-full flex-start-center">
                  <img :src="item.icon" alt="">
                  <span>{{item.name}}</span>
                </div>
                <i class="selected-icon" v-if="networkIndex===index"></i>
              </div>
            </template>
          </b-dropdown-item>
        </b-dropdown>

      </b-form-group>
      <b-form-group id="input-group-1"
                    label="Validator Address"
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
  name: 'NominationForm',
  data () {
    return {
      form: {
        account: '',
        assetName: ''
      },
      networkIndex: 0,
      networkOptions: [
        { name: 'Kusuma', icon: require('../../static/images/tokens/ksm.png') },
        { name: 'Polkadot', icon: require('../../static/images/tokens/dot.png') }
      ]
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
#dropdown-1 {
  width: 100%;
  height: 2.4rem;
  .btn img {
    width: 1.4rem;
    height: 1.4rem;
    margin-right: .6rem;
  }
  .btn span {
    color: #242629;
  }
  .dropdown-icon {
    @include icon(.6rem, .6rem);
    background-image: url("~@/static/images/dropdown-icon.svg");
  }
  .dropdown-item img {
    width: 1.2rem;
    height: 1.2rem;
    margin-right: .8rem;
  }
  .selected-icon {
    @include icon;
    background-image: url("~@/static/images/selected-gray.png");
  }
}
</style>
