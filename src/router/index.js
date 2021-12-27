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
import SubCommunityStaking from '@/views/sub-community/SubCommunityStaking'
import SubCommunityMember from '@/views/sub-community/SubCommunityMember'
import SubCommunityGovernance from '@/views/sub-community/SubCommunityGovernance'
import SubGovernanceCreate from '@/views/sub-community/SubGovernanceCreate'
import SubGovernanceDetail from '@/views/sub-community/SubGovernanceDetail'
import ManageCommunityIndex from '@/views/manage-community/Index'
import CommunityProfile from '@/views/manage-community/CommunityProfile'
import CommunityAsset from '@/views/manage-community/CommunityAsset'
import CommunityStaking from '@/views/manage-community/CommunityStaking'
import CommunitySocial from '@/views/manage-community/CommunitySocial'
import CommunityVote from '@/views/manage-community/CommunityVote'
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
    path: '/community',
    name: 'community',
    component: CommunityIndex,
    redirect: '/community/index',
    children: [
      {
        path: 'index',
        component: CommunityHome
      },
      {
        path: 'deploy-token',
        component: DeployCommunityToken
      },
      {
        path: 'set-profile',
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
        path: 'home/:id',
        component: SubCommunityHome
      },
      {
        path: 'staking',
        component: SubCommunityStaking
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
        path: 'governance/detail',
        component: SubGovernanceDetail
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
        component: CommunityProfile
      },
      {
        path: 'asset',
        component: CommunityAsset
      },
      {
        path: 'staking',
        component: CommunityStaking
      },
      {
        path: 'social',
        component: CommunitySocial
      },
      {
        path: 'vote',
        component: CommunityVote
      }
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.query.id) {
//     next()
//   } else if (to.matched[0].path === '/specify' && from.query.id) {
//     next({
//       path: to.path,
//       query: {
//         ...to.query,
//         id: from.query.id
//       }
//     })
//   } else if (to.matched[0].path === '/specify' && !from.query.id) {
//     next({
//       path: '/'
//     })
//   } else {
//     next()
//   }
// })
export default router
