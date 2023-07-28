<template>
    <div class="multi-card">
      <div class="card-link-top-box">
        <div class="status-container text-right">
          <span v-if="pool.status === 'OPENED'" :class="'Active'">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
          <span v-else class="Completed">{{ $t('community.' + pool.status.toLowerCase()) }}</span>
        </div>
        <div class="d-flex align-items-center">
          <!-- <div class="card-single-icon">
            <img class="icon1" :src="icon || './default.png'" alt="" />
          </div> -->
          <div class="card-link-title-text font-bold hover pt-20px" @click="copyContract">
            <span>{{ pool.name || '--' }}</span>
          </div>
        </div>
      </div>
      <div class="c-card text-grey-7 font14 font-bold">
        <div class="project-info-container" :id="pool.id" style="height: 80px; overflow: hidden;">
          <div>
            {{ poolDesc }}
            <button @click="showDescTip=true">
              <i class="edit-icon hover"></i>
              </button>
          </div>
          <b-popover
                :target="pool.id"
                triggers="hover focus"
                placement="top"
              >
                {{
                  poolDesc
                }}
              </b-popover>
        </div>
        <div class="project-info-container">
          <span class="name">{{ $t("pool.recipient") }}</span>
          <div class="info">
            {{ recipient || 0 }}
            <button @click="showRecipientAddressTip=true">
              <i class="edit-icon hover"></i>
            </button>
          </div>
        </div>
  
        <button class="primary-btn my-3 w-75" :disabled="updating" v-if="pool.status === 'OPENED' && (totalStaked ? totalStaked[pool.id] > '0' : false)" @click="showAttention=true">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t("pool.closePool") }}
        </button>
        <button class="primary-btn my-3 w-75" :disabled="updating" v-else-if="pool.status === 'OPENED'" @click="startPool">
          <b-spinner small type="grow" v-show="updating" />
          {{ $t("pool.startPool") }}
        </button>
      </div>
      <!-- showAttention tip -->
      <b-modal
        v-model="showAttention"
        modal-class="custom-modal"
        centered
        hide-header
        hide-footer
        no-close-on-backdrop
      >
        <div class="custom-form">
          <h3 style="color: red; text-align: center">
            {{ $t("tip.attention") }}
          </h3>
          <div class="my-3 font20 line-height24 text-center">
            {{ $t("tip.stopPoolAttention") }}
          </div>
          <div class="mb-4 font20 line-height24 text-center">
            {{ `Please input pool name: "${pool.name}" to close this pool.` }}
          </div>
  
          <div
            class="c-input-group c-input-group-bg-dark c-input-group-border my-3"
          >
            <b-input
              class="flex-1"
              :placeholder="$t('placeHolder.confirmInfo', { info: pool.name })"
              v-model="confirmInfo"
            ></b-input>
          </div>
  
          <div class="d-flex justify-content-between" style="gap: 2rem">
            <button
              class="dark-btn"
              @click="receiveAttention"
              :disabled="updating"
            >
              <b-spinner small type="grow" v-show="updating" />
              {{ $t("pool.closePool") }}
            </button>
            <button
              class="primary-btn"
              @click="confirmInfo = '';showAttention = false"
              :disabled="updating"
            >
              <b-spinner small type="grow" v-show="updating" />
              {{ $t("operation.cancel") }}
            </button>
          </div>
        </div>
      </b-modal>
      <!-- update recipient address -->
      <b-modal
      v-model="showRecipientAddressTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("pool.recipient") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group c-input-group-bg-dark c-input-group-border">
              <input
                type="text"
                v-model="inputRecipientAddress"
                :placeholder="$t('placeHolder.inputRecipientAddress')"
              />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showRecipientAddressTip = false"
            :disabled="updatingRecipientAddress"
          >
            <b-spinner small type="grow" v-show="updatingRecipientAddress" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" @click="updateRecipientAddress" :disabled="updatingRecipientAddress">
            <b-spinner small type="grow" v-show="updatingRecipientAddress" />
            {{ $t("operation.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
    <!-- update pool description -->
    <b-modal
      v-model="showDescTip"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form font20 line-height28">
        <div class="modal-title font-bold mb-2">
          {{ $t("pool.poolDescTitle") }}
        </div>
        <div class="mb-2 font16">
          {{ $t("pool.poolDescTip") }}
        </div>
        <div class="input-group-box mb-4">
          <div class="input-box flex-between-center">
            <div class="c-input-group c-input-group-bg-dark c-input-group-border">
              <textarea
                type="text"
                v-model="inputPoolDesc"
                :placeholder="$t('placeHolder.inputPoolDesc')"
              />
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center" style="margin: 0 -1rem">
          <button
            class="dark-btn mx-3"
            @click="showDescTip = false"
            :disabled="updatingPoolDesc"
          >
            <b-spinner small type="grow" v-show="updatingPoolDesc" />
            {{ $t('operation.cancel') }}
          </button>
          <button class="primary-btn mx-3" @click="updateDesc" :disabled="updatingPoolDesc">
            <b-spinner small type="grow" v-show="updatingPoolDesc" />
            {{ $t("operation.confirm") }}
          </button>
        </div>
      </div>
    </b-modal>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  import { handleApiErrCode, sleep, formatUserAddress } from '@/utils/helper'
  import { closePool, updatePoolDesc, updatePoolRecipient, startPool } from '@/utils/web3/pool'
  import StakingCardHeader from '@/components/common/StakingCardHeader'
  import {ethers} from 'ethers'
  import { getPoolDesc } from '@/apis/api'
  
  export default {
    name: 'ManageCurationCard',
    components: { StakingCardHeader },
    computed: {
      ...mapState("web3", ["stakingFactoryId", "allTokens", "fees"]),
      ...mapState("community", [
        "communityData",
        "loadingApproveCommunity",
        "approvedCommunity",
        'rewardPerBlock'
      ]),
      ...mapState('pool', ['totalStaked']),
      recipient() {
        const address = ethers.utils.getAddress(this.pool.asset)
        const start = address.slice(0, 8);
        const end = address.slice(-8);
        return `${start}...${end}`;
      }
    },
    data() {
      return {
        updating: false,
        showRecipientAddressTip: false,
        showDescTip: false,
        minedToken: 0,
        contract: null,
        stakedERC20: {},
        showAttention: false,
        approving: false,
        icon: null,
        vert: 1e18,
        confirmInfo: "",
        poolDesc: '',
        inputRecipientAddress: '',
        inputPoolDesc: '',
        updatingRecipientAddress: false,
        updatingPoolDesc: false
      };
    },
    props: {
      pool: {
        type: Object,
      },
    },
    methods: {
      receiveAttention() {
        if (this.confirmInfo !== this.pool.name) {
          this.$bvToast.toast(this.$t("error.wrongConfirmInfo"), {
            title: this.$t("error.error"),
            variant: "danger",
          });
          return;
        }
        this.closePool();
      },
      async updateDesc() {
        try{
          this.updatingPoolDesc = true
          await updatePoolDesc(this.pool.id, this.inputPoolDesc)
          this.pool.description = this.inputPoolDesc;
          this.poolDesc = this.inputPoolDesc;
          this.showDescTip = false;
        } catch (e) {
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param)
          })
        } finally {
          this.updatingPoolDesc = false
        }
      },
      async  updateRecipientAddress() {
        try{
          this.updatingRecipientAddress = true;
          // check address
          if(!ethers.utils.isAddress(this.inputRecipientAddress)) {
            return handleApiErrCode(errCode.UP, (tip, param) => {
                  this.$bvToast.toast(tip, param);
                })
          }
          const hash = await updatePoolRecipient(this.pool.id, this.inputRecipientAddress);
          this.showRecipientAddressTip = false;
          this.pool.asset = this.inputRecipientAddress;
        } catch (e) {
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param);
          })
        } finally {
          this.updatingRecipientAddress = false
        }
      },
      copyContract(){
        const address = ethers.utils.getAddress(this.pool.id)
        navigator.clipboard.writeText(address).then(() => {
          this.$bvToast.toast(
            this.$t('tip.copyAddress', {
              address: formatUserAddress(address)
            }),
            {
              title: this.$t('tip.clipboard'),
              autoHideDelay: 5000,
              variant: 'info' // info success danger
            }
          )
        }, (e) => {
          console.log(e)
        })
      },
      async startPool() {
        try{
          this.updating = true;
          await startPool(this.pool.id);
          this.$bvToast.toast(this.$t("tip.startPoolTips"), {
              title: this.$t("tip.tips"),
              variant: "success",
            });
          this.totalStaked[this.pool.id] = 1;
        } catch(e) {
          console.log(4, e)
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param);
          });
        } finally {
          this.updating = false
        }
      },
      async closePool() {
        try {
          this.updating = true;
          if (
            this.pool.ratio === 10000 &&
            this.communityData.pools.filter(p => p.status === 'OPENED').length === 1
          ) {
            // remove only one pool
            const res = await closePool({
              poolAddress: this.pool.id,
              activedPools: [],
              ratios: [],
            });
            this.communityData.pools[0].status = "CLOSED";
            return;
          }
          if (this.pool.ratio !== 0) {
            this.$bvToast.toast(this.$t("tip.stopPoolTips"), {
              title: this.$t("tip.tips"),
              variant: "info",
            });
            return;
          }
          let pools = [];
          let activedPools = [];
          let ratios = [];
          let index = 0;
          for (let i = 0; i < this.communityData.pools.length; i++) {
            const pool = { ...this.communityData.pools[i] };
            if (pool.id !== this.pool.id) {
              if (pool.status === "OPENED") {
                pool.poolIndex = index++;
                activedPools.push(pool.id);
                ratios.push(pool.ratio);
              }
            } else {
              pool.status = "CLOSED";
            }
            pools.push(pool);
          }
          const res = await closePool({
            poolAddress: this.pool.id,
            activedPools,
            ratios,
          });
          this.$bvToast.toast(this.$t("tip.stopPoolOk"), {
            title: this.$t("tip.tips"),
            variant: "success",
          });
          this.communityData.pools = pools;
          await sleep(2);
  
          this.showAttention = false;
        } catch (e) {
          handleApiErrCode(e, (tip, param) => {
            this.$bvToast.toast(tip, param);
          });
        } finally {
          this.confirmInfo = ''
          this.updating = false;
        }
      },
    },
  
    async mounted() {
      const chainId = this.pool.chainId;
      const poolDesc = await getPoolDesc([this.pool.id])
      if (poolDesc.length > 0) {
        this.poolDesc = poolDesc[0].description;
      }
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "src/static/css/card/common-card";
  @import "src/static/css/form";
  .status-container {
    position: absolute;
    top: 8px;
    right: 8px;
    box-sizing: border-box;
    span {
      box-sizing: border-box;
    }
  }
  .card-link-title-text span {
    word-break: break-word;
    @include text-multi-line(2);
  }
  .chain-type {
    border-radius: 24px;
    color: var(--sub-primary);
    border: 1px solid var(--sub-primary);
    font-size: 14px;
    line-height: 22px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
  .card-link-top-box {
    min-height: 128px;
  }
  .c-card {
    margin-top: -30px;
  }
  .project-info-container {
    margin: 10px 0;
  }
  .edit-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/edit-icon.svg");
}
  </style>
  