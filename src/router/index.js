import Vue from 'vue'
import VueRouter from 'vue-router'

import Blog from '../views/Blog/Blog'
import CrowdStaking from '../views/CrowdStaking/CrowdStaking'
import Crowdloan from '../views/Crowdloan/Crowdloan'
import PolkadotCrowdloan from '../views/Crowdloan/Polkadot'
import KusamaCrowdloan from '../views/Crowdloan/Kusama'
import Wallet from '../views/Wallet/Wallet'
import PolkadotWallet from '../views/Wallet/Polkadot'
import KusamaWallet from '../views/Wallet/Kusama'
import Admin from '../views/Admin/Admin'
import PolkadotAdmin from '../views/Admin/Polkadot'
import KusamaAdmin from '../views/Admin/Kusama'
import PolkadotCrowdstaking from '../views/CrowdStaking/Polkadot'
import KusamaCrowdstaking from '../views/CrowdStaking/Kusama'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/crowdloan'
  },
  {
    path:'/wallet',
    component: Wallet,
    children: [
      {
        path:'',
        component: PolkadotWallet
      },
      {
        path:'kusama',
        component: KusamaWallet
      }
    ]
  },
  {
    path: '/crowdloan',
    name: 'crowdloan',
    component: Crowdloan,
    children: [
      {
        path: '',
        name: 'kusama',
        component: KusamaCrowdloan
      },
      {
        path: 'polkadot',
        name: 'polkadot',
        component: PolkadotCrowdloan
      }
    ]
  },
  {
    path: '/crowdstaking',
    component: CrowdStaking,
    children: [
      {
        path: 'kusama',
        name: 'kusama',
        component: KusamaCrowdstaking
      },
      {
        path: '',
        name: 'polkadot',
        component: PolkadotCrowdstaking
      }
    ]
  },
  {
    path: '/blog',
    component: Blog,
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
      }
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

export default router
