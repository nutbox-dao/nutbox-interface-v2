<template>
  <div class="step-container">
    <div class="step-item" :class="step<currentStep?'active':''"
         v-for="step in totalStep" :key="step">
      <template v-if="currentStep>step">
        <i class="checked-icon"></i>
        <span class="text-grey-light">Step{{step}}</span>
      </template>
      <template v-else-if="currentStep===step">
        <span class="number-icon active">{{step}}</span>
        <span>Step{{step}}</span>
      </template>
      <template v-else >
        <span class="number-icon">{{step}}</span>
        <span class="text-grey-light">Step{{step}}</span>
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
      default: 3
    },
    currentStep: Number
  }
}
</script>

<style scoped lang="scss">
.step-container {
  display: flex;
  justify-content: space-between;
  height: 2.8rem;
  background-color: white;
  padding: 0 15%;
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
  .checked-icon {
    @include icon(1.2rem, 1.2rem);
    background-image: url("~@/static/images/step-checked.svg");
    background-color: var(--primary-custom);
    border-radius: 1.2rem;
    margin-right: .5rem;
  }
  .number-icon {
    @include icon(1.2rem, 1.2rem);
    line-height: 1.2rem;
    border-radius: 1.2rem;
    border: 1px solid #BDBFC2;
    font-size: 1rem;
    color: #BDBFC2;
    margin-right: .5rem;
    font-weight: bolder;
    text-align: center;
    &.active {
      border-color: var(--primary-custom);
      background-color: var(--primary-custom);
      color: #242629;
    }
  }
  .h-line {
    flex: 1;
    height: 4px;
    @include single-color-bg(60% 4px, center, #F6F7F9);
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
