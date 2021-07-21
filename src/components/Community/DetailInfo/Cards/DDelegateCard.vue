<template>
  <div class="c-card">
    <div class="card-title-box flex-start-center">
      <div class="card-single-icon mr-2">
        <img class="icon1" src="~@/static/images/logo_small.png" alt="" />
      </div>
      <div class="card-link-title-text">
        <div class="title-text font20 font-bold link-title">
          <span>代理挖矿</span>
        </div>
      </div>
    </div>
    <div class="text-left mt-3">
      <span style="color: #717376;" class="font-bold">PNUT </span>
      <span style="color: #BDBFC2">EARNED</span>
    </div>
    <div class="btn-row">
      <span class="value"> 0.001 </span>
      <div class="right-box">
        <button class="primary-btn m-0">Harvest</button>
      </div>
    </div>
    <div class="text-left mt-3 mb-1">
      <span style="color: #717376;" class="font-bold">STEEM POWER</span>
      <span style="color: #BDBFC2"> STAKED</span>
    </div>
    <div class="btn-row mb-4">
      <span class="value"> 0.001 </span>
      <div class="right-box">
        <button class="outline-btn">-</button>
        <button class="outline-btn">+</button>
      </div>
    </div>
    <div class="detail-info-box">
      <div class="project-info-container">
        <span class="name"> TVL </span>
        <div class="info">--</div>
      </div>
      <div class="project-info-container">
        <span class="name"> APY </span>
        <div class="info">13.0%</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'DStakingCard',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
.btn-row {
  @include c-flex-between-center;
  .value {
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .right-box {
    width: 6rem;
    @include c-flex-between-center;
  }
  .outline-btn {
    background-color: white;
    border: 1px solid var(--primary-custom);
    height: 2.4rem;
    width: 2.4rem;
    border-radius: .8rem;
  }
}
</style>
