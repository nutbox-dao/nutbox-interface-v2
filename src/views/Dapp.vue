<template>
  <div class="dapp-page">
    <div class="scroll-content">
      <section class="section1">
        <div class="container">
          <div class="text-img text-left">
            <img class="img1" src="~@/static/images/dapp-img1.svg" alt="">
          </div>
          <div class="desc text-left">Nutbox Walnut 提供各类 DAPP ，社区可一键部署，开启CommunityFi</div>
          <div class="text-img text-right">
            <img class="img2" src="~@/static/images/dapp-img2.svg" alt="">
          </div>
          <button class="search-btn w-75">Search</button>
        </div>
      </section>
      <section class="section2">
        <img class="section-bg1" src="~@/static/images/home-s2-img2.svg" alt="">
        <img class="section-bg2" src="~@/static/images/home-s2-img3.svg" alt="">
        <div class="container">
          <div class="s-title">Walnut Core DAPP</div>
          <div class="s-box">
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Staking</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Governance</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Blog</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">NFT</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Game</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Coming<br>Soon</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
          </div>
        </div>
      </section>
      <section class="section3">
        <img class="section-bg1" src="~@/static/images/home-s2-img2.svg" alt="">
        <div class="container">
          <div class="s-title mr-0 ml-auto">Popular DAPP</div>
          <div class="s-box">
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img2.png" alt="">
              <div class="box-content">NFT</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img2.png" alt="">
              <div class="box-content">Game</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img2.png" alt="">
              <div class="box-content">Coming<br>Soon</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
          </div>
        </div>
      </section>
      <section class="section4">
        <img class="section-bg2" src="~@/static/images/home-s2-img3.svg" alt="">
        <div class="container">
          <div class="s-title">New to Community</div>
          <div class="s-box">
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">NFT</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Gambling</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
            <div class="box-item box-item-bg1">
              <img src="~@/static/images/dapp-item-img1.png" alt="">
              <div class="box-content">Coming<br>Soon</div>
              <div class="flag-border"><div class="flag"><span>GET</span></div></div>
            </div>
          </div>
        </div>
      </section>
      <section class="section5">
        <div class="container">
          <div class="s-title mr-0 ml-auto">Popular DAPP</div>
          <button class="upload-btn w-100">Upload your DAPP to Earn cToken</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dapp'
}
</script>

<style scoped lang="scss">
$home-primary-color: #F8B62A;
.dapp-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #16223B;
  color: white;
}
.s-title {
  font-size: 2.8rem;
  background-image:-webkit-linear-gradient(left,#3F75D5,#D27947);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  width: fit-content;
}
.s-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  .box-item {
    position: relative;
    margin: 1.2rem 0;
    img {
      width: 100%;
    }
    .box-content {
      position: absolute;
      top: 50%;
      left: 46%;
      transform: translate(-50%, -50%);
      font-size: 1rem;
      font-weight: bolder;
      background-image:-webkit-linear-gradient(left,#D252CB,#4826DF);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      width: 100%;
      line-height: 1.2rem;
    }
  }
  .flag-border {
    position: absolute;
    top: .8rem;
    right: 1.6rem;
    background-image: linear-gradient(90deg, white, #533BDA);
    border-radius: 2.1rem;
    height: 2.1rem;
    padding: 2px;
    .flag {
      height: 100%;
      width: 100%;
      border-radius: 2.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 1.1rem;
      font-size: 1.6rem;
      line-height: 1.6rem;
      background-color: #16223B;
      font-weight: 900;
    }
    span {
      background-image:-webkit-linear-gradient(left,#D252CB,#4826DF);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
    }
  }
}
.section1 {
  position: relative;
  background-image:
    linear-gradient(135deg, #5B98D6, rgba(66, 44, 148, 0.8), rgba(22, 34, 59, 0) 35%);
  background-size: 50% 100%;
  background-repeat: no-repeat;
  padding-top: 6.8rem;
  background-position: left top;
  .text-img img {
    width: 80%;
    height: fit-content;
  }
  .img1 {
    object-position: left;
  }
  .img2 {
    object-position: right;
  }
  .desc {
    font-size: 1.2rem;
    margin: .8rem 0;
  }
  .search-btn {
    height: 3.4rem;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 3.4rem;
    background-color: rgba(255, 255, 255, 0.7);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(96, 114, 200, 0.8), rgba(189, 158, 201, 0.8));
    font-size: 2rem;
    font-weight: bolder;
    color: white;
    margin-top: 3.2rem;
  }
}
.section2 {
  position: relative;
  padding-top: 5.3rem;
  padding-bottom: 5rem;
  .section-bg1 {
    position: absolute;
    left: 0;
    top: -15%
  }
  .section-bg2 {
    position: absolute;
    right: 0;
    bottom: -10%;
  }
}
.section3 {
  position: relative;
  padding-top: 5.3rem;
  padding-bottom: 5rem;
  .section-bg1 {
    position: absolute;
    left: 0;
    bottom: -15%
  }
}
.section4 {
  position: relative;
  padding-top: 5.3rem;
  padding-bottom: 5rem;
  .section-bg2 {
    position: absolute;
    right: 0;
    bottom: -20%;
  }
}
.section5 {
  padding-top: 3rem;
  padding-bottom: 23rem;
  background-image:
    linear-gradient(-30deg,rgba(43, 102, 163, .68),rgba(39, 90, 145, 0.2), rgba(22, 34, 59, 0) 35%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: right bottom;
  .upload-btn {
    height: 5rem;
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 1.4rem;
    background-color: rgba(255, 255, 255, 0.7);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(96, 114, 200, 0.8), rgba(189, 158, 201, 0.8));
    font-size: 2rem;
    font-weight: bolder;
    color: white;
    margin-top: 2.5rem;
  }
}
@media (max-width: 760px) {
  .s-title {
    font-size: 2rem;
  }
  .s-box {
    .flag-border {
      height: 1.8rem;
    }
    .flag-border .flag {
      font-size: .8rem;
    }
  }
  .section1 {
    .text-img img {
      height: 5rem;
    }
  }
  .section2, .section3, .section4{
    padding-bottom: 2rem;
    .section-bg1, .section-bg2{
      width: 7rem;
    }
    .sub-title {
      padding: 0 .75rem;
      margin-bottom: 2rem;
      margin-top: 1.2rem;
    }
  }
  .section5 {
    padding-bottom: 8rem;
    .upload-btn {
      height: 3.4rem;
      font-size: 1rem;
    }
  }
}
</style>
