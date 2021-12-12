<template>
  <div class="profile-page">
    <div class="scroll-content">
      <div class="container">
        <div class="row">
          <div class="col-md-5 text-left d-flex flex-column justify-content-center">
            <img class="user-avatar hover rounded-circle"
                 src="~@/static/images/home-s2-icon1.svg" alt="">
            <div class="d-flex align-items-center mt-2">
              <b-input class="bg-transparent text-white name-input text-center"
                       :class="isEditName?'edit':''"
                       :disabled="!isEditName"
                       v-model="userName"></b-input>
              <i v-if="!isEditName" class="edit-icon" @click="isEditName=true"></i>
              <span v-else @click="isEditName=false">Save</span>
            </div>
          </div>
          <div class="col-md-7">
            <div class="asset-card row">
              <div class="col-sm-6 d-flex flex-column justify-content-between">
                <div class="mb-3">
                  <div>Total Asset Value</div>
                  <div class="font28 mt-2">$850</div>
                </div>
                <button class="primary-btn mb-2">Detail</button>
              </div>
              <div class="col-sm-6 position-relative">
                <PoolRatio class="asset-chart"
                           style="top: -3rem; width: 100%; max-width: 16rem"
                           :pools-data="assetValue" :show-legend-info="false"/>
              </div>
            </div>
          </div>
        </div>
        <div class="font-bold mt-5 mb-3">Joined Communities</div>
        <div class="row">
          <div class="col-md-4"></div>
        </div>
        <div class="font-bold mt-5 mb-3">Staked Pools</div>
      </div>
    </div>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio'
export default {
  name: 'Profile',
  components: { PoolRatio },
  data () {
    return {
      userName: 'AAA',
      isEditName: false,
      assetValue: [
        { name: 'PNUT', ratio: 20 },
        { name: 'PNUT', ratio: 20 },
        { name: 'PNUT', ratio: 20 }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.user-avatar {
  width: 6rem;
  height: 6rem;
}
.name-input {
  width: 6rem;
  border-color: transparent;
  border-radius: 0;
  &.edit {
    border-bottom: 1px solid var(--dividers);
  }
}
.edit-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/edit-icon.svg");
}
.asset-card {
  @include card();
  height: 13rem;
  .asset-chart {
    position: absolute;
  }
}
@media (max-width: 576px) {
  .asset-card {
    height: auto;
    .asset-chart {
      display: none;
    }
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .asset-card {
    height: 10rem;
  }
}
</style>
