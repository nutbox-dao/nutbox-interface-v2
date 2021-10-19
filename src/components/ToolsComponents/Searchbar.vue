<template>
  <div class="search-bar flex-between-center" :class="isExpand?'expand': ''">
    <i class="search-icon" @click="isExpand=true"></i>
    <input class="search-input" type="text" name="" placeholder="Search" v-model="searchText">
    <i v-if="searchText.trim()!==''" class="clear-input-text text-grey" @click="searchText = ''"></i>
    <span class="cancel-btn" @click="isExpand=false">{{ $t('commen.cancel') }}</span>
  </div>
</template>

<script>
export default {
  name: 'Searchbar',
  data () {
    return {
      isExpand: false,
      searchText: ''
    }
  },
  methods: {
    onSearchIcon () {

    }
  }
}
</script>

<style scoped lang="scss">
.search-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 2.4rem;
  border-radius: .8rem;
  padding: .6rem;
  background: white;
  transition: 0.4s;
  width: 15rem;
  max-width: 15rem;
  .search-icon {
    @include icon(1.2rem, 1.2rem);
    background-image: url("~@/static/images/search-icon.svg");
  }
  input {
    border:none;
    background: none;
    outline:none;
    flex: 1;
    padding: 0 .4rem;
  }
  .clear-input-text {
    display: flex;
  }
  .clear-input-text::after {
    content: '';
    display: inline-block;
    @include icon;
    background-image: url("~@/static/images/circle-close.png");
  }
  .cancel-btn {
    white-space: nowrap;
    display: none;
  }
}

@media (max-width: 620px) {
  .search-bar {
    background: transparent;
    width: 2rem;
    overflow: hidden;
    height: 3rem;
    &.expand {
      background: white;
      width: 100%;
      max-width: 100%;
      transition: 0.4s;
    }
    .cancel-btn {
      display: inline-block;
    }
  }
}
</style>
