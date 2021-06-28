<template>
  <div class="c-progress">
    <div class="c-progress-container" :style="{background: trackColor}"
         :data-min="min" :data-max="max">
      <div class="c-progress-bar" v-for="(data, index) of progressData" :key="index"
           :data-value="data.end"
           :style="{ flex: data.percentage,
         background: data.background || `rgba(80, 191, 0, ${(index+1) / progressData.length})`}" >
        <span class="progress-tooltip">{{data.value}}</span>
      </div>
    </div>
    <i v-if="isEdit" class="delete-icon" @click="$emit('delete')"></i>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    trackColor: {
      type: String,
      default: '#F6F7F9'
    },
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 'Max'
    },
    progressData: {
      type: Array,
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.c-progress {
  position: relative;
}
.c-progress-container {
  @include c-flex-between-center;
  height: 1.2rem;
  border-radius: 1rem;
  border: 2px solid white;
  position: relative;
  &::before {
    position: absolute;
    content: attr(data-min);
    top: 1.5rem;
  }
  &::after {
    position: absolute;
    content: attr(data-max);
    top: 1.5rem;
    right: 0;
  }
  .c-progress-bar {
    height: 100%;
    position: relative;
    border-right: 2px solid white;
    &::after {
      content: attr(data-value);
      position: absolute;
      width: 100%;
      height: 1rem;
      top: 1.5rem;
      text-align: center;
      left: 50%;
    }
  }
  .c-progress-bar:first-child {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  .c-progress-bar:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border: none;
    &::after {
      display: none;
    }
  }
}
.progress-tooltip {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #50BF00;
  font-size: .6rem;
  line-height: .8rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px 4px rgba(0, 0, 0, 0.05);
  padding: .2rem .5rem;
  min-width: 2rem;
  text-align: center;
  &::before {
    content: '';
    bottom: -.3rem;
    border-width: .3rem .3rem 0;
    border-top-color: white;
    position: absolute;
    border-style: solid;
    left: 50%;
    transform: translateX(-50%);
    color: transparent;
  }
}
.delete-icon {
  @include icon(1.2rem, 1.2rem);
  background-image: url("~@/static/images/circle-close.png");
  position: absolute;
  right: -.4rem;
  top: -.8rem;
}
</style>
