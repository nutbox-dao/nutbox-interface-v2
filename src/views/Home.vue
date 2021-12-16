<template>
  <div class="home-page">
    <div class="scroll-content">
      <div class="container">
        <section class="section1">
          <div class="s1-card">
            <div class="row">
              <div class="col-md-8 text-left d-flex flex-column justify-content-between">
                <img class="text-logo" src="~@/static/images/nutbox-text-logo.png" alt="">
                <div>
                  <div class="s1-title s-title">Link Community to Web3.0</div>
                  <div class="row text-grey-7 font-bold">
                    <div class="col-sm-4">Staking-based Bootstrap</div>
                    <div class="col-sm-4">DAO Goverance</div>
                    <div class="col-sm-4">Community Service</div>
                  </div>
                </div>
                <button @click="$router.replace('/community/index')" class="s1-btn">Explore Communities</button>
              </div>
              <div class="col-md-4 text-right">
                <img class="home-img1" src="~@/static/images/home-s1-img1.png" alt="">
              </div>
            </div>
          </div>
        </section>
        <section class="section2 mt-4">
          <div class="row">
            <div class="col-md-6">
              <div class="s2-card font24 font-bold">
                <div class="text-left">"</div>
                <div class="text-left">It's easy to bring DeFi,social media and Governance to the community</div>
                <div class="text-right">"</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="s2-card font24 font-bold">
                <div class="text-left">"</div>
                <div class="text-left">It's easy to bring DeFi,social media and Governance to the community</div>
                <div class="text-right">"</div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-4">
              <div class="s2-card2">
                <div class="font56 font-bold">{{ walnutInfo.totalCommunities }}</div>
                <div class="text-grey-7">Community</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="s2-card2">
                <div class="font56 font-bold">{{ walnutInfo.totalUsers }}</div>
                <div class="text-grey-7">Member</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="s2-card2">
                <div class="font56 font-bold">{{ tokensTvl }}</div>
                <div class="text-grey-7">TVL</div>
              </div>
            </div>
          </div>
        </section>
        <section class="section3 mt-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="font-bold">Featured Communities</div>
            <div class="more" @click="$router.replace('/community/index')">More >></div>
          </div>
          <div class="row mt-3">
            <div class="col-xl-3 col-md-4 col-sm-6 mb-4" v-for="(cItem, index) of 4" :key="index">
              <CommunityCard btn-class="gradient-outline-btn"
                             :card-info="communityMockData"/>
            </div>
          </div>
        </section>
        <section class="my-4 font-bold font20 text-center">
          About Nutbox
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getWalnutData } from '@/utils/graphql/committee'
import CommunityCard from '@/components/community/CommunityCard'

export default {
  name: 'Home',
  components: { CommunityCard },
  data () {
    return {
      communityMockData: {
        poster: 'https://cdn.wherein.mobi/nutbox/v2/1635409796111',
        is_vip: true,
        icon: 'https://cdn.wherein.mobi/nutbox/v2/1635409783017',
        name: '银禾社区',
        website: 'https://nutbox.io',
        description: '全球最大游戏公会',
        assetLogos: [
          'https://cdn.wherein.mobi/nutbox/v2/1633769085901'
        ],
        apys: ['100'],
        isOfficial: true
      }
    }
  },
  computed: {
    ...mapState('web3', ['walnutInfo']),
    tokensTvl () {
      return 0
    }
  },
  mounted () {
    getWalnutData()
  }
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
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
.section1 {
  position: relative;
  background-size: 50% 100%, auto 100%;
  background-repeat: no-repeat;
  background-position: left top, right top;
  .s1-card {
    @include card(2rem 3rem, transparent);
    border-radius: .8rem 5rem .8rem 5rem;
    background-image:
      linear-gradient(to bottom, rgba(191, 191, 191, 0.05), rgba(255, 255, 255, 0.05));
  }
  .text-logo {
    height: 1.2rem;
    width: fit-content;
    object-fit: contain;
    object-position: left;
  }
  .s1-title {
    font-size: 1.8rem;
    line-height: 3.6rem;
    font-weight: bolder;
    width: fit-content;
  }
  .home-img1 {
    width: 60%;
  }
  .s1-btn {
    height: 2.4rem;
    padding: 0 2.5rem;
    color: white;
    background-image: linear-gradient(to right, #D252CB, #4826DF);
    border-radius: 3.2rem;
    border: transparent;
    width: fit-content;
    font-size: 1rem;
    font-weight: bolder;
  }
}
.section2 {
  .s2-card {
    @include card();
    background-image:
      linear-gradient(-120deg,rgba(205, 80, 203, 0.3), rgba(78, 40, 222, 0) 20%);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: right bottom;
  }
  .s2-card2 {
    @include card();
  }
}
.section3 {
  flex: 1;
  .s3-title {
    margin-left: 8rem;
  }
  .more {
    cursor: pointer;
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
  background-image:-webkit-linear-gradient(left,#FADDC5,#B6B9F8);
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
