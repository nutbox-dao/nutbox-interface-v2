<template>
  <div class="pool-config-modal">
    <div class="pool-config-modal-content overflow-hidden d-flex flex-column">
      <i v-if="enableBack" class="modal-back-icon" @click="$emit('back')"></i>
      <div v-else class="text-right" :disable="!enableOp">
        <i class="modal-close-icon" @click="$emit('close')"></i>
      </div>
      <div class="mt-2 mb-4 text-center">{{ type === 'create' ? 'Create new pool' : 'Pool Configuration' }}</div>
      <div class="col-lg-10 mx-auto custom-form overflow-hidden flex-fill d-flex flex-column">
        <b-form-group class="mb-4"
                      v-if="type === 'create' && activePools && activePools.length > 0"
                      label-class="overflow-hidden text-grey-7"
                      label-cols-md="3" content-cols-md="9"
                      label="Pool Name">
          <b-form-input class="input-border" :placeholder="$t('placeHolder.inputPoolName')" :disabled="!enableOp" type="text" @input="nameChange" v-model="newName"></b-form-input>
        </b-form-group>
        <div class="mb-2">Profit Sharing Ratio</div>
        <div class="pool-chart-box w-100 d-flex">
          <div class="pool-data-box">
            <b-form-group :label="activePools[inputIndex].name"
                          label-cols="4" content-cols="8"
                          v-for="(ratio, inputIndex) of ratios" :key="inputIndex">
              <div class="c-input-group d-flex">
                <b-form-input :data-label="activePools[inputIndex].name"
                              v-model="ratios[inputIndex]"
                              @input="inputChange" step="0.01" type="number"></b-form-input>
                <span class="c-append">%</span>
              </div>
            </b-form-group>
          </div>
          <PoolRatio class="flex-fill" style="margin-top: -2rem" :pools-data="activePools" :show-legend-info="false"/>
        </div>
        <div class="d-flex mt-3">
          <button class="primary-btn mx-2" :disabled="!enableOp" @click="create()">
             <b-spinner small type="grow" v-show="!enableOp" />
            OK
          </button>
          <button class="primary-btn mx-2" :disabled="!enableOp" @click="$emit('close')">
            <b-spinner small type="grow" v-show="!enableOp" />
            Cancel
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import PoolRatio from '@/components/community/PoolRatio'
import { mapState } from 'vuex'
import { sleep } from '@/utils/helper'

export default {
  name: 'StakingPoolConfig',
  components: { PoolRatio },
  props: {
    enableBack: {
      type: Boolean,
      default: true
    },
    enableOp: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "config" // create
    }
  },
  computed: {
    ...mapState('community', ['communityData'])
  },
  data () {
    return {
      activePools:[],
      newName: '',
      ratios: []
    }
  },
  methods: {
    inputChange: debounce(function () {
      this.activePools.map((item, index) => {
        item.ratio = this.ratios[index]
      })
    }, 1000),
    nameChange: debounce(function () {
      this.activePools[this.activePools.length - 1].name = this.newName
    }, 1500),
    // create new pool
    create() {
      if (this.type == 'create') {
        const res = this.activePools.reduce((t, r) => t + parseFloat(r.ratio), 0)
        if (res !== 100) {
          this.$bvToast.toast('Ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.type === 'create' && (!this.newName || this.newName.length === 0)) {
          this.$bvToast.toast('Please input pool name', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        this.$emit('create', this.activePools)
      }else {
        const res = this.activePools.reduce((t, r) => t + parseFloat(r.ratio), 0)
        if (res !== 100) {
          this.$bvToast.toast('Ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        this.$emit('update', this.activePools.map(p => p.ratio))
      }
    }
  },
  async mounted () {
    while(!this.communityData) {
      await sleep(0.3)
    }
    this.activePools = this.communityData.pools.filter(p => p.status === 'OPENED').map(p => ({...p, ratio: p.ratio / 100}));
    this.newName = ''
    if (this.type === 'create'){
      this.activePools.push({name: this.newName, ratio: 100})
    }
    this.ratios = this.activePools.map(p => p.ratio)
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.pool-config-modal-content {
  height: 60vh;
}
.pool-form {
  padding: 1rem 1.2rem 1.2rem;

  .ratios-box {
    display: flex;
    flex-flow: wrap;
  }

  .item-box {
    padding-left: 0.2rem;
    padding-right: 0.8rem;
    @include single-color-bg(0.6rem 0.1rem, right 1.2rem, #bdbfc2);
  }

  .item-box:first-child {
    padding-left: 0;
  }

  .item-box:last-child {
    padding-right: 0;
  }

  .ration-input {
    width: 5.8rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bolder;

    &::after {
      content: "--";
    }
  }
}
@media (min-width: 992px) {
  .pool-chart-box {
    flex: 1;
    overflow: hidden;
  }
  .pool-data-box {
    overflow: auto;
    padding-right: 1rem;
    min-width: 50%;
    width: 50%;
  }
}
@media (max-width: 991px) {
  .pool-chart-box {
    flex-direction: column;
    overflow: auto;
  }
  .pool-data-box {
    box-sizing: border-box;
  }
}
</style>
