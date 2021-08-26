import Vue from 'vue'
import VueRouter from 'vue-router'

import Blog from '../views/Blog/Blog'
import CrowdIndex from '../views/CrowdStaking/Index'
import Wallet from '../views/Wallet/Wallet'
import BSCWallet from '../views/Wallet/BSC'
import PolkadotWallet from '../views/Wallet/Polkadot'
import KusamaWallet from '../views/Wallet/Kusama'
import SteemWallet from '../views/Wallet/Steem'
import HiveWallet from '../views/Wallet/Hive'
import CrowdStaking from '../views/CrowdStaking/CrowdStaking'
import CrowdLoan from '../views/CrowdStaking/CrowdLoan'
import CommunityIndex from '../views/Community/Index'
import Community from '../views/Community/Community'
import DeployToken from '../views/Community/DeployToken'
import CreateEconomy from '@/views/Community/CreateEconomy'
import PoolsDashboard from '@/views/Community/PoolsDashboard'
import AddPool from '@/views/Community/AddPool'
import UpdatePool from '@/views/Community/UpdatePool'
import Register from '@/views/RegisterAsset/Register'
import RegisterCtoken from '@/views/RegisterAsset/RegisterCtoken'
import NativeAsset from '@/views/RegisterAsset/NativeAsset'
import CrossChainAsset from '@/views/RegisterAsset/CrossChainAsset'
import CommunityInfo from '@/views/Community/CommunityInfo'
import CommunityDetailInfo from '@/views/Community/CommunityDetailInfo'
import SteemDelegate from '@/views/CrowdStaking/SteemDelegate'
import HiveDelegate from '@/views/CrowdStaking/HiveDelegate'
import CrowdNominate from '@/views/CrowdStaking/CrowdNominate'
import Tutorials from '@/views/Community/Tutorials'
import Nps from '@/views/Nps/Nps'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/community'
  },
  {
    path: '/wallet',
    redirect: '/wallet/bsc',
    component: Wallet,
    children: [
      {
        path: 'bsc',
        name: 'BSCWallet',
        component: BSCWallet
      },
      {
        path: 'polkadot',
        name: 'PolkadotWallet',
        component: PolkadotWallet
      },
      {
        path: 'kusama',
        name: 'PolkadotWallet',
        component: KusamaWallet
      },
      {
        path: 'steem',
        name: 'SteemWallet',
        component: SteemWallet
      },
      {
        path: 'hive',
        name: 'HiveWallet',
        component: HiveWallet
      }
    ]
  },
  {
    path: '/crowdstaking',
    component: CrowdIndex,
    redirect: '/crowdstaking/deposite',
    children: [
      {
        path: 'crowdloan',
        name: 'crowdloan',
        component: CrowdLoan
      },
      {
        path: 'nominate',
        name: 'nominate',
        component: CrowdNominate
      },
      {
        path: 'steem-delegate',
        name: 'steem-delegate',
        component: SteemDelegate
      },
      {
        path: 'hive-delegate',
        name: 'hive-delegate',
        component: HiveDelegate
      },
      {
        path: 'deposite',
        name: 'deposite',
        component: CrowdStaking
      }
    ]
  },
  {
    path: '/blog',
    component: Blog
  },
  {
    path: '/nps',
    component: Nps
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
        path: 'tutorials',
        component: Tutorials
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
        path: 'register-ctoken',
        component: RegisterCtoken,
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
