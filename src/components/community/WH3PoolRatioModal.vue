<template>
  <div class="pool-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-modal-content overflow-auto d-flex flex-column justify-content-center pt-4">
      <div class="mb-2 font14 line-height14 text-center pt-4">{{ $t('pool.ratioTip') }}</div>
      <div class="row align-items-center">
        <div class="col-12 col-xl-5">
          <b-form-group label-cols="12"
                        label-class="overflow-hidden font14 line-height14 d-flex align-items-center"
                        content-cols="12"
                        v-for="(pool, inputIndex) of activePools" :key="inputIndex"
                        :label="pool.name">
            <div class="c-input-group c-input-group-bg-dark d-flex">
              <b-form-input :data-label="pool.name"
                            v-model="pool.ratio"
                            @input="inputChange" step="0.01"
                            type="number"></b-form-input>
              <span class="c-append">%</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-xl-7 text-center">
          <PoolRatio class="flex-fill justify-content-center" style="margin-top: -2rem"
                     canvas-id="social-pool-chart"
                     :pools-data="activePools" :show-legend-info="false"/>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-center mt-3">
      <button class="primary-btn w-50 mx-0 d-flex align-items-center px-3"
              @click="confirm"
              :disabled="loading">
        <span>{{$t('operation.confirm')}}</span>
        <b-spinner v-show="loading" class="ml-1" small></b-spinner>
      </button>
    </div>
  </div>
</template>

<script>
import PoolRatio from '@/components/community/PoolRatio.vue'
import debounce from 'lodash.debounce'
import i18n from '@/i18n'
export default {
  name: 'WH3PoolRatioModal',
  components: { PoolRatio },
  props: {
    poolPercentage: {
      type: Array,
      default: []
    },
  },
  data () {
    return {
      activePools: [
        { name: i18n.t('socialView.communityContent'), ratio: 40 },
        { name: i18n.t('socialView.curation'), ratio: 30 },
        { name: 'Space', ratio: 30 }
      ],
      loading: false
    }
  },
  methods: {
    inputChange: debounce(function (e) {
      console.log(e)
    }, 1000),
    confirm() {
      this.loading = true;
      // check sum
      if (parseFloat(this.activePools[0].ratio)
        + parseFloat(this.activePools[1].ratio)
        + parseFloat(this.activePools[2].ratio) !== 100) {
          this.$bvToast.toast('Ratios summary must be 100', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          this.loading = false
          return;
      }
      this.$emit('confirm', this.activePools.map(p => parseFloat(p.ratio)));
    }
  },
  mounted () {
    this.activePools = [
      { name: this.$t('socialView.communityContent'), ratio: this.poolPercentage[0] },
      { name: this.$t('socialView.curation'), ratio: this.poolPercentage[1] },
      { name: 'Space', ratio: this.poolPercentage[2] }
    ];
  },
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
</style>
