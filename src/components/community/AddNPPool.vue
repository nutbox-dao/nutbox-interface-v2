<template>
  <div class="np-pool-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-type-modal-content d-flex flex-column">
      <div class="modal-title mt-4">Add a NP vote pool</div>
      <div>
        In order to add a Nut Power vote pool,
        you need choose an existing staking pool.
        Users can earn Nut and c-token from NP vote pool.
      </div>
      <div class="my-3">
        *Nut is  issued by Nutbox contract, c-token is from staking pool's commission.
      </div>
    </div>
    <div class="modal-card-box">
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4" v-for="(pool, index) of 10" :key="pool">
          <div class="pool-item" :class="activePoolId===index?'active':''"
               @click="activePoolId=index">
            <ManageStakingCard :pool="mockData"/>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex mt-3 justify-content-center">
      <button class="dark-btn mx-2 w-25" @click="$emit('close')">Cancel</button>
      <button class="primary-btn mx-2 w-25" @click="$emit('close')">OK</button>
    </div>
  </div>
</template>

<script>
import ManageStakingCard from '@/components/community/ManageStakingCard'
export default {
  name: 'AddNPPool',
  components: { ManageStakingCard },
  data () {
    return {
      activePoolId: '',
      mockData: {
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
      }

    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.np-pool-modal {
  min-height: 400px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-card-box {
  flex: 1;
  overflow: auto;
  border: 2px solid var(--text-47);
  border-radius: 10px;
  padding: 20px;
}
.pool-item {
  border-radius: 16px;
  border: 2px solid transparent;
  &.active {
    border-color: var(--primary-custom);
  }
}
</style>
