<template>
  <div class="page-view-content" >
    <div class="scroll-content container">
      <div class="p-card">
        <img class="poster" :src="communityInfo.poster" alt="">
        <div class="second-card">
          <img class="large-logo" :src="communityInfo.icon" alt="" />
          <div class="project-info text-left">
            <div class="d-flex align-items-center">
              <a class="font20 font-bold title icon-title official-link-icon m-0"
                 :href="communityInfo.website"
                 target="_blank">{{ communityInfo.name || 'Nutbox' }}</a>
              <i class="v-line" v-show="communityInfo.website && communityInfo.website.length > 4"></i>
            </div>
            <div class="desc font14 mt-2"
                 v-html="(communityInfo.description)"></div>
          </div>
        </div>
      </div>
      <div class="c-card">
        <div class="content1 mb-5">
          <div class="title mb-3">Community Token</div>
          <div class="row">
            <div class="col-md-4 d-flex align-items-center token-base-info">
              <img class="token-logo" :src="communityInfo.icon" alt="" />
              <span class="px-3">PNUT</span>
              <div class="token-address">peanut</div>
            </div>
            <div class="col-md-8 flex-between-center">
              <div class="r-item">
                <div class="label mb-2">Price</div>
                <div class="value">$1.2</div>
              </div>
              <div class="r-item">
                <div class="label mb-2">Total Supply</div>
                <div class="value">1200</div>
              </div>
              <div class="r-item">
                <div class="label mb-2">Market Cap</div>
                <div class="value">$1200</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content2 mb-5">
          <div class="title mb-3">Community Token Release</div>
          <Progress :progress-data="progressData"></Progress>
        </div>
        <div class="content3 mb-5">
          <div class="title mb-3">Community Token Release</div>
          <PoolRatio :pools-data="poolsData"/>
        </div>
        <div class="content3 mb-5">
          <div class="title mb-3">Community Token Release</div>
          <div class="custom-form">
            <b-form-group label-cols-md="3"
                          label-align="left"
                          content-cols-md="6"
                          label="Community Fund Address">
              <b-form-input v-model="communityInfo.id" disabled></b-form-input>
            </b-form-group>
            <b-form-group label-cols-md="3"
                          label-align="left"
                          content-cols-md="6"
                          label="Community Fund Address">
              <b-form-input v-model="communityInfo.id" disabled></b-form-input>
            </b-form-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Progress from '@/components/Community/Progress'
import PoolRatio from '@/components/Community/PoolRatio'

export default {
  name: 'Home',
  components: { Progress, PoolRatio },
  data () {
    return {
      communityId: null,
      progressData: [],
      poolsData: [
        { name: 'AAA', value: '100' },
        { name: 'AAA', value: '100' },
        { name: 'AAA', value: '100' },
        { name: 'AAA', value: '100' },
        { name: 'AAA', value: '100' },
        { name: 'AAA', value: '100' }
      ]
    }
  },
  computed: {
    ...mapGetters('web3', ['communityById']),
    communityInfo () {
      const com = this.communityById(this.communityId)
      console.log('communityInfo', com)
      return com
    }
  },
  mounted () {
    this.communityId = this.$route.query.id
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/poster-card";
@import "src/static/css/form";

.p-card {
  height: fit-content;
  margin-top: 3rem;
  .poster{
    @include card-poster-bg(12rem);
    background-color: var(--primary-custom);
  }
  .v-line {
    display: inline-block;
    margin: 0 1rem;
    @include line(1px, 1rem, 0, #E3E5E8)
  }
}
.c-card {
  @include card(2rem, white, hidden, fit-content);
  margin-top: 1rem;
  margin-bottom: 3rem;
  .title {
    @include single-color-bg(.2rem 1.6rem, left center);
    padding-left: 1rem;
    text-align: left;
  }
  .token-logo {
    height: 2.8rem;
    width: 2.8rem;
    @include coin-shadow();
    border-radius: 3rem;
  }
  .token-address {
    background-image: url("~@/static/images/copy.svg");
    background-size: .8rem;
    background-repeat: no-repeat;
    background-position: right center;
    padding-right: 1.4rem;
  }
  .token-base-info {
    border-right: 1px solid var(--dividers);
  }
  .r-item {
    flex: 1;
  }
}
@media (max-width: 767px) {
  .c-card {
    .token-base-info {
      border: none;
      margin-bottom: 1rem;
    }
    .r-item:nth-child(2) {
      border-left: 1px solid var(--dividers);
      border-right: 1px solid var(--dividers);
    }
  }
}
</style>
