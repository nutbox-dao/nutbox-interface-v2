import Vue from 'vue'
import VueRouter from 'vue-router'

import Blog from '../views/Blog/Blog'
import CrowdStaking from '../views/CrowdStaking/CrowdStaking'
import Wallet from '../views/Wallet/Wallet'
import PolkadotWallet from '../views/Wallet/Polkadot'
import KusamaWallet from '../views/Wallet/Kusama'
import SteemWallet from '../views/Wallet/Steem'
import RococoWallet from '../views/Wallet/Rococo'
import PolkadotCrowdstaking from '../views/CrowdStaking/Polkadot'
import KusamaCrowdstaking from '../views/CrowdStaking/Kusama'
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
    redirect: '/community'
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
