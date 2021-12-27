<template>
  <div class="step-container">
    <div class="step-item" :class="step<currentStep?'active':''"
         v-for="step in totalStep" :key="step">
      <template v-if="currentStep>step">
        <div class="box box-checked">
          <span class="text-grey-light">Step {{step}}</span>
          <span class="step-label">{{stepLabel[step-1]}}</span>
        </div>
      </template>
      <template v-else-if="currentStep===step">
        <div class="box box-active">
          <span>Step {{step}}</span>
          <span class="step-label">{{stepLabel[step-1]}}</span>
        </div>
      </template>
      <template v-else >
        <div class="box">
          <span class="text-grey-light">Step {{step}}</span>
          <span class="step-label">{{stepLabel[step-1]}}</span>
        </div>
      </template>
      <div class="h-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: {
    totalStep: {
      type: Number,
      default: 2
    },
    currentStep: Number,
    stepLabel: {
      type: Array,
      default: () => {
        return ['1', '2']
      }
    }
  }
}
</script>

<style scoped lang="scss">
.step-container {
  display: flex;
  justify-content: space-between;
  height: 2.8rem;
  border-radius: 2.8rem;
  margin-bottom: 2.4rem;
}
.step-item {
  display: flex;
  align-items: center;
  flex: 1;
  &:last-child {
    flex: none;
  }
  .box {
    position: relative;
    padding: .8rem 2rem;
    height: 2rem;
    border: 1px solid var(--dividers);
    border-radius: 2rem;
    background-color: var(--card-bg-primary);
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--text-grey-7);
    font-size: .7rem;
    font-weight: bold;
    &-checked {
      border-color: var(--primary-custom);
      background-color: var(--primary-custom);
      color: white;
    }
    &-active {
      border-color: var(--primary-custom);
      color: var(--primary-custom);
    }
    .step-label {
      position: absolute;
      top: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      color: var(--primary-custom);
    }
  }
  .h-line {
    flex: 1;
    height: 4px;
    @include single-color-bg(60% 2px, center, #3a3b40);
  }
  &.active .h-line {
    @include single-color-bg(60% 4px);
  }
}
@media (max-width: 760px) {
  .step-container {
    padding: 0 1.2rem;
  }
}
</style>
