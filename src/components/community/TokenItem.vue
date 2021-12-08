<template>
  <div class="token-item d-flex align-items-center">
    <img v-if="logo" class="logo" :src="logo" alt="">
    <empty-img v-else width="2.4rem" height="2.4rem" border-radius="50%"></empty-img>
    <div class="flex-fill ml-4">
      <div class="mb-2 font16">{{tokenName}} -- {{tokenSymbol}}</div>
      <div class="text-grey-5 font14">{{tokenAddress}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TokenItem',
  props: {
    logo: {
      type: String,
      default: ''
    },
    tokenName: {
      type: String,
      default: ''
    },
    tokenSymbol: {
      type: String,
      default: ''
    },
    tokenAddress: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.logo {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 2.4rem;
}
</style>
