<template>
  <div class="step-container">
    <div class="step-item" :class="step<currentStep?'active':''"
         v-for="step in totalStep" :key="step">
      <template v-if="currentStep>step">
        <i class="checked-icon"></i>
        <span class="step-label text-grey-7">{{stepLabel[step-1]}}</span>
      </template>
      <template v-else-if="currentStep===step">
        <span class="number-icon active">{{step}}</span>
        <span class="step-label">{{stepLabel[step-1]}}</span>
      </template>
      <template v-else >
        <span class="number-icon">{{step}}</span>
        <span class="step-label text-grey-7">{{stepLabel[step-1]}}</span>
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
  height: 56px;
  background-color: var(--card-bg-primary);
  padding: 0 15%;
  border-radius: 56px;
  margin-bottom: 2.4rem;
}
.step-item {
  display: flex;
  align-items: center;
  flex: 1;
  &:last-child {
    flex: none;
  }
  .checked-icon {
    @include icon(28px, 28px);
    background-image: url("~@/static/images/step-checked.svg");
    background-color: var(--primary-custom);
    border-radius: 28px;
    margin-right: .5rem;
  }
  .number-icon {
    width: 28px;
    min-width: 28px;
    height: 28px;
    min-height: 28px;
    border-radius: 28px;
    border: 1px solid var(--text-74);
    font-size: 20px;
    line-height: 20px;
    color: var(--text-74);
    margin-right: .5rem;
    font-weight: bolder;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      border-color: var(--primary-custom);
      background-color: var(--primary-custom);
      color: #141414;
    }
  }
  .step-label {
    font-size: 16px;
    font-weight: 500;
  }
  .h-line {
    flex: 1;
    height: 4px;
    @include single-color-bg(60% 2px, center, #2C2D2E);
  }
  &.active .h-line {
    @include single-color-bg(60% 2px);
  }
}
@media (max-width: 760px) {
  .step-container {
    padding: 0 1rem;
  }
}
@media (max-width: 560px) {
  .step-container {
    padding: .4rem 1.2rem;
    height: auto;
    flex-direction: column;
    margin-bottom: .5rem;
  }
  .step-item {
    .number-icon {
      margin: .2rem;
    }
    .h-line{
      display: none;
    }
    .step-label {
      font-size: 12px;
    }
  }
}
</style>
