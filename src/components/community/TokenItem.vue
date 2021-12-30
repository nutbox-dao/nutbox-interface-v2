<template>
  <div class="token-item d-flex align-items-center">
    <img v-if="logo" class="logo" :src="logo" alt="">
    <empty-img v-else width="2.4rem" height="2.4rem" border-radius="50%"></empty-img>
    <div class="flex-fill ml-4">
      <div class="mb-2 font14 line-height14">{{tokenName}} -- {{tokenSymbol}}</div>
      <div class="text-grey-7 font12 line-height12 mt-1">{{tokenAddress}}</div>
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
.token-item {
  height: 48px;
}
.logo {
  width: 24px;
  height: 24px;
  border-radius: 24px
}
</style>
