<template>
  <div class="page-view-content">
    <div class="view-top-header mb-4">
      <div class="page-back-text-icon page-view-title" @click="$router.back()">
        Create Your Own Staking Economy
      </div>
    </div>
    <div class="scroll-content mt-3">
      <div class="form">
        <div class="primary-line-title font-bold font20">
          Step1：Your community token contact address
        </div>
        <div class="form-card custom-form step-1">
          <Dropdown :menu-options="concatAddressOptions"
                    :selected-key="selectedKey"
                    :selected-item="selectedAddressData"
                    @setSelectedData="setSelectedData">
            <template v-slot:empty0>
              <div class="text-center">
                <div class="custom-control" style="line-height: 1.5rem">
                  Havn’t Registry yet？
                  <router-link to="/community/register">Registry one</router-link>
                </div>
              </div>
            </template>
            <template v-slot:drop-item="slotProps">
              <img class="prefix-icon" :src="slotProps.item.logo" alt="">
              <div class="flex-full d-flex flex-column">
                <span>{{slotProps.item.name}}</span>
                <span class="font12 text-grey-light">{{slotProps.item.address | formatUserAddress}}</span>
              </div>
            </template>
          </Dropdown>
<!--          <b-input class="" placeholder="Please enter" v-model="form.contractAddr"></b-input>-->
          <div id="mint-checkbox" class="mt-3 font12 flex-between-center">
            <div class="text-grey">
              <div v-show="isMint">* This is a mintable token</div>
            </div>
            <div class="custom-control" style="line-height: 1.5rem">
              Havn’t Registry yet？
              <router-link to="/community/register">Registry one</router-link>
            </div>
          </div>
        </div>
        <div class="primary-line-title font-bold font20">
          Step2：Setting your Community token distrbution mechanism
        </div>
        <div class="form-card custom-form step-2">
          <div class="flex-between-center">
            <span>Token distribution era</span>
<!--            <button class="add-pool-btn" @click="$router.push('/community/add-pool')">-->
<!--              <i class="add-icon"></i>-->
<!--              <span>Add Pool</span>-->
<!--            </button>-->
          </div>
          <Progress :min="progressData.length>0?progressData[0].start:0"
                    :is-edit="progressData.length>0"
                    @delete="progressData.pop()"
                    :progress-data="progressData"></Progress>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold mr-3">Start block</span>
            <b-input placeholder="输入起始区块高度" :disabled="progressData.length>0"
                     v-model="poolForm.start"></b-input>
          </div>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold mr-3">Stop block</span>
            <b-input placeholder="输入结束区块高度" v-model="poolForm.end"></b-input>
          </div>
          <div class="flex-between-center c-input-group">
            <span class="font16 font-bold mr-3">Reward amount</span>
            <b-input placeholder="输入该区间的奖励金额" v-model="poolForm.reward"></b-input>
          </div>
          <button class="primary-btn" :disabled="!poolForm.end || !poolForm.reward || progressData.length>2"
                  @click="confirmAdd">Confirm Add</button>
        </div>
        <button class="primary-btn" :disabled="progressData.length===0" @click="confirmDeploy">Deploy</button>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from '@/components/Community/Progress'
import Dropdown from '@/components/ToolsComponents/Dropdown'
import { mapState } from 'vuex'
export default {
  name: 'CreateEconomy',
  components: { Progress, Dropdown },
  data () {
    return {
      selectedKey: 'address',
      selectedAddressData: {},
      concatAddressOptions: [
        {
          categoryName: 'Personal',
          items: []
        },
        {
          categoryName: ' Official',
          items: [
            { name: 'BBB', address: '0xaaaaaaaaaaaaaaaa' }
          ]
        }
      ],
      progressData: [],
      form: {
        contractAddr: '',
        isMint: false,
        poolData: []
      },
      poolForm: {
        start: '1001',
        end: '3000',
        reward: '100'
      }
    }
  },
  computed: {
    isMint () {
      return true
    },
    ...mapState({
      userDeployTokens: state => state.community.userDeployTokens
    })
  },
  watch: {
    userDeployTokens (val) {
      this.concatAddressOptions[0].items = val
    }
  },
  mounted () {
    this.concatAddressOptions[0].items = this.userDeployTokens
  },
  methods: {
    setSelectedData (data) {
      this.selectedAddressData = data
      this.form.contractAddr = data.address
    },
    confirmAdd () {
      const barData = {
        start: this.poolForm.start,
        end: this.poolForm.end,
        value: this.poolForm.reward,
        percentage: Number(this.poolForm.end) - Number(this.poolForm.start)
      }
      this.progressData.push(barData)
      if (this.progressData.length > 2) return
      this.poolForm.start = barData.end
      this.poolForm.end = ''
      this.poolForm.reward = ''
    },
    confirmDeploy () {
      this.form.poolData = this.progressData
      this.$store.commit('community/setUserDeployEconomy', this.form)
      this.$router.replace('/community/edit-community-info')
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/form";
.form {
  width: 100%;
  max-width: 27rem;
  margin: auto;
  text-align: left;
}
.primary-line-title {
  @include single-color-bg(.2rem 1rem, left .3rem);
  padding-left: 1rem;
}
.form-card {
  @include card(.8rem 1.2rem 1rem, white, unset);
  margin-bottom: 1.2rem;
}
.step-1 {
  #mint-checkbox a {
    color: #408FFF;
  }
  @media (max-width: 960px) {
    #mint-checkbox {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
.step-2 {
  .add-pool-btn {
    border: 1px solid var(--primary-custom);
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.8rem;
    border-radius: 1.8rem;
    .add-icon {
      @include icon(.8rem, .8rem);
      min-width: .8rem;
      margin-right: .2rem;
      background-image: url("~@/static/images/add-icon.svg");
    }
  }
  .c-progress {
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
  .c-input-group {
    margin-bottom: .8rem;
    span {
      white-space: nowrap;
    }
  }
}

</style>
