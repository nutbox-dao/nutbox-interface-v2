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
                  <div class="font-bold banner1-sub-title font20 line-height20 mt-1">
                    <span>Bootstrap</span>
                    <span class="text-dot mx-2">·</span>
                    <span>Governance</span>
                    <span class="text-dot mx-2">·</span>
                    <span>Extensions</span>
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
              <div class="s2-card s2-card-1 font20 line-height28 font-bold">
                <div class="text-left">Create a DAO in minutes, and everyone can build it without coding.</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="s2-card s2-card-2 font20 line-height28 font-bold">
                <div class="text-left">It's easy to bring DeFi, social media and Governance to the community.</div>
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 1.6rem">
            <div class="col-md-4 mb-md-0 mb-3">
              <div class="s2-card2 s2-card2-1">
                <img src="~@/static/images/home-s3-img1.svg" alt="">
                <div class="value font40 line-height40 font-bold mt-2 mb-1">{{ walnutInfo.totalCommunities }}</div>
                <div class="label font20 line-height20 text-grey-7">Community</div>
                <div v-if="loading" class="c-loading c-loading-absolute"></div>
              </div>
            </div>
            <div class="col-md-4 mb-md-0 mb-3">
              <div class="s2-card2 s2-card2-2">
                <img src="~@/static/images/home-s3-img2.svg" alt="">
                <div class="value font40 line-height40 font-bold mt-2 mb-1">{{ walnutInfo.totalUsers }}</div>
                <div class="label font20 line-height20 text-grey-7">Member</div>
                <div v-if="loading" class="c-loading c-loading-absolute"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="s2-card2 s2-card2-3">
                <img src="~@/static/images/home-s3-img3.svg" alt="">
                <div class="value font40 line-height40 font-bold mt-2 mb-1">{{ tvl | formatPrice(true) }}</div>
                <div class="label font20 line-height20 text-grey-7">TVL</div>
                <div v-if="loadingTvl" class="c-loading c-loading-absolute"></div>
              </div>
            </div>
          </div>
        </section>
        <section class="section3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="font-bold">Featured Communities</div>
            <div class="d-flex align-items-center text-grey-9f font14 line-height18 hover" @click="$router.push('/community/index')">
              <span>More</span>
              <i class="more-text-icon"></i>
            </div>
          </div>
          <div class="cards-box cards-box-col4 mt-3" :class="'col4-items-'+recommendCommunity.length">
            <div class="card-item" v-for="(cItem, index) of recommendCommunity" :key="index">
              <CommunityCard btn-class="gradient-outline-btn"
                             :card-info="cItem"/>
            </div>
          </div>
        </section>
        <section @click="gotoOfficial" class="my-3 font-bold font20 text-center hover">
          About Nutbox
          <p/>
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
      loadingAllCommunity: true,
      loading: true,
      loadingTvl:false
    }
  },
  computed: {
    ...mapState(['prices', 'tvl']),
    ...mapState('web3', ['walnutInfo']),
    ...mapState('community', ['allCommunityInfo']),
    ...mapState('steem', ['vestsToSteem']),
    ...mapState('hive', ['vestsToHive']),
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
  methods: {
    gotoOfficial() {
      window.open('https://nutbox.io', '_blank')
    }
  },
  async mounted () {
    getWalnutData().then((res) => {
      this.loading = false
    })
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
  background-image: url("~@/static/images/home-bg1.svg"), url("~@/static/images/home-bg2.png");
  background-repeat: no-repeat;
  background-position: 70% -2rem, 45% 35%;
  background-size: 45%, 50%;
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
    font-size: 36px;
    line-height: 40px;
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
    white-space: nowrap;
    &:hover {
      background-image: linear-gradient(to right, #4826DF, #4826DF);
    }
  }
}
.section2 {
  .s2-card {
    @include card(2.5rem);
    background-origin: padding-box;
    border: none;
    padding-right: 10rem;
    background-size: 100%, 5rem, 7.5rem auto;
    background-repeat: no-repeat;
    background-position: right bottom, 0 0, 95% bottom;
    &-1 {
      background-image:
        linear-gradient(-120deg,rgba(205, 80, 203, 0.3), rgba(78, 40, 222, 0) 20%),
        url("~@/static/images/home-s2-img1.png"),
        url("~@/static/images/home-s2-img2.png");
    }
    &-2 {
      background-image:
        linear-gradient(-120deg,rgba(205, 80, 203, 0.3), rgba(78, 40, 222, 0) 20%),
        url("~@/static/images/home-s2-img1.png"),
        url("~@/static/images/home-s2-img3.png");
    }
  }
  .s2-card2 {
    position: relative;
    @include card(1rem);
    border: transparent;
    box-shadow: 0 1px 2px 0 rgba(white, 0.2) inset;
    text-align: center;
    background-repeat: no-repeat;
    background-position: center bottom;
    &-1 {
      background-image: url("~@/static/images/home-s2-img4.svg");
    }
    &-2 {
      background-image: url("~@/static/images/home-s2-img5.svg");
    }
    &-3 {
      background-image: url("~@/static/images/home-s2-img6.svg");
    }
    .value {
      line-height: 2.8rem;
    }
  }
}
.section3 {
  flex: 1;
  margin-top: 3.2rem;
  .more {
    cursor: pointer;
  }
  .more-text-icon {
    @include icon(1rem, 1rem);
    background-image: url("~@/static/images/right-arrow.svg");
  }
  .card-item {
    width: 308px;
    height: 336px;
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
@media (max-width: 1120px) {
  .section2 .s2-card {
    padding-right: 7.5rem;
  }
}
@media (max-width: 960px) {
  .section2 .s2-card {
    padding-right: 2rem;
    background-size: 100%, 5rem, 5.5rem auto;
  }
  .banner1-sub-title {
    display: flex;
    flex-direction: column;
  }
  .text-dot {
    display: none;
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
  .section1 .s1-btn {
    padding: 0 10px;
  }
  .section2 {
    .s2-card {
      padding: 1rem 3rem 1rem 1rem;
      font-size: 18px;
      background-position: right bottom, 0 0, right bottom;
    }
  }
}
</style>
