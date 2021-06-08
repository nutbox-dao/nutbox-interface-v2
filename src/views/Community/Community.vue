<template>
  <div class="page-view-content">
    <div class="top row">
      <div class="col-md-4 text-left">
        <div class="page-view-title">{{$t("community.community") }}</div>
        <div class="page-view-subtitle">Choose token type you want deploy</div>
      </div>
      <div class="col-md-8 btn-group">
        <button  @click="$router.push('/add-pool')">Manage Your Community</button>
        <button @click="$router.push('/deploy-token')">
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
          <IndexCard/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IndexCard from '@/components/Community/IndexCard'
export default {
  name: 'Community',
  components: { IndexCard }
}
</script>

<style scoped lang="scss">
.top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.btn-group {
  display: flex;
  gap: .4rem;
  justify-content: flex-end;
  button {
    border-radius: .6rem;
    padding: .5rem .8rem;
    font-size: .8rem;
    line-height: .8rem;
    border: 1px solid var(--primary-custom);
  }
  button:nth-child(1) {
    background: white;
  }
  button:nth-child(2) {
    background: var(--primary-custom);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-icon {
    @include icon;
    min-width: 1rem;
    margin-right: .2rem;
    background-image: url("~@/static/images/add-icon.svg");
  }
}
@media (max-width: 768px) {
  .btn-group {
    margin-top: 1rem;
    flex-direction: column;
  }
  .btn-group button {
    line-height: 1rem;
  }
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
