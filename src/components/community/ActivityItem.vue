<template>
  <div class="activity-card">
    <div class="content">{{content}}</div>
    <div class="d-flex justify-content-between align-items-center mt-2">
      <img v-if="avatar" class="rounded-circle"
           style="width: 2rem; height: 2rem"
           :src="avatar" alt="">
      <empty-img width="2rem" height="2rem" class="rounded-circle mx-0"></empty-img>
      <span>{{time}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityItem',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: new Date().toLocaleDateString()
    },
    content: {
      type: String,
      default: 'Bill Warren voted Yes on Minion Erc20 Token Transfer Proposal Bill Warren voted Yes on Minion Erc20 Token Transfer Proposal'
    }
  }
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
