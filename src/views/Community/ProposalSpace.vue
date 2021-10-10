<template>
  <div class="page-view-content">
    <div class="text-left">
      <b-alert show variant="info">简要说明</b-alert>
    </div>
    <div class="text-left">
      <label
        ><h3>{{ $t("community.voteProposal") }}</h3></label
      >
      <b-button
        variant="warning"
        class="createproposal"
        size="sm"
        @click="
          $router.push(
            `/community/proposal-space/${$router.currentRoute.params.key}/proposal-create`
          )
        "
      >
        {{ $t("community.createProposal") }}</b-button
      >
    </div>

    <ProposalItem
      v-for="(proposalItem, index) in proposalitems"
      :key="proposalItem.id"
      :proposalItem="proposalItem"
      :index="index"
    ></ProposalItem>
  </div>
</template>

<script>
import ProposalItem from "../../components/Community/Proposal/ProposalItem.vue";
import { handleApiErrCode, sleep } from "@/utils/helper";
import { getAllProposal } from "@/utils/web3/proposal";

export default {
  name: "Community",
  components: {
    ProposalItem,
  },
  data() {
    return {
      proposalitems: [],
    };
  },
  async mounted() {
    this.id = this.$router.currentRoute.params.key;
    this.communityId = this.$router.currentRoute.params.key;

    try {
      this.proposalitems = await getAllProposal(this.communityId);
    } catch (e) {
      handleApiErrCode(e, (info, params) => {
        this.$bvToast.toast(info, params);
      });
    }
  },
};
</script>

<style scoped lang="scss">
.createproposal {
  float: right;
}
</style>
