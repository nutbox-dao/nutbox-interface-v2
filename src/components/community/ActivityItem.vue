<template>
  <div class="activity-card">
    <div class="content">{{ operation.type }}</div>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <img v-if="operation.user.length > 0" class="rounded-circle"
           style="width: 2rem; height: 2rem"
           :src="operation.user" alt="">
      <span>{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { parseTimestamp } from '@/utils/helper'

export default {
  name: 'ActivityItem',
  props: {
    operation: {
      type: Object
    }
  },
  data() {
    return {
      time: ''
    }
  },
  mounted () {
    this.time = parseTimestamp(this.operation.timestamp)
    const interval = setInterval(() => {
      this.time = parseTimestamp(this.operation.timestamp)
    }, 5000);
    this.$once('hook:beforeDestroy', () => {
      window.clearInterval(interval)
    })
  },
}
</script>

<style scoped lang="scss">
.activity-card {
  @include card(.5rem, var(--block-bg), unset, fit-conent);
  font-size: .7rem;
  .content {
    @include text-multi-line(2);
  }
}
</style>
