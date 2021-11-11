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
import { mapState } from 'vuex'

export default {
  name: "StakingCardHeader",
  props: {
    card: {
      type: Object,
    },
  },
  computed: {
      ...mapState('web3', ['monitorPools']),
    status() {
      const canRemove =
        this.monitorPools[
          this.card.communityId + "-" + this.card.pid + "-canRemove"
        ];
      const hasRemoved =
        this.monitorPools[
          this.card.communityId + "-" + this.card.pid + "-hasRemoved"
        ];
      const hasStopped =
        this.monitorPools[
          this.card.communityId + "-" + this.card.pid + "-hasStopped"
        ];
      if (!hasStopped) {
        return "Active";
      } else if (!canRemove) {
        return "Stopped";
      } else {
        if (hasRemoved) {
          return "Removed";
        } else {
          return "CanRemove";
        }
      }
    },
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