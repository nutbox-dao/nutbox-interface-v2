<template>
  <div class="crowdstaking">
    <h3>
      {{ this.$t("cs.crowdstaking") }}
    </h3>
    <div class="nav">
      <router-link to="/crowdstaking/kusama">Kusama</router-link>
      <router-link to="/crowdstaking" exact>Polkadot</router-link>
      <div class="center-blank"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import CrowdStakingCard from "../../components/CrowdStaking/CrowdStakingCard";
import { mapMutations, mapState, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    CrowdStakingCard,
  },
  computed: {
    ...mapState('polkadot',["projectFundInfos", "symbol", "isConnected", 'balance', 'crowdstakings']),
    funds() {
      const fundInfos = this.getFundInfos();
      return fundInfos || [];
    },
  },
  methods: {
    ...mapGetters('polkadot',["getFundInfos", "paraIds"]),
    ...mapMutations('polkadot',[
      "saveProjectStatus",
      "saveProjectName",
      "saveCommunityName",
      'saveCrowdstakings',
      'saveCommunitys',
      'saveProjects'
    ]),
  },
  created () {

  },
};
</script>

<style lang="less">
.crowdstaking {
  .nav {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--dividers);
    a {
      border: 0;
      font-size: 16px;
      padding: 18px 28px 14px 28px;
      color: #666;
      box-sizing: border-box;
      color: var(--secondary-text);
      font-weight: 600;
      line-height: 16px !important;
    }
    a:hover {
      background: linear-gradient(
        270deg,
        rgba(227, 229, 232, 0) 0%,
        rgba(227, 229, 232, 0.4) 100%
      ) !important;
      text-decoration: none;

      font-weight: 300;
      line-height: 16px;
    }
    .active {
      color: var(--primary-text);
      border-bottom: 3px solid var(--primary);
    }
    .center-blank {
      flex: 1;
    }
    .steem-account {
      height: 38px;
      background-color: #ffffff;
      box-shadow: 0px 10px 60px -5px rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      border: 0;
      position: relative;
      box-sizing: border-box;
      font-size: 15px;
      background-repeat: no-repeat;
      background-position: center right;
      p {
        margin: 0;
        line-height: 38px;
        padding-left: 36px;
        padding-right: 4px;
        img{
          margin-left: 16px;
        }
      }
      button {
        position: relative;
        background-color:white;
        top: 8px;
        border: 0;
        width: 100%;
        padding: 8px 0px;
        font-size: 15px;
        box-sizing: border-box;

      }
    }
  }
}
</style>
