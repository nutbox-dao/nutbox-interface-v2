<template>
  <div class="loader-box">
    <span class="loader"> </span>
  </div>
</template>

<script>
export default {
  name: 'UploadLoading'
}
</script>

<style scoped lang="scss">
.loader-box {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  border-radius: .8rem;
}
.loader {
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 10px;
  background: var(--primary-custom);
  display: inline-block;
  &::after {
    content: '';
    left: 50%;
    top: -47px;
    transform: translate(-50%, 0);
    position: absolute;
    border: 15px solid transparent;
    border-bottom-color: var(--primary-custom);
    animation: bump 0.4s ease-in-out infinite alternate;
  }
  &::before {
    content: '';
    left: 50%;
    bottom: 15px;
    transform: translate(-50%, 0);
    position: absolute;
    width: 15px;
    height: 20px;
    background: var(--primary-custom);
    animation: bump 0.4s ease-in-out infinite alternate;

  }
}
@keyframes bump {
  0% {  transform: translate(-50%, 5px) }
  100% {  transform: translate(-50% , -5px ) }
}
</style>
