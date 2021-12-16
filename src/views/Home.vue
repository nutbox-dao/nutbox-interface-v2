<template>
  <div class="home-page">
    <div class="scroll-content">
      <div class="container">
        <section class="section1">
          <div class="s1-card">
            <div class="row">
              <div class="col-md-8 text-left d-flex flex-column justify-content-between">
                <img class="text-logo" src="~@/static/images/nutbox-text-logo.png" alt="">
                <div class="mt-3">
                  <div class="s1-title s-title">Link Community to Web3.0</div>
                  <div class="row font-bold">
                    <div class="col-sm-4">Staking-based Bootstrap</div>
                    <div class="col-sm-4">DAO Goverance</div>
                    <div class="col-sm-4">Community Service</div>
                  </div>
                </div>
                <button @click="$router.replace('/community/index')"
                        class="s1-btn mt-3">Explore Communities</button>
              </div>
            </div>
          </div>
          <img class="home-img1" src="~@/static/images/home-s1-img1.png" alt="">
        </section>
        <section class="section2 mt-4">
          <div class="row">
            <div class="col-md-6 mb-md-0 mb-3">
              <div class="s2-card font24 font-bold">
                <div class="text-left">It's easy to bring DeFi,social media and Governance to the community</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="s2-card font24 font-bold">
                <div class="text-left">It's easy to bring DeFi,social media and Governance to the community</div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-4 mb-md-0 mb-3">
              <div class="s2-card2">
                <img src="~@/static/images/home-s3-img1.svg" alt="">
                <div class="value font46 font-bold">{{ walnutInfo.totalCommunities }}</div>
                <div class="label text-grey-7">Community</div>
              </div>
            </div>
            <div class="col-md-4 mb-md-0 mb-3">
              <div class="s2-card2">
                <img src="~@/static/images/home-s3-img2.svg" alt="">
                <div class="value font46 font-bold">{{ walnutInfo.totalUsers }}</div>
                <div class="label text-grey-7">Member</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="s2-card2">
                <img src="~@/static/images/home-s3-img3.svg" alt="">
                <div class="value font46 font-bold">{{ tokensTvl }}</div>
                <div class="label text-grey-7">TVL</div>
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
            <div class="col-xl-3 col-md-4 col-sm-6 mb-4" v-for="(cItem, index) of recommendCommunity" :key="index">
              <CommunityCard btn-class="gradient-outline-btn"
                             :card-info="cItem"/>
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
import { getAllCommunities } from '@/utils/web3/community'

export default {
  name: 'Home',
  components: { CommunityCard },
  data () {
    return {
      loadingAllCommunity: true
    }
  },
  computed: {
    ...mapState('web3', ['walnutInfo']),
    ...mapState('community', ['allCommunityInfo']),
    tokensTvl () {
      return 0
    },
    recommendCommunity () {
      if (!this.allCommunityInfo) {
        this.loadingAllCommunity = false
        return [];
      }
      let rcs = []
      for (let c in this.allCommunityInfo) {
        const community = this.allCommunityInfo[c]
        if (community.isRecommend === 1){
          rcs.push(community)
        }
      }
      this.loadingAllCommunity = false
      return rcs;
    }
  },
  mounted () {
    getWalnutData()
    getAllCommunities()
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
    background-image: url("~@/static/images/home-bg1.svg"), url("~@/static/images/home-bg2.png");
    background-repeat: no-repeat;
    background-position: 70% -2rem, 45% 35%;
    background-size: 45%, 50%;
  }
}
.section1 {
  position: relative;
  background-size: 50% 100%, auto 100%;
  background-repeat: no-repeat;
  background-position: left top, right top;
  margin-top: 3rem;
  .s1-card {
    @include card(2.5rem 3rem, transparent);
    border-radius: .8rem 5rem .8rem 5rem;
    background-image: url("~@/static/images/home-s1-bg1.png");
    background-size: 100% 100%;
    background-origin: padding-box;
    background-repeat: no-repeat;
  }
  .text-logo {
    height: 1.2rem;
    width: fit-content;
    object-fit: contain;
    object-position: left;
  }
  .s1-title {
    font-size: 1.8rem;
    line-height: 2rem;
    font-weight: bolder;
    width: fit-content;
  }
  .home-img1 {
    position: absolute;
    width: 35%;
    right: 1rem;
    bottom: 0;
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
    @include card(2.5rem);
    background-image:
      linear-gradient(-120deg,rgba(205, 80, 203, 0.3), rgba(78, 40, 222, 0) 20%),
      url("~@/static/images/home-s2-img1.png"),
      url("~@/static/images/home-s2-img2.png");
    background-size: 100%, 5rem, 5rem;
    background-repeat: no-repeat;
    background-position: right bottom, 0 0, right 135%;
    background-origin: padding-box;
    border: none;
  }
  .s2-card2 {
    @include card(1rem);
    .value {
      line-height: 2.8rem;
    }
  }
}
.section3 {
  flex: 1;
  .more {
    cursor: pointer;
  }
}
.s-title {
  background-image:-webkit-linear-gradient(left,#FADDC5,#B6B9F8);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  width: fit-content;
}
@media (max-width: 1200px) {
  .section1 {
    .home-img1 {
      bottom: 50%;
      transform: translateY(50%);
    }
  }
}
@media (max-width: 767px) {
  .section1 {
    .home-img1 {
      opacity: .4;
    }
  }
}
@media (max-width: 500px) {
  .section2 {
    .s2-card {
      background-position: right bottom, 0 0, right bottom;
    }
  }
}
</style>
