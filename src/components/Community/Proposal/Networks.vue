<template>
  <div>
    <!--   <div class="row">
        <div class="col-md-2">
          <b-img v-bind="mainProps" rounded="circle" alt="Circle image"></b-img>
        </div></div> -->

    <div
      class="row"
      v-for="item in networks"
      :key="item.chainId"
      @click="clickNetworks(item)"
    >
      <div class="col-2">
        <b-img
          v-bind="mainProps"
          alt="Circle image"
          rounded="circle"
          :src="getIconUrl(item.chainId)"
        ></b-img>
      </div>
      <div class="col-10">
        <h4>{{ item.name }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import networksJson from "../../../../src/assets/networks/networks.json";
export default {
  name: "Networks",
  data() {
    return {
      mainProps: {
        blank: false,
        blankColor: "#777",
        width: 45,
        height: 45,
        class: "m1",
      },
    };
  },
  computed: {
    networks() {
      const networkList = new Array();

      Object.keys(networksJson).map(function (n) {
        networkList.push(networksJson[n]);
      });

      return networkList;
    },
  },
  props: ["chooseNetWork"],
  methods: {
    getIconUrl(chainId) {
      try {
        return require(`../../../../src/assets/networks/icon/${
          chainId + ".png"
        }`);
      } catch {
        return require("../../../../src/assets/networks/icon/1.png");
      }
    },
    clickNetworks(item) {
      this.chooseNetWork(item);
    },
  },
};
</script>

<style  lang="css" scoped>
.row:hover {
  background: #eee;
}
</style>