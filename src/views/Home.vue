<template>
  <div class="home-page">
    <div class="scroll-content">
      <section class="section1">
        <div class="container">
          <div class="row">
            <div class="col-md-6 text-left d-flex flex-column justify-content-center box-left">
              <img class="text-logo" src="~@/static/images/nutbox-text-logo.png" alt="">
              <div class="s1-title">
                Link Community <br>
                to Web3.0
              </div>
              <div class="font18">
                Staking-based Bootstrap <br>
                DAO Goverance <br>
                Community Service
              </div>
              <button class="s1-btn">Explore</button>
            </div>
            <div class="col-md-6 box-right">
              <img class="home-img1" src="~@/static/images/home-s1-img1.png" alt="">
            </div>
          </div>
        </div>
      </section>
      <section class="section2">
        <img class="section-bg1" src="~@/static/images/home-s2-img2.svg" alt="">
        <img class="section-bg2" src="~@/static/images/home-s2-img3.svg" alt="">
        <div class="s-title s2-title">Community</div>
        <div class="sub-title">it's easy to bring DeFi,social media and Governance to the community</div>
        <div class="s-box">
          <div class="box-item box-item-s2">
            <img class="box-icon" src="~@/static/images/home-s2-icon1.svg" alt="">
            <div class="label">Users</div>
            <div class="value">10,000,000</div>
          </div>
          <div class="box-item box-item-s2">
            <img class="box-icon" src="~@/static/images/home-s2-icon2.svg" alt="">
            <div class="label">Communnity</div>
            <div class="value">10,000</div>
          </div>
          <div class="box-item box-item-s2">
            <img class="box-icon" src="~@/static/images/home-s2-icon3.svg" alt="">
            <div class="label">Proposals</div>
            <div class="value">1,000</div>
          </div>
        </div>
      </section>
      <section class="section3">
        <div class="s3-offset">
          <div class="container">
            <div class="s-title s3-title">Staking</div>
            <div class="sub-title">
              It only takes 5 minutes to configure the community
              Staking mining module and start the community Staking Economy</div>
          </div>
          <div class="s-box">
            <div class="box-item box-item-s3">
              <div class="label">Staking</div>
              <div class="value">100</div>
            </div>
            <div class="box-item box-item-s3">
              <div class="label">Staking Token</div>
              <div class="value">$1,000,000,00</div>
            </div>
            <div class="box-item box-item-s3">
              <div class="label">TVL</div>
              <div class="value">$1,000,000,00</div>
            </div>
          </div>
        </div>
      </section>
      <section class="section4">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-6 d-flex flex-column justify-content-center">
              <div class="s-title m-auto">Nut</div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="box-item-bg">
                <div class="box-item-s4">
                  <div class="label">Price</div>
                  <div class="value">$10</div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="box-item-bg">
                <div class="box-item-s4">
                  <div class="label">Market Cap</div>
                  <div class="value">$1,000,000,00</div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="box-item-bg">
                <div class="box-item-s4">
                  <div class="label">Total Supply</div>
                  <div class="value">$1,000,000,00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped lang="scss">
$home-primary-color: #F8B62A;
.home-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #16223B;
  color: white;
}
.section1 {
  position: relative;
  background-image:
    linear-gradient(135deg, #5B98D6, rgba(66, 44, 148, 0.8), rgba(22, 34, 59, 0) 35%),
    url("~@/static/images/home-s1-img3.svg");
  background-size: 50% 100%, auto 100%;
  background-repeat: no-repeat;
  padding-top: 3.8rem;
  padding-bottom: 2.3rem;
  background-position: left top, right top;
  .box-left {
    text-align: left;
  }
  .text-logo {
    height: 1.2rem;
    width: fit-content;
    object-fit: contain;
    margin-bottom: 2.5rem;
    object-position: left;
  }
  .s1-title {
    font-size: 3.4rem;
    line-height: 3.6rem;
    font-weight: bolder;
    width: fit-content;
    padding-bottom: .8rem;
    background-image: url("~@/static/images/home-s1-img2.svg");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: auto 1.7rem;
    margin-bottom: 1rem;
  }
  .home-img1 {
    margin-top: 3rem;
    width: 26rem;
  }
  .s1-btn {
    height: 3.2rem;
    padding: 0 2.5rem;
    color: #242629;
    background: $home-primary-color;
    border-radius: 3.2rem;
    border: transparent;
    width: fit-content;
    margin-top: 2.4rem;
    font-size: 1.2rem;
    font-weight: bolder;
  }
}
.section2 {
  position: relative;
  padding-top: 11rem;
  padding-bottom: 10rem;
  .section-bg1 {
    position: absolute;
    left: 0;
    top: -10%
  }
  .section-bg2 {
    position: absolute;
    right: 0;
    bottom: -20%;
  }
  .s2-title {
    margin: auto;
  }
  .sub-title {
    color: #BDBFC2;
    font-size: 1rem;
    line-height: 1.2rem;
    margin-top: 2.4rem;
    margin-bottom: 3.5rem;
  }
}
.section3 {
  padding-top: 7rem;
  padding-bottom: 7rem;
  background-image: url("~@/static/images/home-s3-img2.svg");
  background-repeat: no-repeat;
  background-position: left top;
  background-size: auto;
  .s3-offset {
    padding-left: 6.7rem;
  }
  .s3-title {
    margin-left: 8rem;
  }
  .sub-title {
    max-width: 25rem;
    text-align: left;
    margin-left: 8rem;
    margin-bottom: 3.5rem;
    margin-top: 1rem;
    color: #BDBFC2;
  }
}
.section4 {
  padding: 5rem 0;
  background-image:
    linear-gradient(-30deg,rgba(43, 102, 163, .68),rgba(39, 90, 145, 0.2), rgba(22, 34, 59, 0) 35%);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: right bottom;
  .box-item-bg {
    background-image: linear-gradient(150deg, $home-primary-color, white);
    border-radius: 12rem;
    padding: .3rem;
    margin: 1rem 0;
  }
  .box-item-s4 {
    background: #16223B;
    width: 100%;
    padding: 3rem 1rem;
    border-radius: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .label {
      font-size: 1rem;
    }
    .value {
      color: $home-primary-color;
      font-size: 1.8rem;
    }
    @media (min-width: 991px) and (max-width: 1200px) {
      .value {
        color: $home-primary-color;
        font-size: 1.4rem;
      }
    }
  }
}
.s-title {
  font-size: 2.8rem;
  background-image:-webkit-linear-gradient(left,#3F75D5,#D27947);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  width: fit-content;
}
.s-box {
  display: flex;
  justify-content: center;
  .box-item {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-s2 {
      margin: 0 1.8rem;
      height: 19.3rem;
      width: 16.2rem;
      background-image: url("~@/static/images/home-s2-img1.svg");
      .box-icon {
        width: 3.4rem;
        height: 3.4rem;
      }
      .value {
        font-size: 2rem;
        line-height: 2rem;
      }
    }
    &-s3 {
      margin: 0 1rem;
      height: 19.3rem;
      width: 16.2rem;
      background-image: url("~@/static/images/home-s3-img1.svg");
      .value {
        font-size: 1.6rem;
      }
    }
    .label {
      font-size: 1.6rem;
      line-height: 1.6rem;
      margin-top: 1.4rem;
      margin-bottom: .8rem;
      color: $home-primary-color;
      font-weight: bolder;
    }
  }
}

@media (max-width: 760px) {
  .section1 {
    .box-left {
      padding-top: 2rem;
    }
    .s1-title {
      font-size: 2rem;
      line-height: 2.4rem;
    }
    .box-right {
      position: absolute;
      right: 0;
      bottom: 10%;
      text-align: right;
    }
    .home-img1 {
      width: 35%;
    }
  }
  .section2 {
    padding-bottom: 3rem;
    padding-top: 3.5rem;
    .section-bg1, .section-bg2{
      width: 7rem;
    }
    .sub-title {
      padding: 0 .75rem;
      margin-bottom: 2rem;
      margin-top: 1.2rem;
    }
  }
  .s-box {
    .box-item-s2 {
      width: 30%;
      height: 12rem;
      margin: 0 .4rem;
      .box-icon {
        width: 2rem;
        height: 2rem;
      }
      .label {
        font-size: 1rem;
        margin-top: .4rem;
        margin-bottom: .2rem;
      }
      .value {
        font-size: 1rem;
      }
    }
    .box-item-s3 {
      width: 30%;
      height: 10rem;
      margin: 0 .4rem;
      .label {
        font-size: 1rem;
        margin-top: .4rem;
        margin-bottom: .2rem;
      }
      .value {
        font-size: .9rem;
      }
    }
  }
  .section3 {
    padding-top: 2rem;
    padding-bottom: 0;
    background: none;
    .s3-offset {
      padding-left: 0;
    }
    .s3-title, .sub-title {
      margin-left: 0;
    }
    .sub-title {
      margin-bottom: 1rem;
    }
  }
  .section4 {
    padding-top: 3rem;
    .box-item-bg .box-item-s4 {
      padding: 2rem 1rem;
    }
  }
}
</style>
