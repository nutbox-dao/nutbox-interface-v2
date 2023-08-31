<template>
  <div class="pool-modal position-relative">
    <i class="modal-close-icon-right" @click="$emit('close')"></i>
    <div class="pool-modal-content overflow-auto d-flex flex-column justify-content-center pt-4">
      <div class="w-100 px-md-3 custom-form pt-4">
        <b-form-group class="mb-4"
                      label-class="overflow-hidden font14 line-height14 d-flex"
                      label-cols-md="3" content-cols-md="9"
                      :label="$t('socialView.chainTag')">
          <div class="d-flex">
            <div class="c-input-group c-input-group-bg">
              <span class="pl-3 text-grey-7">#</span>
              <b-form-input class="input-border" v-model="chainTag"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group class="mb-4"
                      label-class="overflow-hidden font14 line-height14 d-flex"
                      label-cols-md="3" content-cols-md="9"
                      :label="$t('socialView.communityCategoryTags')" >
          <div class="d-flex flex-1">
            <div class="c-input-group c-input-group-bg">
              <span class="pl-3 text-grey-7">#</span>
              <b-form-input class="input-border" v-model="communityTag"></b-form-input>
            </div>
            <button class="c-append add-tag-btn primary-btn"
                    @click="addCommunityTag">
              <i class="add-icon add-icon-dark"></i>
            </button>
          </div>
          <div class="d-flex tags-container mt-2">
            <span v-for="(item, index) of categoryTags" :key="index"
                  class="tag-item text-primary-0 position-relative">
              <span># {{item}}</span>
              <i class="sub-icon" @click="subCommunityTag(index)"></i>
            </span>
          </div>
        </b-form-group>
        <div class="d-flex align-items-center justify-content-center ">
          <button class="primary-btn w-50 mx-0 d-flex align-items-center px-3"
                  @click="createCommunity"
                  :disabled="loading">
            <span>{{$t('socialView.deploy')}}</span>
            <b-spinner v-show="loading" class="ml-1" small></b-spinner>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkDisplayTag } from '@/apis/wh3Api'
import { handleApiErrCode, sleep } from '@/utils/helper'
import { errCode } from '@/config'
import { createWh3CommunityContract } from '@/utils/web3/community'
import { randomCurationId } from '@/utils/web3/utils'
import { getCToken, getERC20Balance } from '@/utils/web3/asset'
import { mapState } from 'vuex'

export default {
  name: 'WH3CreatePool',
  data () {
    return {
      step: 2,
      chainTag: '',
      communityTag: '',
      categoryTags: [],
      loading: false
    }
  },
  computed: {
    ...mapState('community', ['communityData']),
  },
  methods: {
    addCommunityTag () {
      if (this.categoryTags.length >= 3) {
        return;
      }
      this.categoryTags.push(this.communityTag)
      this.communityTag = ''
    },
    subCommunityTag (index) {
      this.categoryTags.splice(index, 1)
    },
    async createCommunity() {
      try{
        this.loading = true;
        // check display tag
        const reg = this.chainTag.match(/^[a-zA-Z_0-9]+$/)
        if (!reg || this.chainTag.length > 16) {
          handleApiErrCode(errCode.DISPLAY_TAG_INVALID, (tip, params) => {
            this.$bvToast.toast(tip, params)
          })
          this.loading = false;
          return;
        }
        const com = await checkDisplayTag(this.chainTag);
        if (com && com.length > 0) {
          handleApiErrCode(errCode.DISPLAY_TAG_USED, (tip, params) => {
            this.$bvToast.toast(tip, params)
          })
          this.loading = false;
          return;
        }
        
        // deploy community contract
        const cid = randomCurationId();
        const comm = await createWh3CommunityContract(cid);
        this.$emit('confirm', {tag: this.chainTag, tags: this.categoryTags, comm, cid})
      } catch (e) {
        console.log('select tag fail', e)
        this.loading = false;
      } finally {
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.pool-modal-content {
  min-height: 300px;
}
.add-tag-btn {
  width: 36px;
  max-width: 36px;
  min-width: 36px;
  height: 36px;
  margin-left: 10px;
}
.tags-container {
  flex-wrap: wrap;
  gap: 8px;
  .tag-item {
    background: var(--nav-tab-bg);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    white-space: nowrap;
  }
}
.sub-icon {
  @include icon(14px, 14px);
  background-image: url("~@/static/images/sub-icon-white.svg");
  position: absolute;
  top: -4px;
  right: -6px;
  background-color: var(--primary-custom);
  border-radius: 20px;
  cursor: pointer;
}
</style>
