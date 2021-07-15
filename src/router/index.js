import Vue from 'vue'
import VueRouter from 'vue-router'

import Blog from '../views/Blog/Blog'
import CrowdStaking from '../views/CrowdStaking/CrowdStaking'
import Crowdloan from '../views/Crowdloan/Crowdloan'
import PolkadotCrowdloan from '../views/Crowdloan/Polkadot'
import KusamaCrowdloan from '../views/Crowdloan/Kusama'
import RococoCrowdloan from '../views/Crowdloan/Rococo'
import Wallet from '../views/Wallet/Wallet'
import PolkadotWallet from '../views/Wallet/Polkadot'
import KusamaWallet from '../views/Wallet/Kusama'
import SteemWallet from '../views/Wallet/Steem'
import RococoWallet from '../views/Wallet/Rococo'
import Admin from '../views/Admin/Admin'
import PolkadotAdmin from '../views/Admin/Polkadot'
import KusamaAdmin from '../views/Admin/Kusama'
import PolkadotCrowdstaking from '../views/CrowdStaking/Polkadot'
import KusamaCrowdstaking from '../views/CrowdStaking/Kusama'
import RococoAdmin from '../views/Admin/Rococo'
import RococoCommunity from '../views/Crowdloan/Community/Rococo'
import KusamaCommunity from '../views/Crowdloan/Community/Kusama'
import RococoParachain from '../views/Crowdloan/Parachain/Rococo'
import KusamaParachain from '../views/Crowdloan/Parachain/Kusama'
import CommunityIndex from '../views/Community/Index'
import Community from '../views/Community/Community'
import DeployToken from '../views/Community/DeployToken'
import CreateEconomy from '@/views/Community/CreateEconomy'
import PoolsDashboard from '@/views/Community/PoolsDashboard'
import AddPool from '@/views/Community/AddPool'
import UpdatePool from '@/views/Community/UpdatePool'
import Register from '@/views/RegisterAsset/Register'
import NativeAsset from '@/views/RegisterAsset/NativeAsset'
import CrossChainAsset from '@/views/RegisterAsset/CrossChainAsset'
import CommunityInfo from '@/views/Community/CommunityInfo'
import CommunityDetailInfo from '@/views/Community/CommunityDetailInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/crowdloan'
  },
  {
    path: '/wallet',
    redirect: '/wallet/polkadot',
    component: Wallet,
    children: [
      {
        path: 'polkadot',
        name: 'PolkadotWallet',
        component: PolkadotWallet
      },
      {
        path: 'kusama',
        name: 'KusamaWallet',
        component: KusamaWallet
      },
      {
        path: 'steem',
        name: 'SteemWallet',
        component: SteemWallet
      },
      {
        path: 'rococo',
        name: RococoWallet,
        component: RococoWallet
      }
    ]
  },
  {
    path: '/crowdloan',
    name: 'crowdloan',
    component: Crowdloan,
    redirect: '/crowdloan/kusama',
    children: [
      {
        path: 'kusama',
        name: 'kusama',
        component: KusamaCrowdloan
      },
      {
        path: 'polkadot',
        name: 'polkadot',
        component: PolkadotCrowdloan
      },
      {
        path: 'rococo',
        name: 'rococo',
        component: RococoCrowdloan
      }
    ]
  },
  {
    path: '/crowdloan/rococo/community/:communityid/:nominatorId',
    component: RococoCommunity
  },
  {
    path: '/crowdloan/kusama/community/:communityid',
    component: KusamaCommunity
  },
  {
    path: '/crowdloan/kusama/community/:communityid/:nominatorId',
    component: KusamaCommunity
  },
  {
    path: '/crowdloan/rococo/parachain/:paraid',
    component: RococoParachain
  },
  {
    path: '/crowdloan/kusama/parachain/:paraid',
    component: KusamaParachain
  },
  {
    path: '/crowdstaking',
    component: CrowdStaking,
    redirect: '/crowdstaking/polkadot',
    children: [
      {
        path: 'kusama',
        name: 'kusama',
        component: KusamaCrowdstaking
      },
      {
        path: 'polkadot',
        name: 'polkadot',
        component: PolkadotCrowdstaking
      }
    ]
  },
  {
    path: '/blog',
    component: Blog
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: '',
        component: PolkadotAdmin
      },
      {
        path: 'kusama',
        component: KusamaAdmin
      },
      {
        path: 'rococo',
        component: RococoAdmin
      }
    ]
  },
  {
    path: '/community',
    component: CommunityIndex,
    children: [
      {
        path: '/',
        component: Community
      },
      {
        path: 'detail-info',
        component: CommunityDetailInfo
      },
      {
        path: 'deploy-token',
        component: DeployToken
      },
      {
        path: 'create-economy',
        component: CreateEconomy
      },
      {
        path: 'pool-dashboard',
        component: PoolsDashboard
      },
      {
        path: 'add-pool',
        component: AddPool
      },
      {
        path: 'update-pool',
        component: UpdatePool
      },
      {
        path: 'community-info',
        component: CommunityInfo
      },
      {
        path: 'register',
        component: Register,
        children: [
          {
            path: 'native',
            component: NativeAsset,
            props: route => ({
              tokenAddress: route.query.tokenAddress
            })
          },
          {
            path: 'cross-chain-asset',
            component: CrossChainAsset
          }
        ]
      }
    ]
  }

]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

export default router
