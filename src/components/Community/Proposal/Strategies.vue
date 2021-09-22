<template>
  <div>
    <div
      v-for="item in tempStrategies"
      :key="item.key"
      @click="clickStrategies(item)"
    >
      <b-card :title="item.key" :sub-title="item.version" class="mb-3">
        <div>{{ item.author }}</div>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Strategies",
  data() {
    return {};
  },
  computed: {
    tempStrategies() {
      const strategiesList = new Array();

      for (let key in this.strategies) {
        strategiesList.push(this.strategies[key]);
      }

      return strategiesList;
    },
  },
  props: ["strategies", "chooseStrategy", "currentStrategyControlId"],
  methods: {
    clickStrategies(item) {
      this.chooseStrategy(item, this.currentStrategyControlId);
    },
  },
};
</script>

<style  lang="css" scoped>
.row:hover {
  background: #eee;
}
</style>