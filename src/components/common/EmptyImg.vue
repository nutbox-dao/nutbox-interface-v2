<template>
  <div class="no-img-box" :style="{'width': width, 'height': height, borderRadius: borderRadius}">
    <img src="~@/static/images/no-img.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'EmptyImg',
  props: {
    width: {
      type: [Number, String],
      default: '3rem'
    },
    height: {
      type: [Number, String],
      default: '3rem'
    },
    borderRadius: {
      type: [Number, String],
      default: '.2rem'
    }
  }
}
</script>

<style scoped lang="scss">
.no-img-box {
  position: relative;
  background-color: rgba(white, .5);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 50%;
  }
}
</style>
