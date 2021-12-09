<template>
  <div class="sub-community-page">
    <b-sidebar id="sidebar-menu"
               sidebar-class="bg-transparent" no-header
               body-class="bg-transparent d-flex flex-column"
               :backdrop="screenWidth < 992" :visible="screenWidth > 992">
      <div class="slider-content">
        <div class="menu-items">
          <b-nav vertical align="center" class="top">
            <b-nav-item to="/sub-community/home">
              <i id="home-icon" class="menu-icon" />
              <span>Home</span>
            </b-nav-item>
            <b-nav-item to="/community/home">
              <i id="stake-icon" class="menu-icon" />
              <span>{{ $t("commen.crowdstaking") }}</span>
            </b-nav-item>
            <b-nav-item to="/community/home">
              <i id="blog-icon" class="menu-icon" />
              <span>{{ $t("commen.blog") }}</span>
            </b-nav-item>
          </b-nav>
        </div>
      </div>
    </b-sidebar>
    <div class="sub-page-container">
      <div class="sub-page-header" v-if="screenWidth < 992">
        <img class="menu-toggle ml-2"
             src="~@/static/images/menu-icon.svg" alt="" v-b-toggle.sidebar-menu/>
      </div>
      <div class="sub-page-content d-flex">
        <div class="page-view">
          <router-view></router-view>
        </div>
        <div class="activity-banner">
          <div class="a-banner-card">
            <div class="mt-2 mb-4">Activities</div>
            <ActivityItem class="mt-3" v-for="i of 4" :key="i"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityItem from '@/components/community/ActivityItem'
export default {
  name: 'Index',
  components: { ActivityItem },
  data () {
    return {
      screenWidth: document.body.clientWidth

    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
.sub-community-page {
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sub-page-container {
  flex: 1;
  padding-left: 12rem;
  display: flex;
  overflow: hidden;
}
.menu-toggle {
  width: 1.4rem;
}
.slider-content {
  height: 100%;
  flex: 1;
  background-color: var(--card-bg-primary);
  padding: 1rem 0;
  .menu-items {
    .nav-link {
      display: flex;
      align-items: center;
    }
    i {
      margin-right: .5rem;
      opacity: .8;
    }
    span {
      color: rgba(white, .8);
    }
    .active span {
      color: white;
      font-weight: bold;
    }
    .active i {
      opacity: 1;
    }
  }
}
.sub-page-content {
  width: 100%;
  .page-view {
    flex: 1;
  }
  .activity-banner {
    width: 25%;
    min-width: 16rem;
    padding: 0 .8rem .8rem;
  }
  .a-banner-card {
    @include card();
  }
}
@media (min-width: 992px) {
  .slider-content {
    margin: 0 .8rem .8rem;
    border-radius: .8rem;
    border: 1px solid var(--card-broder);
  }
}
@media (max-width: 991px) {
  .slider-content {
    margin: 0;
  }
  .sub-page-container {
    padding-left: 0;
    flex-direction: column;
  }
  .sub-page-content {
    flex-direction: column;
    overflow: scroll;
    .page-view {
      padding: 0 .8rem;
    }
    .activity-banner {
      width: 100%;
      height: fit-content;
    }
  }
}
.menu-icon {
  @include icon(1.2rem, 1.2rem);
}
#home-icon {
  background-image: url("~@/static/images/menu-home.svg");
}
#blog-icon {
  background-image: url("~@/static/images/menu-blog.svg");
}
#stake-icon {
  background-image: url("~@/static/images/menu-stake.svg");
}
</style>
