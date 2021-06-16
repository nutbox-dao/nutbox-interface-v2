<template>
  <div class="page-view-content">
    <div class="page-view-title">Deploy Your Own Token</div>
    <div class="page-view-subtitle">Choose token type you want deploy</div>
    <div class="page-back-text-icon font20 mt-4" @click="$router.back()">commuity</div>
    <div class="scroll-content">
      <div class="tab-card">
        <div class="tabs tabs-2 font16">
          <span :class="activeTab===0?'active':''" @click="activeTab=0">ERC20</span>
          <span :class="activeTab===1?'active':''" @click="activeTab=1">Mintable ERC20</span>
        </div>
        <div class="h-line"></div>
        <div class="text-left form-box">
          <div class="warning-tip" v-if="activeTab===1">
            <i class="warning-icon"></i>
            <div class="tip-text flex-full font12">
              Mintable ERC20 means your token contract has supported mint() and burn(),
              that means your can assign a contract the mining role permission to mint your token to a
              specific address, also burn them from a specific address.
            </div>
          </div>
          <DeployForm/>
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
  data () {
    return {
      activeTab: 0
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
  padding: .4rem .8rem;
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
