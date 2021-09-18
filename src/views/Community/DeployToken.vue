<template>
  <div class="page-view-content">
    <div class="container scroll-content">
      <div class="view-top-header" v-if="!noTitle">
        <div class="page-back-text-icon page-view-title" @click="$router.back()">
          {{ $t('asset.deployYourToken') }}
        </div>
      </div>
      <div class="tab-card mb-5">
        <div class="tabs tabs-1 font16 mb-3">
          <!-- <span :class="activeTab===0?'active':''" @click="activeTab=0">ERC20</span> -->
          <span :class="activeTab===1?'active':''" @click="activeTab=1">Mintable ERC20</span>
          <!-- <p></p> -->
        </div>
        <!--      <div class="h-line"></div>-->
        <div class="text-left form-box">
          <div class="warning-tip" v-if="activeTab===1">
            <i class="warning-icon"></i>
            <div class="tip-text flex-full font12">
              Mintable ERC20 means your token contract has supported mint() and burn() method,
              that means you can assign a contract the mining role permission to mint your token to a
              specific address, also burn them from a specific address.
            </div>
          </div>
          <DeployForm :isMintable="activeTab===1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeployForm from '@/components/Community/DeployForm'
export default {
  name: 'Deploy',
  components: { DeployForm },
  props: {
    noTitle: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      activeTab: 1
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/tab-card";
.tab-card {
  max-width: 500px;
  margin: 3rem auto;
}
.warning-tip {
  background: #FFF4E5;
  border-radius: .4rem;
  padding: .6rem .8rem;
  display: flex;
  align-items: flex-start;
  margin-bottom: .8rem;
  .warning-icon {
    @include icon;
    background-image: url("~@/static/images/warning-icon.svg");
    margin-right: .3rem;
  }
  .tip-text {
    color: #FF5040;
    line-height: .8rem;
    word-break: break-word;
    text-align: justify;
  }
}
</style>
