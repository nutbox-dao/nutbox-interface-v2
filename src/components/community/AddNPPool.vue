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
        <div class="col-xl-4 col-md-6 mb-4" v-for="(pool, index) of pendingPool" :key="pool.id">
          <div class="pool-item" :class="selectIndex===index?'active':''"
               @click="selectIndex=index">
            <ManageStakingCard :pool="pool" :isCreateGauge="true"/>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex mt-3 justify-content-center">
      <button class="dark-btn mx-2 w-25" :disabled="creatingGauge" @click="$emit('close')">Cancel</button>
      <button class="primary-btn mx-2 w-25" :disabled="creatingGauge" @click="createGauge">
         <b-spinner small type="grow" v-show="creatingGauge"></b-spinner>
        OK
      </button>
    </div>
  </div>
</template>

<script>
import ManageStakingCard from '@/components/community/ManageStakingCard'
import { addNewGauge } from '@/utils/nutbox/gauge'
import { sleep } from '@/utils/helper'
import { handleApiErrCode } from '../../utils/helper'

export default {
  name: 'AddNPPool',
  components: { ManageStakingCard },
  props: {
    pendingPool: {
      type: Array,
      default: []
    },
  },
  data () {
    return {
      selectIndex: 0,
      creatingGauge: false
    }
  },
  methods: {
    async createGauge() {
      console.log('select', this.selectIndex);
      const pool = this.pendingPool[this.selectIndex]
      try {
        this.creatingGauge = true
        const hash = await addNewGauge(pool.id)
        pool.hasCreateGauge = true;
        this.$bvToast.toast("Create a new vote for pool", {
          title: this.$t('tip.success'),
          variant: "success"
        })
      }catch(e) {
        console.log('Creage new gauge fail:', e);
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      }finally{
        this.creatingGauge = false
      }
    }
  },
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
