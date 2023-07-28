import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Profile from '@/views/Profile'
import CommunityIndex from '@/views/community/Index'
import CommunityHome from '@/views/community/CommunityHome'
import DeployCommunityToken from '@/views/community/DeployCommunityToken'
import SetCommunityProfile from '@/views/community/SetCommunityProfile'
import SubCommunityIndex from '@/views/sub-community/Index'
import SubCommunityHome from '@/views/sub-community/SubCommunityHome'
import SubCommunityStaking from '@/views/sub-community/SubCommunityYieldFarming'
import SubCommunityCuration from '@/views/sub-community/SubCommunityCuration'
import SubCommunityMember from '@/views/sub-community/SubCommunityMember'
import SubCommunityGovernance from '@/views/sub-community/SubCommunityGovernance'
import SubGovernanceCreate from '@/views/sub-community/SubGovernanceCreate'
import SubGovernanceDetail from '@/views/sub-community/SubGovernanceDetail'
import SubCommunityISO from '@/views/sub-community/SubCommunityISO'
import SubCommunityNFTStaking from '@/views/sub-community/SubCommunityNFTStaking'
import SubCommunityNutPower from '@/views/sub-community/SubCommunityNutPower'
import ManageCommunityIndex from '@/views/manage-community/Index'
import CommunityProfile from '@/views/manage-community/CommunityProfile'
import CommunityAsset from '@/views/manage-community/CommunityAsset'
import CommunityStaking from '@/views/manage-community/CommunityYieldFarming'
import CommunityNFTStaking from '@/views/manage-community/CommunityNFTStaking'
import CurationPool from '@/views/manage-community/CurationPool'
import CommunitySocial from '@/views/manage-community/CommunitySocial'
import CommunityVote from '@/views/manage-community/CommunityVote'
import CommunityISO from '@/views/manage-community/CommunityISO'
import CommunityNutPower from '@/views/manage-community/CommunityNutPower'
import Faucet from '@/views/Faucet'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  },
  {
    path: '/faucet',
    component: Faucet
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityIndex,
    redirect: '/community/index',
    children: [
      {
        path: 'index',
        name: 'communityHome',
        component: CommunityHome
      }
    ]
  },
  {
    path: '/create',
    name: 'create',
    component: CommunityIndex,
    redirect: '/community/deploy-token',
    children: [
      {
        path: 'deploy-token',
        name: 'DeployCommunityToken',
        component: DeployCommunityToken
      },
      {
        path: 'set-profile',
        name: 'SetCommunityProfile',
        component: SetCommunityProfile
      }
    ]
  },
  {
    path: '/sub-community',
    name: 'subCommunity',
    component: SubCommunityIndex,
    redirect: '/sub-community/home',
    children: [
      {
        path: 'home',
        component: SubCommunityHome
      },
      {
        path: 'staking',
        component: SubCommunityStaking
      },
      {
        path: 'erc1155',
        component: SubCommunityNFTStaking
      },
      {
        path: 'curation',
        component: SubCommunityCuration
      },
      {
        path: 'member',
        component: SubCommunityMember
      },
      {
        path: 'governance',
        component: SubCommunityGovernance
      },
      {
        path: 'governance/create',
        component: SubGovernanceCreate
      },
      {
        path: 'governance/detail/:id',
        component: SubGovernanceDetail
      },
      {
        path: 'iso',
        name: 'SubCommunityISO',
        component: SubCommunityISO
      },
      {
        path: 'nut-power',
        name: 'SubCommunityNutPower',
        component: SubCommunityNutPower
      }
    ]
  },
  {
    path: '/manage-community',
    name: 'manageCommunity',
    component: ManageCommunityIndex,
    redirect: '/manage-community/profile',
    children: [
      {
        path: 'profile',
        name: 'CommunityProfile',
        component: CommunityProfile
      },
      {
        path: 'asset',
        name: 'CommunityAsset',
        component: CommunityAsset
      },
      {
        path: 'staking',
        name: 'CommunityStaking',
        component: CommunityStaking
      },
      {
        path: 'nft-staking',
        name: 'CommunityNFTStaking',
        component: CommunityNFTStaking
      },
      {
        path: 'curation',
        name: 'CurationPool',
        component: CurationPool
      },
      {
        path: 'social',
        name: 'CommunitySocial',
        component: CommunitySocial
      },
      {
        path: 'vote',
        name: 'CommunityVote',
        component: CommunityVote
      },
      {
        path: 'iso',
        name: 'CommunityISO',
        component: CommunityISO
      },
      {
        path: 'nut-power',
        name: 'CommunityNutPower',
        component: CommunityNutPower
      }
    ]
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/Error404.vue'),
    meta: {
      rule: 'editor'
    }
  },
  {
    path: '*',
    redirect: '/error-404'
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.query.id) {
    next()
  } else if (to.matched[0].path === '/sub-community' && from.query.id) {
    next({
      path: to.path,
      query: {
        ...to.query,
        id: from.query.id
      }
    })
  } else if (to.matched[0].path === '/sub-community' && !from.query.id) {
    next({
      path: '/'
    })
  } else {
    next()
  }
})
export default router
