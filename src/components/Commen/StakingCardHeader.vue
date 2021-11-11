<template>
  <div class="card-link-top-box">
    <div class="status-container text-right">
      <span v-if="status === 'Active'" :class="'Active'">{{
        $t("community." + status)
      }}</span>
      <span v-else class="Completed">{{ $t("community." + status) }}</span>
    </div>
    <div class="flex-start-center">
      <div class="card-link-icons">
        <img class="icon1" :src="card.communityIcon" alt="" />
        <img class="icon2" src="~@/static/images/hive-logo.png" alt="" />
      </div>
      <div class="card-link-title-text font20 font-bold">
        <div class="link-title" @click="openNewTab(card.communityId)">
          <span :id="card.communityId + card.pid + 'com'">{{
            card.communityName
          }}</span>
          <b-popover
            :target="card.communityId + card.pid + 'com'"
            triggers="hover focus"
            placement="top"
          >
            {{ card.communityName }}
          </b-popover>
          <i class="link-icon"></i>
        </div>
        <div class="link-title">
          <span :id="card.communityId + card.pid + 'pool'">{{
            card.poolName
          }}</span>
          <b-popover
            :target="card.communityId + card.pid + 'pool'"
            triggers="hover focus"
            placement="bottom"
          >
            {{ card.poolName }}
          </b-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "StakingCardHeader",
  props: {
    card: {
      type: Object,
    },
    status: {
      type: String
    }
  },
  methods: {
    openNewTab (id) {
      window.open(`${window.location.origin}/#/specify?id=${id}`, '_blank')
    }
  },
};
</script>

<style lang="scss" scoped>
@import "src/static/css/card/common-card";
</style>