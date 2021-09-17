<template>
  <div class="blog-frame">
    <iframe src="https://blog.nutbox.io" style="width:100%;height:100%" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.blog-frame {
  background-color: white;
  position: absolute;
  top: 3.8rem;
  left: 0;
  bottom: 0;
  right: 0;
}
@media only screen and (max-width: 960px) {
  .blog-frame {
    position: absolute;
    left: 0!important;
    top: 3.6rem!important;
  }
}
</style>
