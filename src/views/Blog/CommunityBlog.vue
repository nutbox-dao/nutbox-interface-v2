<template>
  <div class="blog-frame">
    <div class="loading-bg" v-if="loading">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>
    <iframe v-else :src="blogLink" style="width:100%;height:100%" frameborder="0"></iframe>
  </div>
</template>

<script>
import { getAllCommunities } from '@/utils/web3/community'
export default {
  data() {
    return {
      loading: true,
      blogLink: ''
    }
  },
  async mounted () {
    const allCommunities = await getAllCommunities()
    this.blogLink = 'https://blog.nutbox.io/created/' + allCommunities[0].blogTag
    this.loading = false
  },
}
</script>

<style lang="scss" scoped>
.blog-frame {
  background-color: white;
  position: absolute;
  top: 0;
  left: 12rem;
  bottom: 0;
  right: 0;
}
@media only screen and (max-width: 960px) {
  .blog-frame {
    position: absolute;
    left: 0!important;
  }
}
</style>
