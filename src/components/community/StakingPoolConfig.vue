<template>
  <div class="pool-config-modal">
    <div class="pool-config-modal-content overflow-hidden d-flex flex-column">
      <i v-if="enableBack" class="modal-back-icon" @click="$emit('back')"></i>
      <div v-else class="text-right">
        <i class="modal-close-icon" @click="$emit('close')"></i>
      </div>
      <div class="mt-2 mb-4 text-center">{{ type === 'create' ? 'Create new pool' : 'Pool Configuration' }}</div>
      <div class="col-lg-10 mx-auto flex-fill overflow-auto">
        <div class="custom-form pool-form">
          <b-form-group class="mb-4"
                        v-if="type === 'create' && activePools.length > 0"
                        label-class="overflow-hidden text-grey-7"
                        label-cols-md="3" content-cols-md="9"
                        label="Pool Name">
            <b-form-input class="input-border" type="text" v-model="activePools[activePools.length-1].name"></b-form-input>
          </b-form-group>
          <div class="mb-2">Pool Ratios</div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group :label="pool.name"
                            label-cols="4" content-cols="8"
                            v-for="(pool, inputIndex) of activePools" :key="inputIndex">
                <div class="c-input-group d-flex">
                  <b-form-input :data-label="pool.name"
                                v-model="pool.ratio"
                                @input="inputChange" step="0.01" type="number"></b-form-input>
                  <span class="c-append">%</span>
                </div>
              </b-form-group>
            </div>
            <div class="col-md-6 p-0">
              <PoolRatio style="margin-top: -3rem" :pools-data="activePools.map(p => (p.ratio / 10000).toFixed(2))" :show-legend-info="false"/>
            </div>
          </div>
          <div class="d-flex mt-3">
            <button class="primary-btn mx-2">OK</button>
            <button class="primary-btn mx-2" @click="$emit('close')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import PoolRatio from '@/components/community/PoolRatio'
import { mapState } from 'vuex'

export default {
  name: 'StakingPoolConfig',
  components: { PoolRatio },
  props: {
    enableBack: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "config" // create
    },
    form: {
      type: Object,
      default: () => {
        return {
          assetId: '',
          name: '',
          ratios: [10, 20, 30]
        }
      }
    }
  },
  computed: {
    ...mapState('community', ['communityData'])
  },
  data () {
    return {
      activePools:[],
    }
  },
  methods: {
    inputChange: debounce(function () {
      this.activePools.map((item, index) => {
        item.value = this.form.ratios[index]
      })
      this.activePools[this.activePools.length - 1].name =
        this.form.name
    }, 1500)
  },
  mounted () {
    console.log(124, this.communityData);
    this.activePools = this.communityData.pools.filter(p => p.status === 'OPENED');
    console.log(this.type);
    if (this.type === 'create'){
      console.log(this.type);
      this.activePools.push({name: 'test', ratio: 1000})
      console.log(444, this.activePools);
    }
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

</style>
