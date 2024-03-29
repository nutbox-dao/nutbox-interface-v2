<template>
  <div class="pool-config-modal position-relative">
    <i v-if="enableBack" class="modal-back-icon" @click="$emit('back')"></i>
    <i v-else :disable="!enableOp" class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-config-modal-content overflow-hidden d-flex flex-column">
      <div class="mt-4 mb-4 text-center">{{ type === 'create' ? 'Create new pool' : 'Pool Configuration' }}</div>
      <div class="col-lg-10 mx-auto custom-form ">
        <b-form-group class="mb-4"
                      v-if="type === 'create' && activePools && activePools.length > 0"
                      label-class="overflow-hidden font14 line-height14 d-flex align-items-center"
                      label-cols-md="3" content-cols-md="9"
                      :label="$t('pool.poolName')">
          <b-form-input class="input-border" :placeholder="$t('placeHolder.inputPoolName')" :disabled="!enableOp" type="text" @input="nameChange" v-model.trim="newName"></b-form-input>
        </b-form-group>
        <!-- token logo -->
        <b-form-group
          v-if="needIcon"
          class="mb-4 logo-form"
          label-class="overflow-hidden font14 line-height14 d-flex align-items-center"
          label-cols-md="3" content-cols-md="9"
          :label="$t('community.communityLogo')">
          <div class="d-flex align-items-center">
            <b-form-file
              v-model="logo"
              @input="updateLogo"
              accept="image/png,image/jpeg, image/jpg"
              ref="logo-file-input"
            >
              <template #placeholder>
                <div class="input-file-logo">
                  <template v-if="propsIcon">
                    <img class="cover-preview" :src="propsIcon" alt="" />
                    <div class="edit-mask">
                      <span>{{ $t("operation.edit") }}<br />LOGO</span>
                    </div>
                  </template>
                  <template v-else>
                    <img
                      class="add-icon"
                      src="~@/static/images/add-icon-gary.svg"
                      alt=""
                    />
                  </template>
                </div>
              </template>
              <template #file-name>
                <div class="input-file-logo">
                  <img
                    class="logo-preview"
                    v-if="logoPreviewSrc"
                    :src="logoPreviewSrc"
                    alt=""
                  />
                  <UploadLoading v-if="logoUploadLoading" />
                </div>
              </template>
            </b-form-file>
            <div class="font12 text-grey-7 ml-3">
              {{ $t("tip.stakeTokenLogoTip", { token: token ? token.symbol : '' }) }}
            </div>
          </div>
        </b-form-group>

        <div class="mb-2 font14 line-height14">{{ $t('pool.ratioTip') }}</div>
        <div class="pool-chart-box w-100 d-flex">
          <div class="pool-data-box">
            <b-form-group :label="activePools[inputIndex].name"
                          label-cols="4"
                          label-class="overflow-hidden font14 line-height14 d-flex align-items-center"
                          content-cols="8"
                          v-for="(ratio, inputIndex) of ratios" :key="inputIndex">
              <div class="c-input-group c-input-group-bg-dark c-input-group-border d-flex">
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
          <button class="dark-btn mx-2" :disabled="!enableOp" @click="$emit('close')">
            <b-spinner small type="grow" v-show="!enableOp" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" v-if="takeFee && (approving || loadingApproveCommunity || !approvedCommunity)" @click="approve" :disabled="approving || loadingApproveCommunity">
            <b-spinner small type="grow" v-show="approving" />
            {{ $t("operation.approve") }}
          </button>
          <button v-else class="primary-btn mx-2" :disabled="!enableOp" @click="create()">
            <b-spinner small type="grow" v-show="!enableOp" />
            {{ $t('operation.ok') }}
          </button>
        </div>
        <div v-if="takeFee" class="font14 my-1" style="text-align:center">
          {{ $t('tip.feeTip',{fee})}}
        </div>
      </div>
    </div>
    <!-- crop pic tip -->
    <b-modal
      v-model="cropperModal"
      modal-class="cropper-modal"
      size="lg"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop>
      <div class="cropper-container">
        <canvas id="cropper-canvas"></canvas>
        <vueCropper
          ref="cropper"
          class="cropper-rounded-circle"
          :infoTrue="true"
          :autoCrop="true"
          :img="cropperImgSrc"
          :fixedNumber="cropFixedNumber"
          :autoCropWidth="cropImgSize[0]"
          :fixed="true"
          :centerBox="true"
          outputType="png"
        ></vueCropper>
      </div>
      <div class="crop-btn-group">
        <button class="primary-btn" @click="onCancel">{{ $t('operation.cancel') }}</button>
        <button class="primary-btn" @click="completeCropAndUpload">{{ $t('operation.complete') }}</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import PoolRatio from '@/components/community/PoolRatio'
import { mapState } from 'vuex'
import { sleep, uploadImage, handleApiErrCode } from '@/utils/helper'
import UploadLoading from '@/components/common/UploadLoading'
import { VueCropper } from 'vue-cropper'
import { updateTokenIcon } from '@/utils/web3/asset'
import { updateIcon } from '@/utils/web3/erc1155'
import {
  approveUseERC20
   } from '@/utils/web3/community'
import { NutAddress, errCode  } from '@/config'

export default {
  name: 'StakingPoolConfig',
  components: { PoolRatio, UploadLoading, VueCropper },
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
    },
    needIcon: {
      type: Boolean,
      default: false
    },
    token: {
      type: Object
    }
  },
  computed: {
    ...mapState('community', ['communityData', 'loadingApproveCommunity', 'approvedCommunity']),
    ...mapState('web3', ['fees']),
    fee() {
      if (this.fees){
        return this.fees['COMMUNITY'].toFixed(2)
      }
      return 0
    },
    takeFee() {
      if (this.fees) {
        return this.fees['COMMUNITY'] > 0
      }
      return false
    }
  },
  data () {
    return {
      activePools:[],
      newName: '',
      ratios: [],
      propsIcon: '',
      logo: null,
      logoPreviewSrc: '',
      logoUploadLoading: false,
      cropperModal: false,
      cropperImgSrc: '',
      cropFixedNumber: [1, 1],
      cropImgSize: [200, 200],
      approving: false
    }
  },
  methods: {
    async approve () {
      try {
        this.approving = true
        const hash = await approveUseERC20(NutAddress, this.communityData.id)
        this.$bvToast.toast(this.$t('tip.approveSuccess'), {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.$store.commit('community/saveApprovedCommunity', true)
      } catch (e) {
        handleApiErrCode(e, (tip, param) => {
          this.$bvToast.toast(tip, param)
        })
      } finally {
        this.approving = false
      }
    },
    async updateLogo (file) {
      if (!this.logo) return
      this.logoUploadLoading = true
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (res) => {
        this.cropperImgSrc = res.target.result
        this.cropperModal = true
        this.cropFixedNumber = [1, 1]
        this.cropImgSize = [200, 200]
      }
    },
    onCancel () {
      this.cropperModal = false
      this.logo = null
      this.logoUploadLoading = false
    },
    clipCircleImg (imgSrc) {
      return new Promise(resolve => {
        const canvas = document.getElementById('cropper-canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = imgSrc
        img.onload = () => {
          const cw = canvas.width = img.width
          const ch = canvas.height = img.height
          ctx.beginPath()
          ctx.arc(cw / 2, ch / 2, ch / 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(img, 0, 0)
        }
        const timer = setInterval(function () {
          if (img.complete) {
            clearInterval(timer)
            resolve(canvas)
          }
        }, 50)
      })
    },
    completeCropAndUpload() {
      this.$refs.cropper.getCropData(async (data) => {
        const canvas = await this.clipCircleImg(data)
        this.logoPreviewSrc = canvas.toDataURL('image/png')
        this.cropperModal = false
        canvas.toBlob(async data => {
          try {
            this.propsIcon = await uploadImage(data)
            this.logoUploadLoading = false
          } catch (e) {
            handleApiErrCode(e, (title, info) => {
              this.$bvToast.toast(title, info)
            });
            this.logo = null
            this.propsIcon = null
            this.logoUploadLoading = false
          }
        })
      })
    },
    inputChange: debounce(function () {
      this.activePools.map((item, index) => {
        item.ratio = this.ratios[index]
      })
    }, 1000),
    nameChange: debounce(function () {
      this.activePools[this.activePools.length - 1].name = this.newName.trim()
    }, 1000),
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
        const newName = this.activePools[this.activePools.length - 1].name
        if (this.type === 'create' && (!newName || newName.trim().length === 0)) {
          this.$bvToast.toast('Please input pool name', {
            title: this.$t('tip.tips'),
            variant: 'info'
          })
          return;
        }
        if (this.needIcon) {
          // update load icon
          if (!this.propsIcon){
            this.$bvToast.toast('Please input token icon', {
              title: this.$t('tip.tips'),
              variant: 'info'
            });
            return;
          }else {
            if (parseInt(this.token.tokenid) > 0){ // erc1155
              updateIcon({address: this.token.address, tokenid: this.token.tokenid, icon: this.propsIcon}).catch()
            }else{ // erc20
              updateTokenIcon({address: this.token.address, icon: this.propsIcon}).catch()
            }
          }
        }
        this.$emit('create', this.activePools)
      }else {
        const res = this.activePools.reduce((t, r) => t + parseInt(parseFloat(r.ratio) * 100), 0)
        if (res !== 10000) {
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
      this.activePools.push({name: this.newName, ratio: 0})
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
.custom-form {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
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
@media (max-height: 820px) {
  .pool-config-modal-content {
    height: 80vh;
  }
}
@media (max-height: 600px) {
  .custom-form {
    overflow: auto;
    display: block;
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
    align-items: center;
  }
  .pool-data-box {
    box-sizing: border-box;
    width: 100%;
  }
}
</style>
