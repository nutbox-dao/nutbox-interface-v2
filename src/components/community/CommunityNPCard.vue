<template>
  <div class="multi-card">
    <div class="card-link-top-box">
      <div class="d-flex align-items-center">
        <div class="card-link-icons card-link-icons-lg">
          <img class="icon1" src="https://cdn.wherein.mobi/nutbox/v2/1645831114472" alt="">
          <img class="icon2-lg" src="https://cdn.wherein.mobi/nutbox/v2/1645831114472" alt="">
        </div>
        <div class="card-link-title-text font-bold">
          <div class="link-title font20 line-height24">
            <span>Peanut</span>
          </div>
          <div class="link-title font16 line-height20">
            <span>Earn Monns & Nut</span>
          </div>
        </div>
      </div>
    </div>
    <div class="c-card">
      <div>
        <div class="font12 text-grey-7 mb-1">EARNED</div>
        <div class="d-flex justify-content-center align-items-center">
          <div class="flex-1">
            <div class="d-flex align-items-center">
              <div class="d-flex justify-content-between align-items-center font-bold flex-1">
                <span class="font18 line-height18">Moon</span>
                <span class="font24 line-height24">0.0001</span>
              </div>
              <div class="d-flex align-items-center icons-group">
                <i class="copy-icon copy-icon-gray mr-1"></i>
                <i class="link-icon link-icon-gray"></i>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="d-flex justify-content-between align-items-center font-bold flex-1">
                <span class="font18 line-height18">Nut</span>
                <span class="font24 line-height24">0.0001</span>
              </div>
              <div class="d-flex align-items-center icons-group">
                <i class="copy-icon copy-icon-gray mr-1"></i>
                <i class="link-icon link-icon-gray"></i>
              </div>
            </div>
          </div>
          <button class="primary-btn m-0 w-auto d-flex align-items-center">
            {{ $t("operation.harvest") }}
          </button>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-between align-items-center font12 mb-1">
          <div class="text-grey-7">
            <span class="font-bold text-grey-47">NP</span>
            VOTED
          </div>
          <div class="text-grey-47 font-bold">Available：4000</div>
        </div>
        <PoolOperation :card="card"/>
      </div>
      <div class="detail-info-box text-grey-7 font14 font-bold">
        <div class="project-info-container">
          <span class="name">APR</span>
          <div class="info d-flex align-items-center">
            <i class="help-icon mr-1" v-b-popover.hover.top="'Nut50%+Moon45.113%'"></i>
            <span>95.113%</span>
          </div>
        </div>
        <div class="project-info-container">
          <span class="name">Total Staking</span>
          <div class="info">12.323.420</div>
        </div>
        <div class="project-info-container">
          <span class="name">TVL</span>
          <div class="info">$23.413</div>
        </div>
        <div class="project-info-container">
          <span class="name">Stakers</span>
          <div class="info d-flex align-items-center">
            <div :id="user.id + card.id" v-for="(user, index) of stakers" :key="user.id"
                 :style="{zIndex: stakers.length-index}">
              <img class="info-icon" v-if="user.avatar && user.avatar.length > 0" :src="user.avatar" alt="">
              <img v-else class="info-icon" src="~@/static/images/avatars/default.png" alt="">
              <b-popover class="primary-bg" :target="user.id + card.id" triggers="hover focus" placement="top">
                {{ user.name ? user.name : (user.id.slice(0, 6) + '...' + user.id.slice(36, 42)) }}
              </b-popover>
            </div>
            <span class="ml-1" style="line-height: 28px">{{ card.stakersCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PoolOperation from '@/components/community/PoolOperation'
export default {
  name: 'CommunityNPCard',
  components: { PoolOperation },
  data () {
    return {
      card: {
        asset: '0x232c5c39120140b76e3466ee8303465cf4b9c04d',
        chainId: 0,
        community: { id: '0x72701a017a9e0677b9401bf7473da36b1bbb888e' },
        id: '0x3fb7e48eab43fc427360fea8547a78966495b8d4',
        name: 'Stake PNUT-WBNB',
        poolFactory: '0xf870724476912057c807056b29c1161f5fe0199a',
        ratio: 10000,
        stakers: [{ id: '0x092146598ae9be2ca420c0f3503612ed946d1139' }],
        stakersCount: 17,
        status: 'OPENED',
        totalAmount: '5890865817022064098000'
      },
      stakers: [
        { id: '0x092146598ae9be2ca420c0f3503612ed946d1139' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
@import "src/static/css/form";
.icons-group {
  margin-left: 20px;
  margin-right: 10px;
}
</style>
