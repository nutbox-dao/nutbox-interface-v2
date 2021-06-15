<template>
  <div class="c-card">
    <div class="card-top mt-4">
      <div class="card-title-box flex-start-center">
        <div class="card-icons">
          <img class="icon1" src="~@/static/images/tokens/dot.png" alt="">
          <img class="icon2" src="~@/static/images/logo_small.png" alt="">
        </div>
        <div class="title-text font20 font-bold ml-2">
          <span>PNUT-TRX LP</span>
        </div>
      </div>
      <div class="h-line mt-4 mb-3"></div>
      <div class="project-info-container">
        <span class="name">质押用户数</span>
        <div class="info">8282128</div>
      </div>
      <div class="project-info-container">
        <span class="name">总质押价值</span>
        <div class="info">$1000.00.00</div>
      </div>
      <div class="project-info-container">
        <span class="name">已挖Token</span>
        <div class="info">10000000</div>
      </div>
      <div class="project-info-container">
        <span class="name">APY</span>
        <b-input type="number" class="apy-input" placeholder="请输入"></b-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StakePoolCard'
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
.apy-input {
  width: 50%;
  border: none;
  background: #F6F7F9;
  border-radius: .8rem;
  text-align: center;
  font-size: .8rem;
  height: 2.4rem;
  &::-webkit-input-placeholder {
    color: #BDBFC2;
  }

}
</style>
