<template>
  <div class="nominations">
    <div class="loading-bg" v-if="loadingStaking">
      <img src="~@/static/images/loading.gif" alt="" />
      <p class="font16">{{ $t("tip.loading") }}</p>
    </div>

    <div class="empty-bg" v-if="!loadingStaking && nominators.length === 0">
      <img src="~@/static/images/empty-data.png" alt="" />
      <p>{{ $t("tip.noNominations") }}</p>
    </div>

    <div v-show="nominators.length > 0 && !loadingStaking">
      <b-card class="table-card">
        <b-table
          :items="nominators"
          :fields="fields"
          thead-tr-class="th-cell"
          table-class="c-table"
          hover
          tbody-tr-class="c-tr"
          thead-class="c-th"
        >
          <template #cell(icon)="row">
            <!-- <b-avatar size="sm" class="mr-2">C</b-avatar> -->
            <Identicon
              class="ident-icon"
              :size="30"
              theme="polkadot"
              :value="row.item.address"
            />
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Identicon from "@polkadot/vue-identicon";

export default {
  name: "UserContributions",
  props: {
    chain: {
      type: String,
      default: "polkadot",
    },
  },
  computed: {
    ...mapState(['account']),
    ...mapState('polkadot', ["nominators", "loadingStaking"]),
  },
  components: {
    Identicon,
  },
  data() {
    return {
      fields: [],
    };
  },
  methods: {},
  async mounted() {
    this.fields = [
      { key: "icon", label: "", class: "text-right" },
      {
        key: "nick",
        label: this.$t("validator.validator"),
        class: "text-left",
      },
      {
        key: "otherStake",
        label: this.$t("validator.otherStake"),
        class: "text-right",
      },
      {
        key: "ownStake",
        label: this.$t("validator.ownStake"),
        class: "text-right",
      },
      {
        key: "commission",
        label: this.$t("validator.commission"),
        class: "text-right",
      },
    ];
  },
};
</script>

<style lang="less" scoped>
.table-card {
  border-radius: 1.4rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
  border: none;
  .card-body {
    padding: 0;
    margin: 1rem;
    overflow: auto;
  }
}

.Active {
  color: rgba(80, 191, 0, 1);
}
.Retired {
  color: rgba(248, 182, 42, 1);
}
.Completed {
  color: rgba(255, 91, 77, 1);
}
.change-page-box {
  margin: 1rem auto;
}
</style>
