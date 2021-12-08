<template>
  <div class="loader-box">
    <span class="loader"
          :style="{width: loaderSize, minWidth: loaderSize, height:loaderSize, minHeight:loaderSize}"> </span>
  </div>
</template>

<script>
export default {
  name: 'UploadLoading',
  props: {
    loaderSize: {
      type: String,
      default: '4rem'
    }
  }
}
</script>

<style scoped lang="scss">
.loader-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  border-radius: .8rem;
  top: 0;
}
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @include icon(4rem, 4rem);
  background-image: url("~@/static/images/upload.svg");
  animation: bump 0.4s ease-in-out infinite alternate;
}
@keyframes bump {
  0% {  transform: translate(-50%, -40%) }
  100% {  transform: translate(-50%, -60%) }
}
</style>
