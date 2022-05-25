<template>
  <div class="bsc-pool-modal position-relative">
    <i class="modal-back-icon" @click="$emit('back')"></i>
    <div class="bsc-pool-modal-content overflow-hidden d-flex flex-column">
      <div class="my-4 mb-3 modal-title">Create Dapp-Staking pool on {{chainName}}</div>
      <div class="col-lg-8 mx-auto flex-fill overflow-auto">
        <div class="font14 line-height14 text-center text-grey-7 mb-3">Choose a Dapp to create pool</div>
        <div class="token-list-card mb-2">
          <div class="list-item"  v-for="dapp of recommendDapps" :key="dapp.address" @click="$emit('confirm', dapp)">
            <TokenItem :logo="dapp.icon"
                       :token-name="dapp.name"
                       :token-address="dapp.address"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenItem from '@/components/community/TokenItem'
import { mapState } from 'vuex'
import { BSC_CHAIN_NAME } from '@/config'

export default {
  name: 'StakingDappPool',
  components: { TokenItem },
  data () {
    return {
      chainName: BSC_CHAIN_NAME,
    }
  },
  computed: {
    ...mapState('dappstaking', ['dappsInfo']),
    recommendDapps() {
      return this.dappsInfo || []
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.bsc-pool-modal-content {
  height: 60vh;
}
.divide-line {
  width: 50%;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(to right, var(--card-broder), var(--card-broder)),
    linear-gradient(to right, var(--card-broder), var(--card-broder));;
  background-size: 30% 2px, 30% 2px;
  background-position: left center, right center;
}
.token-list-card {
  @include card(20px 0, var(--input-bg), auto, fit-content);
  max-height: 330px;
  border: 1px solid var(--text-74);
  .list-item {
    cursor: pointer;
    padding: .2rem 1.2rem;
  }
  .list-item:hover {
    background-color: #272828;
  }
}
</style>
