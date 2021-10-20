import Vue from "vue";
import VueRouter from "vue-router";
import VerticalLayout from "@/layout/VerticalLayout";
import HorizontalLayout from "@/layout/HorizontalLayout";
import Blog from "../views/Blog/Blog";
import CommunityBlog from "../views/Blog/CommunityBlog";
import CrowdIndex from "../views/CrowdStaking/Index";
import Wallet from "../views/Wallet/Wallet";
import BSCWallet from "../views/Wallet/BSC";
import PolkadotWallet from "../views/Wallet/Polkadot";
import KusamaWallet from "../views/Wallet/Kusama";
import SteemWallet from "../views/Wallet/Steem";
import HiveWallet from "../views/Wallet/Hive";
import CrowdStaking from "../views/CrowdStaking/CrowdStaking";
import CrowdLoan from "../views/CrowdStaking/CrowdLoan";
import CommunityIndex from "../views/Community/Index";
import Community from "../views/Community/Community";
import CreateEconomy from "@/views/Community/CreateEconomy";
import AddPool from "@/views/Community/AddPool";
import UpdatePool from "@/views/Community/UpdatePool";
import ProposalCreate from "@/views/Community/ProposalCreate";
import Register from "@/views/RegisterAsset/Register";
import RegisterCtoken from "@/views/RegisterAsset/RegisterCtoken";
import NativeAsset from "@/views/RegisterAsset/NativeAsset";
import CrossChainAsset from "@/views/RegisterAsset/CrossChainAsset";
import CommunityInfo from "@/views/Community/CommunityInfo";
import CommunityDetailInfo from "@/views/Community/CommunityDetailInfo";
import Delegate from "@/views/CrowdStaking/Delegate";
import CrowdNominate from "@/views/CrowdStaking/CrowdNominate";
import Tutorials from "@/views/Community/Tutorials";
import Nps from "@/views/Nps/Nps";
import ProposalSpace from "@/views/Community/ProposalSpace";
import Proposal from "@/views/Community/Proposal";
import CommunityProposalConfig from "@/views/Community/CommunityProposalConfig";
import CommunityTokens from "@/views/Community/CommunityTokens";
import CommunitySettingIndex from "@/views/CommunitySetting/Index";
import AssetSetting from "@/views/CommunitySetting/AssetSetting";
import StakingSetting from "@/views/CommunitySetting/StakingSetting";
import SocialSetting from "@/views/CommunitySetting/SocialSetting";
import VoteSetting from "@/views/CommunitySetting/VoteSetting";
import CreateProposal from "@/views/Nps/CreateProposal";
import NpsIndex from "@/views/Nps/Index";
import GameSetting from "@/views/CommunitySetting/GameSetting";
import Home from "@/views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HorizontalLayout",
    component: HorizontalLayout,
    redirect: '/home',
    children: [
      {
        path: "/home",
        name: "home",
        component: Home
      },
      {
        path: "/dapp",
        name: "dapp",
        component: () => import('@/views/Dapp')
      },
      {
        path: "/wallet",
        redirect: "/wallet/bsc",
        component: Wallet,
        children: [
          {
            path: "bsc",
            name: "BSCWallet",
            component: BSCWallet,
          },
          {
            path: "polkadot",
            name: "PolkadotWallet",
            component: PolkadotWallet,
          },
          {
            path: "kusama",
            name: "PolkadotWallet",
            component: KusamaWallet,
          },
          {
            path: "steem",
            name: "SteemWallet",
            component: SteemWallet,
          },
          {
            path: "hive",
            name: "HiveWallet",
            component: HiveWallet,
          },
        ],
      },
      {
        path: "/crowdstaking",
        component: CrowdIndex,
        redirect: "/crowdstaking/deposite",
        children: [
          {
            path: "crowdloan",
            name: "crowdloan",
            component: CrowdLoan,
          },
          {
            path: "nominate",
            name: "nominate",
            component: CrowdNominate,
          },
          {
            path: "delegate",
            name: "delegate",
            component: Delegate,
          },
          {
            path: "deposite",
            name: "deposite",
            component: CrowdStaking,
          },
        ],
      },
      {
        path: "/blog",
        component: Blog,
      },
      {
        path: "/nps",
        component: NpsIndex,
        redirect: "/nps/nps",
        children: [
          {
            path: "nps",
            component: ProposalSpace,
          },
          {
            path: "create-proposal",
            component: CreateProposal,
          },
          {
            path: "proposal",
            component: Proposal,
          },

          {
            path: "proposal-create",
            component: ProposalCreate,
          },
          {
            path: "community-proposal-config/:key",
            component: CommunityProposalConfig,
          },
        ],
      },
      {
        path: "community",
        component: CommunityIndex,
        redirect: "/community/community-list",
        children: [
          {
            path: "community-list",
            component: Community,
            meta: { slideBar: true },
          },
          {
            path: "community-token",
            component: CommunityTokens,
            meta: { slideBar: true },
          },
          {
            path: "tutorials",
            component: Tutorials,
          },
          {
            path: "detail-info",
            component: CommunityDetailInfo,
          },
          {
            path: "create-economy",
            component: CreateEconomy,
          },
          {
            path: "add-pool",
            component: AddPool,
          },
          {
            path: "community-info",
            component: CommunityInfo,
          },
          {
            path: "register-ctoken",
            name: "register-ctoken",
            component: RegisterCtoken,
          },
        ],
      },
      {
        path: "/community-setting",
        name: "community-setting",
        component: CommunitySettingIndex,
        redirect: "/community-setting/profile",
        children: [
          {
            path: "tutorials",
            name: "tutorials",
            component: Tutorials,
          },
          {
            path: "profile",
            name: "profile",
            component: CommunityInfo,
            meta: { slideBar: true },
          },
          {
            path: "asset",
            name: "asset",
            component: AssetSetting,
            meta: { slideBar: true },
          },
          {
            path: "register",
            component: Register,
            meta: { slideBar: true },
            children: [
              {
                path: "native",
                component: NativeAsset,
                props: (route) => ({
                  tokenAddress: route.query.tokenAddress,
                }),
              },
              {
                path: "cross-chain-asset",
                component: CrossChainAsset,
              },
            ],
          },
          {
            path: "staking",
            name: "staking",
            component: StakingSetting,
            meta: { slideBar: true },
          },
          {
            path: "social",
            name: "social",
            component: SocialSetting,
            meta: { slideBar: true },
          },
          {
            path: "vote",
            name: "vote",
            component: VoteSetting,
            meta: { slideBar: true },
          },
          {
            path: "update-pool",
            name: "update-pool",
            component: UpdatePool,
            meta: { slideBar: true },
          },
          {
            path: "add-pool",
            name: "add-pool",
            component: AddPool,
            meta: { slideBar: true },
          },
          {
            path: "game",
            name: "game",
            component: GameSetting,
            meta: { slideBar: true },
          },
          {
            path: "game-info",
            name: "game-info",
            component: () => import('@/views/CommunitySetting/GameInfo'),
            meta: { slideBar: true },
          }
        ],
      },
    ],
  },
  {
    path: "/specify",
    name: "vertical-layout",
    component: VerticalLayout,
    redirect: "specify/staking",
    children: [
      {
        path: "wallet",
        redirect: "wallet/bsc",
        component: Wallet,
        children: [
          {
            path: "bsc",
            name: "BSCWallet",
            component: BSCWallet,
          },
          {
            path: "polkadot",
            name: "PolkadotWallet",
            component: PolkadotWallet,
          },
          {
            path: "kusama",
            name: "PolkadotWallet",
            component: KusamaWallet,
          },
          {
            path: "steem",
            name: "SteemWallet",
            component: SteemWallet,
          },
          {
            path: "hive",
            name: "HiveWallet",
            component: HiveWallet,
          },
        ],
      },
      {
        path: "staking",
        component: CommunityDetailInfo,
      },
      {
        path: "blog",
        component: CommunityBlog,
      },
      {
        path: "nps",
        component: NpsIndex,
        redirect: "nps/nps",
        children: [
          {
            path: "nps",
            component: ProposalSpace,
          },
          {
            path: "proposal-create",
            component: ProposalCreate,
          },
          {
            path: "proposal",
            component: Proposal,
          },
        ],
      },
      {
        path: "game",
        component: () => import('@/views/Game/Game'),
      },
    ],
  },
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.query.id) {
    next();
  } else if (to.matched[0].path === "/specify" && from.query.id) {
    next({
      path: to.path,
      query: {
        ...to.query,
        id: from.query.id,
      },
    });
  } else if (to.matched[0].path === "/specify" && !from.query.id) {
    next({
      path: "/",
    });
  } else {
    next();
  }
});
export default router;
