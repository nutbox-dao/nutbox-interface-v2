<template>
  <div class="wallet-card">
    <div class="top flex-between-center">
      <img src="~@/static/images/logo_small.png" alt="" class="logo" />
      <div class="balance-right flex-full">
        <div class="d-flex justify-content-between align-items-start font-bold">
          <div class="d-flex flex-column align-items-start justify-content-between">
            <div class="font16">STEEM POWER</div>
            <div class="font12 text-grey-light">STEEM</div>
          </div>
          <span class="font16">0.000</span>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <button class="primary-btn" >Approve Contract </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SteemCard'
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/wallet-card";
.wallet-card {
  border: 2px solid transparent;
  &:hover {
    box-shadow: 0 2px 20px #FFE973;
    border: 2px solid #FFDB1B;
    box-sizing: border-box;
  }
  .top {
    margin-bottom: 0;
  }
  .btn-group {
    margin-top: 1rem;
  }
}
</style>
