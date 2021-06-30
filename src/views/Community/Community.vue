<template>
  <div class="page-view-content">
    <div class="view-top-header row">
      <div class="col-md-4 text-left">
        <div class="page-view-title">{{$t("community.community") }}</div>
        <div class="page-view-subtitle">Choose token type you want deploy</div>
      </div>
      <div class="col-md-8 btn-group">
        <button v-if="userEconomy"
                @click="$router.push('/community/pool-dashboard')">Manage Your Community</button>
        <button v-else @click="$router.push('/community/create-economy')">
          <i class="add-icon"></i>
          <span>Create Your Own Staking Economy</span>
        </button>
      </div>
    </div>
    <b-input-group class="search-input">
      <b-form-input placeholder="Search"></b-form-input>
      <template #append>
        <i class="search-icon"></i>
      </template>
    </b-input-group>
    <div class="scroll-content">
      <div class="row">
        <div class="col-xl-4 col-md-6 mb-4" v-for="i of 5" :key="i">
          <CommunityCard/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommunityCard from '@/components/Community/CommunityCard'
import { mapState } from 'vuex'
export default {
  name: 'Community',
  components: { CommunityCard },
  computed: {
    ...mapState({
      userEconomy: state => state.community.userEconomy
    })
  }
}
</script>

<style scoped lang="scss">
.view-top-header {
  align-items: flex-end;
}
.search-input {
  background: white;
  @include c-flex-between-center;
  border-radius: .6rem;
  margin: 2.4rem 0;
  input {
    border: none;
    height: 2.8rem;
    outline: none;
    border-radius: .6rem;
  }
  .search-icon {
    @include icon(1.2rem, 1.2rem);
    margin: .8rem;
    background-image: url("~@/static/images/search-icon.svg");
  }
}
</style>
