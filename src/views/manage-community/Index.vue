<template>
  <div class="container h-100" style="overflow-x: hidden">
    <div class="manage-index-page">
      <div class="m-menu">
        <div class="m-menu-card font16 line-height16">
          <b-nav vertical class="overflow-hidden">
            <b-nav-item to="/manage-community/profile">
              <i class="menu-icon home-icon" />
              <span>{{ $t('router.profile') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/asset">
              <i class="menu-icon asset-icon" />
              <span>{{ $t('router.asset') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/iso">
              <i class="menu-icon iso-icon" />
              <span>ISO</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/staking">
              <i class="menu-icon farming-icon" />
              <span>{{ $t('router.farming') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/staking2">
              <i class="menu-icon farming-icon" />
              <span>{{ $t('router.farming2') }}</span>
            </b-nav-item>
            <b-nav-item to="/manage-community/nft-staking">
              <i class="menu-icon nft-icon" />
              <span>{{ $t('router.nftStake') }}</span>
            </b-nav-item>
            <!-- <b-nav-item to="/manage-community/curation">
              <i class="menu-icon curation-icon" />
              <span>{{ $t('router.curation') }}</span>
            </b-nav-item> -->
            <!-- <b-nav-item to="/manage-community/nut-power">
              <i class="menu-icon nut-power-icon" />
              <span>{{ $t('router.nutPower') }}</span>
            </b-nav-item> -->
            <!-- <b-nav-item to="/manage-community/vote">
              <i class="menu-icon governance-icon" />
              <span>{{ $t('router.governance') }}</span>
            </b-nav-item> -->
            <b-nav-item to="/manage-community/social">
              <i class="menu-icon social-icon" />
              <span>{{ $t('router.social') }}</span>
            </b-nav-item>
      <!--      <b-nav-item to="/manage-community/game">{{ $t('game.game') }}</b-nav-item>-->
          </b-nav>
        </div>
      </div>
      <div class="m-page">
        <router-view></router-view>
      </div>
    </div>
     <!-- grant mint role tip -->
    <b-modal
      v-model="showGrantRole"
      modal-class="custom-modal"
      size="m"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
    >
      <div class="custom-form position-relative">
        <i class="modal-close-icon-right" @click="goHome"></i>
        <div class="modal-title text-red font-bold">{{ $t('operation.grantMintRole') }}</div>
        <div class="mb-4 font16 line-height24 text-center my-3">
          <p>
              {{ $t('tip.mintableTip1') }}
          </p>
          <p>
            {{ $t('tip.mintableTip2') }}
          </p>
        </div>

        <div class="d-flex justify-content-between" style="gap: 2rem">
          <button
            class="primary-btn"
            @click="grant"
            :disabled="granting"
          >
          <b-spinner
            small
            type="grow"
            v-show="granting"
          ></b-spinner>
            {{ $t("operation.grant") }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getMyCommunityData } from '@/utils/graphql/user'
import { getMyCommunityContract, getApprovement } from '@/utils/web3/community'
import { NutAddress } from '@/config'
import { hasMintRole, getCToken, grantMintRole } from '@/utils/web3/asset'
import { getCommunityRewardPerBlock } from '@/utils/web3/community'

export default {
  name: 'Index',
  data() {
    return {
      showGrantRole: false,
      granting: false,
      communityId: ''
    }
  },
  async mounted () {
    try{
      const communityId = await getMyCommunityContract()
      this.communityId = communityId;
      getMyCommunityData().then(async (res) => {
        // if ctoken is a mintable token and the token is custom has community hasn't token's mint role
        // we need to remind user to grant the token's mint role to this community
        const [hasRole, {isMintable}] = await Promise.all([hasMintRole(res.cToken, res.id), getCToken(res.id)])
        this.showGrantRole = isMintable && !hasRole
      });
      this.$store.commit('community/saveLoadingApproveCommunity', true)

      getCommunityRewardPerBlock(communityId)

      // getApprovement(NutAddress, communityId).then(res => {
      //   this.$store.commit('community/saveApprovedCommunity', res)
      // }).finally(() => {
      //   this.$store.commit('community/saveLoadingApproveCommunity', false)
      // })
    }catch(e) {
      // no registered
      this.$router.replace('/')
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async grant() {
      try {
        this.granting = true
        const {address} = await getCToken(this.communityId)
        await grantMintRole(address, this.communityId)
        this.$bvToast.toast('Grant success!', {
          title: this.$t('tip.success'),
          variant: 'success'
        })
        this.showGrantRole = false
      } catch (e) {
        console.log(456, e);
        this.$bvToast.toast('Grant fail!', {
          title: this.$t('tip.error'),
          variant: 'danger'
        })
      } finally {
        this.granting = false
      }
    }
  },
}
</script>

<style scoped lang="scss">
.manage-index-page {
  height: 100%;
  display: flex;
  .m-menu {
    width: 170px;
    height: calc(100% - 16px);
    margin-right: 16px;
  }
  .m-page {
    flex: 1;
    overflow-x: hidden;
  }
}
@media (max-width: 767px) {
  .m-menu {
    display: none;
  }
}
.m-menu-card {
  @include card(12px 0);
  width: 100%;
  .nav-item {
    width: 100%;
  }
  .nav-item span {
    white-space: nowrap;
  }
  .nav-item a{
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text-74);
    display: flex;
    align-items: center;
    padding: 12px 19px;
    user-select: none;
    &.active {
      color: var(--primary-custom);
      font-weight: bold;
    }
  }
}
.menu-icon {
  @include icon(24px, 24px);
  margin-right: .4rem;
}
.home-icon {
  background-image: url("~@/static/images/menu-home.svg");
}
.asset-icon {
  background-image: url("~@/static/images/m-menu-asset.svg");
}
.farming-icon {
  background-image: url("~@/static/images/menu-farming.svg");
}
.iso-icon {
  background-image: url("~@/static/images/menu-stake.svg");
}
.nut-power-icon {
  background-image: url("~@/static/images/menu-nut-power.svg");
}
.governance-icon {
  background-image: url("~@/static/images/menu-governance.svg");
}
.social-icon {
  background-image: url("~@/static/images/menu-social.svg");
}
.nft-icon {
  background-image: url("~@/static/images/menu-nft.svg");
}
.curation-icon {
  background-image: url("~@/static/images/menu-curation.svg");
}
.active {
  .home-icon {
    background-image: url("~@/static/images/m-menu-home-active.svg");
  }
  .asset-icon {
    background-image: url("~@/static/images/m-menu-asset-active.svg");
  }
  .farming-icon {
    background-image: url("~@/static/images/m-menu-farming-active.svg");
  }
  .iso-icon {
    background-image: url("~@/static/images/m-menu-stake-active.svg");
  }
  .nut-power-icon {
    background-image: url("~@/static/images/m-menu-nut-power-active.svg");
  }
  .governance-icon {
    background-image: url("~@/static/images/m-menu-governance-active.svg");
  }
  .social-icon {
    background-image: url("~@/static/images/m-menu-social-active.svg");
  }
  .nft-icon {
    background-image: url("~@/static/images/m-menu-nft-active.svg");
  }
  .curation-icon {
    background-image: url("~@/static/images/menu-curation-active.svg");
  }
}
</style>
