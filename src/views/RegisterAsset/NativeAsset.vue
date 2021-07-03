<template>
  <div class="tab-card">
    <b-form class="custom-form text-left">
      <b-form-group
        id="input-group-1"
        label="Home Location"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.location"
          placeholder="Your token contract address"
          required
        ></b-form-input>
        <div id="mint-checkbox" class="mt-3 font12 flex-between-center">
          <div class="text-grey">
            <div v-if="false"></div>
          </div>
          <div class="custom-control" style="line-height: 1.5rem">
            Havn’t Deploy yet？
            <router-link to="/community/deploy-token">Deploy one</router-link>
          </div>
        </div>
      </b-form-group>
      <button class="primary-btn">Register</button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "CrossChainAsset",
  data() {
    return {
      form: {
        location: "",
      },
    };
  },
};
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.tab-card {
  @include card(2.4rem 1.2rem, white, hidden, auto);
  max-width: 500px;
  min-height: 27rem;
  margin: auto;
}
</style>