<template>
  <div class="page-view-content">
    <div class="container scroll-content">
      <div class="t-card my-5" >
        <div class="poster">
          <i class="back-icon" @click="$router.back()"></i>
          <div class="title-box offset-md-1 offset-1 text-left">
            <img class="logo" src="~@/static/images/logo.png" alt="">
            <div class="font-bold font28">Link Community to Web3.0</div>
          </div>
        </div>
        <div class="content-container">
          <div class="title font24">
            <div class="circle"></div>
            <div class="text">{{ $t('tutorial.createProcess') }}</div>
          </div>
          <div class="steps-box mt-4">
            <div class="step-item">
              <div class="s-card">{{ $t('tutorial.step0') }}</div>
            </div>
            <div class="step-item">
              <div class="s-card">{{ $t('tutorial.step1') }}</div>
            </div>
            <div class="step-item">
              <div class="s-card">{{ $t('tutorial.step2') }}</div>
            </div>
            <div class="step-item">
              <div class="s-card">{{ $t('tutorial.step3') }}</div>
            </div>
          </div>
          <div class="title font24 mt-5">
            <div class="circle"></div>
            <div class="text">{{ $t('tutorial.demoVideo') }}</div>
          </div>
          <div class="video-box mt-4">
            <video id="video" width="100%" controls @canplay="canPlay">
              <source src="https://cdn.wherein.mobi/nutbox-v2/video/1629821598092785.mp4" type="video/mp4">
              <!--          <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg">-->
              Your browser does not support HTML video.
            </video>
            <div class="video-mask text-center" v-if="!playing">
              <div class="font32 font-bold">{{ $t('tutorial.watchVideo') }}</div>
              <i class="play-icon" @click="play"></i>
              <div class="tip1 font12">
                {{ $t('tutorial.videoTip1', {min: 5}) }}
              </div>
              <div class="tip2 font12">{{ $t('tutorial.videoTip2') }}</div>
            </div>
          </div>
          <button class="primary-btn mt-4" @click="$router.replace('/community/create-economy')">{{ $t('tutorial.getStart') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tutorials',
  data () {
    return {
      videoPlayer: null,
      isPlay: false,
      playing: false
    }
  },
  mounted () {
    this.videoPlayer = document.getElementById('video')
  },
  methods: {
    canPlay () {
      this.isPlay = true
    },
    play () {
      if (!this.isPlay) return
      this.playing = true
      this.videoPlayer.play()
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/static/css/card/common-card";
.t-card {
  @include card(0, white, auto, fit-content);
  text-align: left;
  .poster {
    min-height: 8rem;
    background-image: url("~@/static/images/tutorials-bg.svg");
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .title-box {
      padding: 1.2rem;
    }
    .logo {
      height: 2.4rem;
      margin-left: -1rem;
    }
  }
  .back-icon {
    @include icon(1.8rem , 1.8rem);
    background-image: url("~@/static/images/left-arrow.png");
    position: absolute;
    left: 1.2rem;
    top: 1.2rem;
  }
}
.content-container {
  width: 100%;
  max-width: 35rem;
  padding: 3rem;
  .title {
    line-height: 2rem;
    display: flex;
    align-items: center;
    .circle {
      content: '';
      width: 2rem;
      height: 2rem;
      display: inline-block;
      border-radius: 50%;
      background-color: var(--primary-custom);
    }
    .text {
      position: relative;
      left: -1rem;
    }
  }
  .steps-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }
  .step-item {
    display: flex;
    position: relative;
    padding-left: 2rem;
    &::before {
      content: '';
      width: 1rem;
      height: 1rem;
      border: .4rem solid var(--primary-custom);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 1.4rem;
    }
    &::after {
      content: '';
      height: 100%;
      border-left: 2px dashed #efefef;
      position: absolute;
      left: .4rem;
      top: 2.4rem;
    }
  }
  .step-item:last-child {
    &::after {
      display: none;
    }
  }
  .s-card {
    border: 1px solid #efefef;
    padding: 1rem 1.2rem;
    border-radius: .8rem;
    width: 100%;
  }
  .video-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    min-height: 12rem;
    video {
      border-radius: 1rem;
    }
    .video-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(to bottom, rgba(white, .9) 10%, rgba(#FFDB1B, .95));
      border-radius: .8rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      z-index: 999;
      .play-icon {
        @include icon(3.4rem, 3.4rem);
        background-image: url("~@/static/images/play-icon.svg");
        margin: .5rem 0;
      }
      .tip1 {
        width: 80%;
        margin: 0 auto;
      }
      .tip2 {
        @include single-color-bg(100% .2rem, center bottom, white)
      }
    }
  }
}
@media (min-width: 760px) {
  .primary-btn {
    width: 80%;
  }
}
@media (max-width: 760px) {
  .content-container {
    padding: 2rem 1rem;
  }
}
@media (max-width: 560px) {
  .tip1 {
    display: none;
  }
}
</style>
